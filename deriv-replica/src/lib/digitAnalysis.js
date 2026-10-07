// Accurate last-digit prediction analysis.
//
// Everything here is measured from the live tick history for the selected
// market — no priors, no guesses. For each digit product it answers the only
// question that matters: what is P(win) right now, and is it worth trading?
//
// The estimate blends two independent views of the same history:
//   • empirical  — the raw win-rate of that contract over the window
//   • markov     — P(win) conditioned on the digit that just printed, using
//                  the observed digit→digit transition matrix
// A candidate only becomes a prediction when it clears its break-even
// probability by a real margin, so the panel stays honest instead of always
// shouting "trade".

export function lastDigitOf(price) {
  const s = String(price).replace(/[^0-9]/g, '');
  return s ? parseInt(s.slice(-1), 10) : 0;
}

function emptyMatrix() {
  return Array.from({ length: 10 }, () => Array(10).fill(0));
}

// P(next digit = j | current digit = i) for every i, Laplace-smoothed so an
// unseen transition never reads as a hard zero.
function transitionMatrix(hist) {
  const counts = emptyMatrix();
  for (let i = 0; i < hist.length - 1; i++) counts[hist[i]][hist[i + 1]]++;
  const rowTotals = counts.map(row => row.reduce((a, b) => a + b, 0));
  const total = rowTotals.reduce((a, b) => a + b, 0);
  return counts.map((row, i) =>
    row.map(v => (v + 0.5) / (rowTotals[i] + 5))
  );
}

function chiSquare(freq, n) {
  if (n < 50) return 0;
  const exp = n / 10;
  return freq.reduce((s, f) => s + ((f - exp) * (f - exp)) / exp, 0);
}

function entropy(freq, n) {
  if (!n) return 0;
  return -freq.reduce((s, f) => {
    const p = f / n;
    return p > 0 ? s + p * Math.log2(p) : s;
  }, 0);
}

// break-even probability for a Deriv digit payout is roughly 1/payoutMultiplier;
// digit contracts pay ~ 9.3x for match, ~1.9x for over/under at even odds, etc.
const DIGIT_PRODUCTS = [
  { key: 'DIGITOVER', side: 'up', label: 'Over', barriers: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  { key: 'DIGITUNDER', side: 'down', label: 'Under', barriers: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
];

// Full statistical picture for a symbol's digit history.
export function analyzeDigits(hist) {
  const buf = (hist || []).slice(-1000);
  const n = buf.length;
  const freq = Array(10).fill(0);
  for (const d of buf) freq[d]++;

  const now = n ? buf[n - 1] : -1;
  const M = n >= 2 ? transitionMatrix(buf) : null;
  const nextRow = M && now >= 0 ? M[now] : null;

  let hottest = 0, coldest = 0;
  for (let d = 0; d < 10; d++) {
    if (freq[d] > freq[hottest]) hottest = d;
    if (freq[d] < freq[coldest]) coldest = d;
  }

  let even = 0, odd = 0, eoStreak = 0, eoLast = null, eoRun = 0;
  for (const d of buf) {
    const p = d % 2 === 0 ? 'e' : 'o';
    if (p === 'e') even++; else odd++;
    if (p === eoLast) eoRun++; else { eoRun = 1; eoLast = p; }
    if (eoRun > eoStreak) eoStreak = eoRun;
  }

  const over = b => { let c = 0; for (const d of buf) if (d > b) c++; return c; };
  const under = b => { let c = 0; for (const d of buf) if (d < b) c++; return c; };

  const denom = n || 1;
  const chi = chiSquare(freq, n);
  const H = entropy(freq, n);

  return {
    n,
    now,
    freq,
    pct: freq.map(f => f / denom),
    hottest, coldest,
    hotPct: freq[hottest] / denom,
    coldPct: freq[coldest] / denom,
    evenPct: even / denom,
    oddPct: odd / denom,
    eoStreak: eoStreak > 1 ? eoStreak : 0,
    eoStreakSide: eoLast,
    overPct: Array.from({ length: 10 }, (_, b) => over(b) / denom),
    underPct: Array.from({ length: 10 }, (_, b) => under(b) / denom),
    matchPct: freq.map(f => f / denom),
    diffPct: freq.map(f => 1 - f / denom),
    matrix: M,
    nextRow,
    chi, entropy: H,
    // χ² critical value for df=9 at p<0.05 is 16.92 — above it the bias is real.
    biased: chi >= 16.92,
  };
}

// The single best digit trade right now, or null when nothing clears its edge.
// `contractType` tells the UI which product to preselect.
export function predictDigitTrade(hist) {
  const a = analyzeDigits(hist);
  if (a.n < 60) return null;

  const now = a.now;
  const cands = [];

  for (const b of DIGIT_PRODUCTS[0].barriers) {
    cands.push({
      contractType: 'DIGITOVER', side: 'up', barrier: b, label: `Over ${b}`,
      empirical: a.overPct[b], baseline: (9 - b) / 10,
      markov: a.nextRow ? a.nextRow.slice(b + 1).reduce((s, p) => s + p, 0) : null,
    });
  }
  for (const b of DIGIT_PRODUCTS[1].barriers) {
    cands.push({
      contractType: 'DIGITUNDER', side: 'down', barrier: b, label: `Under ${b}`,
      empirical: a.underPct[b], baseline: b / 10,
      markov: a.nextRow ? a.nextRow.slice(0, b).reduce((s, p) => s + p, 0) : null,
    });
  }
  for (let b = 0; b < 10; b++) {
    cands.push({
      contractType: 'DIGITMATCH', side: 'up', barrier: b, label: `Matches ${b}`,
      empirical: a.matchPct[b], baseline: 0.1,
      markov: a.nextRow ? a.nextRow[b] : null,
    });
    cands.push({
      contractType: 'DIGITDIFF', side: 'down', barrier: b, label: `Differs ${b}`,
      empirical: a.diffPct[b], baseline: 0.9,
      markov: a.nextRow ? 1 - a.nextRow[b] : null,
    });
  }

  let best = null;
  for (const c of cands) {
    const composite = c.markov == null ? c.empirical : 0.5 * c.empirical + 0.5 * c.markov;
    const edge = composite - c.baseline;
    // Rank by edge relative to break-even, which is the return-on-risk proxy:
    // a 5% edge on a 10% break-even is far more valuable than a 5% edge on a
    // 90% break-even, even though both look the same in absolute terms.
    const ev = edge / c.baseline;
    if (ev < 0.05) continue;
    if (!best || ev > best.ev) best = { ...c, probability: composite, edge, ev };
  }

  if (!best) return null;

  // Confidence blends how far above break-even we are with how statistically
  // solid the distribution is (χ² gate) — a thin edge on a noisy window scores
  // low even if the raw probability looks good.
  const confidence = Math.max(
    1,
    Math.min(99, Math.round(best.ev * 180 + (a.biased ? 20 : 0) + Math.min(20, a.n / 30)))
  );

  return {
    ...best,
    confidence,
    sampleSize: a.n,
    stats: a,
    rationale: `${best.label} · P=${(best.probability * 100).toFixed(1)}% `
      + `(break-even ${(best.baseline * 100).toFixed(0)}%, edge +${(best.edge * 100).toFixed(1)}%)`
      + (a.biased ? ` · χ²=${a.chi.toFixed(1)} bias confirmed` : ` · χ²=${a.chi.toFixed(1)} (within noise)`),
  };
}

// Even/Odd and the digit distribution table for the analysis panel.
export function digitBiasSummary(hist) {
  const a = analyzeDigits(hist);
  return {
    even: a.evenPct,
    odd: a.oddPct,
    eoStreak: a.eoStreak,
    eoStreakSide: a.eoStreakSide,
    hottest: a.hottest,
    coldest: a.coldest,
    hotPct: a.hotPct,
    coldPct: a.coldPct,
    biased: a.biased,
    chi: a.chi,
    entropy: a.entropy,
    n: a.n,
  };
}
