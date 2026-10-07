// Last-digit distribution analysis.
//
// Everything here is measured from the live tick history for the selected
// market — no priors, no guesses. It feeds the digit panel: per-digit
// frequency, hot/cold, even/odd, streak, χ² and Shannon entropy.

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
    matrix: M,
    nextRow,
    chi, entropy: H,
    // χ² critical value for df=9 at p<0.05 is 16.92 — above it the bias is real.
    biased: chi >= 16.92,
  };
}
