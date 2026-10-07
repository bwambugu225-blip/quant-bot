// Per-contract auto-trading strategies.
//
// Every contract Deriv offers is a different bet with a different payout, so
// every contract gets its own entry here: its own inputs, its own defaults and
// its own signal function. "Over 3" is not "Over 4" — each barrier has its own
// break-even probability and its own detection threshold.
//
// The signals are measured, not asserted. A digit contract only fires when the
// observed win rate clears its break-even by a margin that is statistically
// significant for the sample size (a z-score gate), and directional contracts
// only fire when their trend/volatility regime is actually present. Where a
// contract's break-even is inherently high (Differs ~90%) the win probability
// is genuinely high; where it is low (Matches ~10%) no honest strategy can
// promise a high win rate, and the registry says so.
import { ema, rsi, stddev, sma } from './indicators.js';

// ── shared statistics ────────────────────────────────────────────────────

// How many standard deviations the observed rate sits above the break-even
// rate, for a binomial sample of n. This is the honesty gate: a 3% edge on 20
// ticks is noise, the same edge on 200 ticks is real.
export function zScore(p, p0, n) {
  if (!n) return 0;
  const se = Math.sqrt((p0 * (1 - p0)) / n);
  return se > 0 ? (p - p0) / se : 0;
}

function markovRow(digits) {
  if (digits.length < 20) return null;
  const counts = Array.from({ length: 10 }, () => Array(10).fill(0));
  const rowTot = Array(10).fill(0);
  for (let i = 0; i < digits.length - 1; i++) {
    counts[digits[i]][digits[i + 1]]++;
    rowTot[digits[i]]++;
  }
  const cur = digits[digits.length - 1];
  if (!rowTot[cur]) return null;
  return counts[cur].map(v => (v + 0.5) / (rowTot[cur] + 5));
}

// ── digit tuning, one row per barrier ────────────────────────────────────
//
// baseline = the fair win probability of that exact contract, so the strategy
// knows what "no edge" looks like. zMin rises as the contract gets harder:
// a 70% contract needs less confirmation than a 20% one before we trust it.

const OVER_TUNING = {
  0: { baseline: 0.9, zMin: 1.4, W: 60 },
  1: { baseline: 0.8, zMin: 1.5, W: 70 },
  2: { baseline: 0.7, zMin: 1.7, W: 80 },
  3: { baseline: 0.6, zMin: 1.9, W: 90 },
  4: { baseline: 0.5, zMin: 2.1, W: 100 },
  5: { baseline: 0.4, zMin: 2.4, W: 110 },
  6: { baseline: 0.3, zMin: 2.8, W: 120 },
  7: { baseline: 0.2, zMin: 3.2, W: 130 },
  8: { baseline: 0.1, zMin: 3.8, W: 140 },
};

const UNDER_TUNING = {
  1: { baseline: 0.1, zMin: 3.8, W: 140 },
  2: { baseline: 0.2, zMin: 3.2, W: 130 },
  3: { baseline: 0.3, zMin: 2.8, W: 120 },
  4: { baseline: 0.4, zMin: 2.4, W: 110 },
  5: { baseline: 0.5, zMin: 2.1, W: 100 },
  6: { baseline: 0.6, zMin: 1.9, W: 90 },
  7: { baseline: 0.7, zMin: 1.7, W: 80 },
  8: { baseline: 0.8, zMin: 1.5, W: 70 },
  9: { baseline: 0.9, zMin: 1.4, W: 60 },
};

const MATCH_TUNING = { baseline: 0.1, zMin: 4.0, W: 160 };
const DIFF_TUNING = { baseline: 0.9, zMin: 1.2, W: 60 };

function digitSignal(digits, kind, barrier, tune, params) {
  const W = params.window || tune.W;
  const w = digits.slice(-W);
  const n = w.length;
  if (n < Math.min(40, W)) return null;

  const f = Array(10).fill(0);
  for (const d of w) f[d]++;
  const cur = w[n - 1];
  const row = markovRow(digits);

  const hit = d => (
    kind === 'over' ? d > barrier
      : kind === 'under' ? d < barrier
        : kind === 'match' ? d === barrier
          : d !== barrier
  );

  let emp = 0;
  for (let d = 0; d < 10; d++) if (hit(d)) emp += f[d];
  emp /= n;

  let mk = null;
  if (row) { mk = 0; for (let d = 0; d < 10; d++) if (hit(d)) mk += row[d]; }

  // Blend the raw window rate with the digit→digit transition view; the
  // transition view answers "given what just printed, what comes next".
  const p = mk == null ? emp : 0.6 * emp + 0.4 * mk;
  const base = tune.baseline;
  const z = zScore(p, base, n);
  const zMin = params.zMin > 0 ? params.zMin : tune.zMin;
  if (z < zMin) return null;

  const edge = p - base;
  if (edge < (params.minEdge ?? 0.01)) return null;
  if (kind === 'match' && f[barrier] < n * (base + 0.03)) return null;
  if (kind === 'match' && w.slice(-20).filter(d => d === barrier).length < 3) return null;

  const conf = Math.round(Math.max(60, Math.min(96, 60 + z * 5 + edge * 70)));
  return {
    conf, p, z,
    rationale: `${kind}${barrier} · p=${(p * 100).toFixed(1)}% (break-even ${(base * 100).toFixed(0)}%, z=${z.toFixed(1)})`,
    now: cur,
  };
}

// ── directional / volatility regimes ─────────────────────────────────────

function closesOf(candles) { return candles.map(c => c.close); }

// Trend-following confluence. Each directional contract passes its own
// thresholds, so a Turbo (needs a strong sustained move) behaves differently
// from a Rise/Fall (accepts a mild tilt).
function trendSignal(candles, dir, cfg, params) {
  const n = candles.length;
  if (n < Math.max(cfg.slow + 2, 22)) return null;
  const cl = closesOf(candles);
  const fast = ema(cl, cfg.fast);
  const slow = ema(cl, cfg.slow);
  if (fast == null || slow == null) return null;
  const r = rsi(cl, 14) ?? 50;
  const momBars = cfg.mom || 5;
  const mom = cl[n - 1] - cl[n - 1 - momBars];
  const slope = (fast - slow) / (slow || 1e-9);

  const want = dir === 'up' ? 1 : -1;
  if (Math.sign(slope) !== want || Math.sign(mom) !== want) return null;
  const rOk = dir === 'up' ? r > cfg.rsiLo : r < cfg.rsiHi;
  if (!rOk) return null;
  if (Math.abs(slope) < cfg.minSlope) return null;

  const strength = Math.min(1, Math.abs(slope) / (cfg.minSlope * 3));
  const conf = Math.round(Math.min(96, cfg.base + strength * 26 + (dir === 'up' ? r - 50 : 50 - r) * 0.3));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return { conf, rationale: `${dir === 'up' ? 'bull' : 'bear'} trend · slope ${(slope * 100).toFixed(3)}% · RSI ${r.toFixed(0)}` };
}

// Volatility-regime detection for Touch and No Touch. The short-term average
// true range compared with the long-term average is scale-free: the ratio is
// ~1 in a steady market, >1 when volatility is expanding (the barrier is
// likely to be reached) and <1 when it is contracting (the barrier is likely
// to hold).
function volSignal(candles, wantTouch, params) {
  const n = candles.length;
  if (n < 32) return null;
  const tr = c => c.high - c.low;
  const atr = (arr, p) => arr.slice(-p).reduce((s, c) => s + tr(c), 0) / p;
  const short = atr(candles, 5);
  const long = atr(candles, 30) || 1e-9;
  const expansion = short / long;

  if (wantTouch) {
    if (expansion < 1.3) return null;
    const conf = Math.round(Math.min(95, 62 + (expansion - 1.3) * 45));
    return { conf, rationale: `volatility expanding · x${expansion.toFixed(2)}` };
  }
  if (expansion > 0.75) return null;
  const conf = Math.round(Math.min(95, 62 + (0.75 - expansion) * 45));
  return { conf, rationale: `volatility contracting · x${expansion.toFixed(2)}` };
}

// Accumulators need a quiet, mean-reverting market: price oscillating inside a
// tight band with no directional drift. That is the only regime where the
// barrier survives to maturity.
function accuSignal(candles, params) {
  const n = candles.length;
  if (n < 30) return null;
  const cl = closesOf(candles);
  const sd = stddev(cl, 20);
  const mean = sma(cl, 20);
  if (sd == null || mean == null || mean === 0) return null;
  const width = (2 * sd) / mean;
  const drift = Math.abs(cl[n - 1] - cl[n - 21]) / mean;
  if (width > 0.0004 || drift > 0.0003) return null;
  const conf = Math.round(Math.min(95, 66 + (0.0004 - width) * 20000 + (0.0003 - drift) * 10000));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return { conf, rationale: `tight band · width ${(width * 100).toFixed(3)}% · drift ${(drift * 100).toFixed(3)}%` };
}

// ── registry ─────────────────────────────────────────────────────────────

export const AUTO_CONTRACTS = {};
export const AUTO_FAMILIES = [
  { id: 'rise_fall', label: 'Rise/Fall' },
  { id: 'higher_lower', label: 'Higher/Lower' },
  { id: 'touch', label: 'Touch/No Touch' },
  { id: 'digits', label: 'Digits' },
  { id: 'accumulators', label: 'Accumulators' },
  { id: 'multipliers', label: 'Multipliers' },
  { id: 'turbos', label: 'Turbos' },
  { id: 'vanillas', label: 'Vanillas' },
];

function reg(entry) { AUTO_CONTRACTS[entry.key] = entry; }

function riseFall(key, side, equals, label) {
  reg({
    key, typeId: 'rise_fall', side, family: 'rise_fall', label,
    equals, digitFamily: false,
    inputs: ['stake', 'duration', 'strategy'],
    defaults: { duration: 5, unit: 't' },
    note: equals ? 'Mild tilt with the equals clause — stricter entry.' : 'Mild directional tilt.',
    winNote: '~50% fair',
    signal: (ctx) => trendSignal(ctx.candles, side, {
      fast: 9, slow: 21, mom: 5, rsiLo: equals ? 54 : 52, rsiHi: equals ? 46 : 48,
      minSlope: equals ? 0.0007 : 0.0004, base: 62,
    }, ctx.params),
  });
}

function dirPrice(key, typeId, side, cfg, label, note, winNote) {
  reg({
    key, typeId, side, family: typeId === 'higher_lower' ? 'higher_lower' : typeId === 'touch' ? 'touch' : typeId === 'turbos' ? 'turbos' : 'vanillas',
    label, digitFamily: false,
    inputs: typeId === 'touch' ? ['stake', 'duration', 'barrier', 'strategy'] : ['stake', 'duration', 'barrier', 'strategy'],
    defaults: { duration: typeId === 'vanillas' ? 1 : 5, unit: typeId === 'vanillas' ? 'd' : 't', barrier: '+0.10' },
    note, winNote,
    signal: (ctx) => cfg.vol
      ? volSignal(ctx.candles, cfg.vol === 'touch', ctx.params)
      : trendSignal(ctx.candles, side, cfg, ctx.params),
  });
}

function digitContract(key, kind, barrier, label, note) {
  const tune = kind === 'over' ? OVER_TUNING[barrier]
    : kind === 'under' ? UNDER_TUNING[barrier]
      : kind === 'match' ? MATCH_TUNING : DIFF_TUNING;
  const base = tune.baseline;
  reg({
    key, typeId: kind === 'over' || kind === 'under' ? 'over_under' : 'matches_differs',
    side: kind === 'over' || kind === 'match' ? 'up' : 'down',
    family: 'digits', label, digitFamily: true, kind, barrier,
    inputs: ['stake', 'strategy'],
    defaults: { duration: 1, unit: 't' },
    tune, note, winNote: `${(base * 100).toFixed(0)}% fair`,
    signal: (ctx) => digitSignal(ctx.digits, kind, barrier, tune, ctx.params),
  });
}

// Rise/Fall (with and without the equals clause).
riseFall('CALL', 'up', false, 'Rise');
riseFall('PUT', 'down', false, 'Fall');
riseFall('CALLE', 'up', true, 'Rise (equals)');
riseFall('PUTE', 'down', true, 'Fall (equals)');

// Higher/Lower — needs a decisive break of the barrier, so a steeper slope.
dirPrice('HIGHER', 'higher_lower', 'up', { fast: 9, slow: 26, mom: 6, rsiLo: 55, rsiHi: 45, minSlope: 0.0006, base: 64 },
  'Higher', 'Decisive break above the barrier.', '~50% fair');
dirPrice('LOWER', 'higher_lower', 'down', { fast: 9, slow: 26, mom: 6, rsiLo: 55, rsiHi: 45, minSlope: 0.0006, base: 64 },
  'Lower', 'Decisive break below the barrier.', '~50% fair');

// Touch / No Touch — pure volatility regime, no direction.
dirPrice('ONETOUCH', 'touch', 'up', { vol: 'touch' }, 'Touch', 'Wide, expanding range reaches the barrier.', 'payout-priced');
dirPrice('NOTOUCH', 'touch', 'down', { vol: 'notouch' }, 'No Touch', 'Compressed range never reaches the barrier.', 'payout-priced');

// Turbos — knockout trades want the strongest sustained trend.
dirPrice('TURBOSLONG', 'turbos', 'up', { fast: 8, slow: 30, mom: 8, rsiLo: 57, rsiHi: 43, minSlope: 0.0009, base: 66 },
  'Long', 'Strong sustained uptrend clears the knockout.', 'payout-priced');
dirPrice('TURBOSSHORT', 'turbos', 'down', { fast: 8, slow: 30, mom: 8, rsiLo: 57, rsiHi: 43, minSlope: 0.0009, base: 66 },
  'Short', 'Strong sustained downtrend clears the knockout.', 'payout-priced');

// Vanillas — longer horizon, so a broader trend window.
dirPrice('VANILLALONGCALL', 'vanillas', 'up', { fast: 12, slow: 40, mom: 12, rsiLo: 54, rsiHi: 46, minSlope: 0.0005, base: 63 },
  'Call', 'Broad uptrend into expiry.', 'payout-priced');
dirPrice('VANILLALONGPUT', 'vanillas', 'down', { fast: 12, slow: 40, mom: 12, rsiLo: 54, rsiHi: 46, minSlope: 0.0005, base: 63 },
  'Put', 'Broad downtrend into expiry.', 'payout-priced');

// Digits — Even/Odd plus every Over/Under/Match/Diff barrier.
reg({
  key: 'DIGITEVEN', typeId: 'even_odd', side: 'up', family: 'digits', label: 'Even',
  digitFamily: true, kind: 'even', inputs: ['stake', 'strategy'],
  defaults: { duration: 1, unit: 't' },
  tune: { baseline: 0.5, zMin: 2.1, W: 100 }, note: 'Even digits running hot.', winNote: '50% fair',
  signal: (ctx) => evenOddSignal(ctx.digits, 'even', ctx.params),
});
reg({
  key: 'DIGITODD', typeId: 'even_odd', side: 'down', family: 'digits', label: 'Odd',
  digitFamily: true, kind: 'odd', inputs: ['stake', 'strategy'],
  defaults: { duration: 1, unit: 't' },
  tune: { baseline: 0.5, zMin: 2.1, W: 100 }, note: 'Odd digits running hot.', winNote: '50% fair',
  signal: (ctx) => evenOddSignal(ctx.digits, 'odd', ctx.params),
});

for (let b = 0; b <= 8; b++) digitContract(`DIGITOVER:${b}`, 'over', b, `Over ${b}`, `Last digit above ${b}.`);
for (let b = 1; b <= 9; b++) digitContract(`DIGITUNDER:${b}`, 'under', b, `Under ${b}`, `Last digit below ${b}.`);
for (let b = 0; b <= 9; b++) digitContract(`DIGITMATCH:${b}`, 'match', b, `Matches ${b}`, `Last digit equals ${b}.`);
for (let b = 0; b <= 9; b++) digitContract(`DIGITDIFF:${b}`, 'diff', b, `Differs ${b}`, `Last digit differs from ${b}.`);

// Accumulators.
reg({
  key: 'ACCU', typeId: 'accumulators', side: 'up', family: 'accumulators', label: 'Accumulate',
  digitFamily: false, inputs: ['stake', 'growthRate', 'strategy'],
  defaults: { growthRate: 0.01 },
  note: 'Quiet, mean-reverting market keeps the barrier alive.', winNote: 'payout-priced',
  signal: (ctx) => accuSignal(ctx.candles, ctx.params),
});

// Multipliers — trend plus a pullback entry so the leverage is not bought at
// the extreme of the move.
function multSignal(candles, dir, params) {
  const n = candles.length;
  if (n < 30) return null;
  const cl = closesOf(candles);
  const fast = ema(cl, 12), slow = ema(cl, 34);
  if (fast == null || slow == null) return null;
  const want = dir === 'up' ? 1 : -1;
  const slope = fast - slow;
  if (Math.sign(slope) !== want) return null;
  // Buy the trend, not the extreme of it: require the close to be at or near
  // the fast EMA (a shallow pullback) rather than extended above/below it.
  const pull = (cl[n - 1] - fast) / (fast || 1e-9);
  if (want === 1 ? pull > 0.0010 : pull < -0.0010) return null;
  const r = rsi(cl, 14) ?? 50;
  const conf = Math.round(Math.min(95, 66 + Math.min(18, Math.abs(slope) / (slow || 1e-9) * 4000) + (want === 1 ? 50 - Math.abs(r - 45) : 50 - Math.abs(r - 55)) * 0.2));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return { conf, rationale: `${dir === 'up' ? 'up' : 'down'} trend · pullback entry · RSI ${r.toFixed(0)}` };
}

reg({
  key: 'MULTUP', typeId: 'multipliers', side: 'up', family: 'multipliers', label: 'Up',
  digitFamily: false, inputs: ['stake', 'multiplier', 'strategy'],
  defaults: { multiplier: 100 }, note: 'Uptrend with a pullback entry.', winNote: 'payout-priced',
  signal: (ctx) => multSignal(ctx.candles, 'up', ctx.params),
});
reg({
  key: 'MULTDOWN', typeId: 'multipliers', side: 'down', family: 'multipliers', label: 'Down',
  digitFamily: false, inputs: ['stake', 'multiplier', 'strategy'],
  defaults: { multiplier: 100 }, note: 'Downtrend with a pullback entry.', winNote: 'payout-priced',
  signal: (ctx) => multSignal(ctx.candles, 'down', ctx.params),
});

function evenOddSignal(digits, want, params) {
  const tune = { baseline: 0.5, zMin: 2.1, W: 100 };
  const W = params.window || tune.W;
  const w = digits.slice(-W);
  const n = w.length;
  if (n < Math.min(40, W)) return null;
  const even = w.filter(d => d % 2 === 0).length;
  const p = want === 'even' ? even / n : 1 - even / n;
  const z = zScore(p, 0.5, n);
  const zMin = params.zMin > 0 ? params.zMin : tune.zMin;
  if (z < zMin) return null;
  const edge = p - 0.5;
  if (edge < (params.minEdge ?? 0.01)) return null;
  const conf = Math.round(Math.max(60, Math.min(96, 60 + z * 5 + edge * 70)));
  return { conf, p, z, rationale: `${want} · p=${(p * 100).toFixed(1)}% (z=${z.toFixed(1)})` };
}

// ── lookup helpers ───────────────────────────────────────────────────────

export function findAutoContract(key) {
  return AUTO_CONTRACTS[key] || AUTO_CONTRACTS['DIGITOVER:3'];
}

export function contractsForFamily(familyId) {
  return Object.values(AUTO_CONTRACTS).filter(c => c.family === familyId);
}

// The digit sub-products, so the UI can show Even/Odd, Over/Under and
// Match/Diff as distinct choices with their own barrier row.
export const DIGIT_PRODUCTS = [
  { id: 'even_odd', label: 'Even/Odd', sides: ['even', 'odd'] },
  { id: 'over_under', label: 'Over/Under', sides: ['over', 'under'], barrier: [0, 9] },
  { id: 'match_diff', label: 'Match/Diff', sides: ['match', 'diff'], barrier: [0, 9] },
];

// Maps a form selection onto the exact Deriv `proposal` fields for the auto
// contract. Mirrors contracts.js buildProposal but sources the barrier/digit
// from the contract key rather than a shared form.
export function buildAutoValue(entry, params) {
  const v = {
    duration: params.duration ?? entry.defaults.duration ?? 1,
    unit: params.unit ?? entry.defaults.unit ?? 't',
    stake: params.stake ?? 1,
    growthRate: params.growthRate ?? entry.defaults.growthRate ?? 0.01,
    multiplier: params.multiplier ?? entry.defaults.multiplier ?? 100,
    takeProfit: params.takeProfit ?? 0,
    stopLoss: params.stopLoss ?? 0,
    cancellation: params.cancellation ?? '',
    equals: !!entry.equals,
    barrier: params.barrier ?? entry.defaults.barrier ?? '+0.10',
    digit: entry.barrier,
  };
  if (entry.kind && (entry.kind === 'over' || entry.kind === 'under' || entry.kind === 'match' || entry.kind === 'diff')) {
    v.digit = entry.barrier;
  }
  return v;
}
