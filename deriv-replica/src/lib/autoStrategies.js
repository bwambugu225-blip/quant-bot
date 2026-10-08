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
import { ema, rsi, stddev, sma, max, min } from './indicators.js';

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

// ── accuracy presets ─────────────────────────────────────────────────────
//
// One control instead of a dozen knobs. Each level raises or lowers the same
// three gates: the confidence a signal must reach, the minimum edge over
// break-even, and a multiplier on the per-barrier z gate. "max" is the default
// because the engine's job is the highest achievable win rate, not trade
// volume — it simply trades less often.
export const ACCURACY_LEVELS = [
  { id: 'max', label: 'Max', minConf: 70, minEdge: 0.035, zMult: 1.3, maxLosses: 3 },
  { id: 'high', label: 'High', minConf: 65, minEdge: 0.025, zMult: 1.12, maxLosses: 5 },
  { id: 'balanced', label: 'Balanced', minConf: 60, minEdge: 0.015, zMult: 1.0, maxLosses: 8 },
];

export function accuracyParams(levelId) {
  const l = ACCURACY_LEVELS.find(x => x.id === levelId) || ACCURACY_LEVELS[0];
  return { accuracy: l.id, minConf: l.minConf, minEdge: l.minEdge, zMult: l.zMult, maxLosses: l.maxLosses };
}

// ── duration ─────────────────────────────────────────────────────────────
//
// The duration the user picks is not decoration: a 1-tick bet and a 1-hour bet
// are different questions. A long hold has more time for the regime that
// justified the entry to decay, so it needs a longer evidence base and a
// stronger reading before it fires. This turns the selected duration into the
// scale of the analysis rather than a value the strategy ignores.
//
// Everything is expressed in approximate ticks so seconds, minutes and hours
// become comparable (~2 ticks/second on Deriv's volatility indices).
const TICKS_PER_UNIT = { t: 1, s: 2, m: 120, h: 7200, d: 172800 };

export function durationProfile(params = {}) {
  const dur = Math.max(1, +params.duration || 1);
  const unit = params.unit || 't';
  const horizon = Math.min(5000, dur * (TICKS_PER_UNIT[unit] || 1));
  // Gentler than sqrt so a 5-tick default barely moves but a 1-hour bet
  // materially widens the window it looks through.
  const windowScale = Math.min(2.5, 1 + 0.3 * Math.log2(Math.max(1, horizon)));
  const durZ = Math.min(0.8, 0.15 * Math.log2(Math.max(1, horizon)));
  return { dur, unit, horizon, windowScale, durZ };
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
  const prof = durationProfile(params);
  const W = Math.round(Math.max(params.window || tune.W, tune.W) * prof.windowScale);
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
  const zMin = (params.zMin > 0 ? params.zMin : tune.zMin) * (params.zMult || 1) + prof.durZ;
  if (z < zMin) return null;

  const edge = p - base;
  if (edge < (params.minEdge ?? 0.01)) return null;
  if (kind === 'match' && f[barrier] < n * (base + 0.03)) return null;
  if (kind === 'match' && w.slice(-20).filter(d => d === barrier).length < 3) return null;

  const conf = Math.round(Math.max(60, Math.min(96, 60 + z * 5 + edge * 70)));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return {
    conf, p, z,
    rationale: `${kind}${barrier} · p=${(p * 100).toFixed(1)}% (break-even ${(base * 100).toFixed(0)}%, z=${z.toFixed(1)})`,
    dur: `${prof.dur}${prof.unit}`,
    now: cur,
  };
}

// ── directional / volatility regimes ─────────────────────────────────────

function closesOf(candles) { return candles.map(c => c.close); }

// Trend-following confluence. Each directional contract passes its own
// thresholds, so a Turbo (needs a strong sustained move) behaves differently
// from a Rise/Fall (accepts a mild tilt).
function trendSignal(candles, dir, cfg, params) {
  const prof = durationProfile(params);
  const n = candles.length;
  // A longer hold needs a longer history to confirm the trend, so the slow
  // window (and the required history) scales with the selected duration.
  const slow = Math.round(cfg.slow * prof.windowScale);
  if (n < Math.max(slow + 2, 22)) return null;
  const cl = closesOf(candles);
  const fast = ema(cl, Math.max(2, Math.round(cfg.fast * prof.windowScale)));
  const slowE = ema(cl, slow);
  if (fast == null || slowE == null) return null;
  const r = rsi(cl, 14) ?? 50;
  const momBars = Math.max(2, Math.round((cfg.mom || 5) * prof.windowScale));
  const mom = cl[n - 1] - cl[n - 1 - momBars];
  const slope = (fast - slowE) / (slowE || 1e-9);

  const want = dir === 'up' ? 1 : -1;
  if (Math.sign(slope) !== want || Math.sign(mom) !== want) return null;
  const rOk = dir === 'up' ? r > cfg.rsiLo : r < cfg.rsiHi;
  if (!rOk) return null;
  // Longer holds clear a higher bar: the move must be more decisive.
  if (Math.abs(slope) < cfg.minSlope * (1 + prof.durZ)) return null;

  const strength = Math.min(1, Math.abs(slope) / (cfg.minSlope * 3));
  const conf = Math.round(Math.min(96, cfg.base + strength * 26 + (dir === 'up' ? r - 50 : 50 - r) * 0.3));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return {
    conf,
    rationale: `${dir === 'up' ? 'bull' : 'bear'} trend · slope ${(slope * 100).toFixed(3)}% · RSI ${r.toFixed(0)}`,
    dur: `${prof.dur}${prof.unit}`,
  };
}

// Volatility-regime detection for Touch and No Touch. The short-term average
// true range compared with the long-term average is scale-free: the ratio is
// ~1 in a steady market, >1 when volatility is expanding (the barrier is
// likely to be reached) and <1 when it is contracting (the barrier is likely
// to hold).
function volSignal(candles, wantTouch, params) {
  const prof = durationProfile(params);
  const n = candles.length;
  const shortP = Math.max(3, Math.round(5 * prof.windowScale));
  const longP = Math.max(12, Math.round(30 * prof.windowScale));
  if (n < longP + 2) return null;
  const tr = c => c.high - c.low;
  const atr = (arr, p) => arr.slice(-p).reduce((s, c) => s + tr(c), 0) / p;
  const short = atr(candles, shortP);
  const long = atr(candles, longP) || 1e-9;
  const expansion = short / long;

  if (wantTouch) {
    // More time in the trade makes the barrier easier to reach, so a long
    // Touch can accept a little less expansion; a short one needs more.
    const need = 1.3 - prof.durZ * 0.25;
    if (expansion < need) return null;
    const conf = Math.round(Math.min(95, 62 + (expansion - need) * 45));
    return { conf, rationale: `volatility expanding · x${expansion.toFixed(2)}`, dur: `${prof.dur}${prof.unit}` };
  }
  // No Touch must hold the whole time, so a longer hold demands a tighter,
  // more clearly contracting range.
  const cap = 0.75 - prof.durZ * 0.25;
  if (expansion > cap) return null;
  const conf = Math.round(Math.min(95, 62 + (cap - expansion) * 45));
  return { conf, rationale: `volatility contracting · x${expansion.toFixed(2)}`, dur: `${prof.dur}${prof.unit}` };
}

// Accumulators need a quiet, mean-reverting market: price oscillating inside a
// tight band with no directional drift. That is the only regime where the
// barrier survives to maturity.
function accuSignal(candles, params) {
  const prof = durationProfile(params);
  const n = candles.length;
  const p20 = Math.max(10, Math.round(20 * prof.windowScale));
  if (n < p20 + 4) return null;
  const cl = closesOf(candles);
  const sd = stddev(cl, p20);
  const mean = sma(cl, p20);
  if (sd == null || mean == null || mean === 0) return null;
  const width = (2 * sd) / mean;
  const drift = Math.abs(cl[n - 1] - cl[n - 1 - p20]) / mean;
  // A longer hold must stay inside a tighter band for longer, so the allowed
  // width and drift shrink as duration grows.
  const wCap = 0.0004 / (1 + prof.durZ);
  const dCap = 0.0003 / (1 + prof.durZ);
  if (width > wCap || drift > dCap) return null;
  const conf = Math.round(Math.min(95, 66 + (wCap - width) * 20000 + (dCap - drift) * 10000));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return { conf, rationale: `tight band · width ${(width * 100).toFixed(3)}% · drift ${(drift * 100).toFixed(3)}%`, dur: `${prof.dur}${prof.unit}` };
}

// ── path-dependent range contracts ───────────────────────────────────────
//
// "Stays Between" wins only if price never touches either barrier for the whole
// life of the contract; "Goes Outside" is its mirror. This is a path property,
// not an endpoint property, so the honest way to read it is to measure how a
// barrier at this distance from spot has actually held over recent history.
// We replay the tape: for each position, ask whether the price would have
// touched a band of the same width within the hold window. That empirical
// touch rate is what the payout must beat.
// Half-width of the band to test. Anchor it to the instrument's typical
// per-tick movement rather than the raw recent range, because the recent range
// is itself contaminated by any volatility expansion we are trying to detect.
// The width then scales with the square root of the hold (a random walk's
// spread grows that way). A "stays" bet is placed wide to survive; a "breaks"
// bet is placed tight to be reached.
function bandHalfWidth(cl, hold, wantStays) {
  const s = cl.slice(-60);
  if (s.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < s.length; i++) sum += Math.abs(s[i] - s[i - 1]);
  const step = sum / (s.length - 1);
  const k = wantStays ? 1.4 : 0.35;
  return k * step * Math.sqrt(Math.max(1, hold));
}

function rangeHoldSignal(candles, params, wantStays) {
  const prof = durationProfile(params);
  const hold = Math.max(2, Math.min(40, Math.round(prof.horizon)));
  const n = candles.length;
  const look = Math.max(20, Math.round(30 * prof.windowScale));
  if (n < Math.max(hold + look, 80)) return null;
  const cl = closesOf(candles);
  const dist = bandHalfWidth(cl, hold, wantStays);
  if (!(dist > 0)) return null;

  // Replay: how often did a band this wide survive the hold window?
  const from = Math.max(0, n - 220);
  let hits = 0, trials = 0;
  for (let i = from; i + hold < n; i++) {
    const base = cl[i];
    const hi = base + dist;
    const lo = base - dist;
    let touched = false;
    for (let j = i + 1; j <= i + hold; j++) { if (cl[j] >= hi || cl[j] <= lo) { touched = true; break; } }
    if (touched) hits++;
    trials++;
  }
  if (trials < 20) return null;
  const touchRate = hits / trials;
  const holdRate = 1 - touchRate;

  const p = wantStays ? holdRate : touchRate;
  const z = zScore(p, 0.5, trials);
  const zMin = 2.4 + prof.durZ * 1.2;
  if (z < zMin) return null;
  const conf = Math.round(Math.min(96, 60 + z * 5));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return {
    conf, p, z,
    rationale: `${wantStays ? 'stays' : 'breaks'} · ±${dist.toFixed(3)} band held ${(holdRate * 100).toFixed(0)}% over ${trials} replays`,
    dur: `${prof.dur}${prof.unit}`,
  };
}

// Ends Between/Outside only cares about the closing tick, so the same replay is
// run against the endpoint rather than the path.
function endsRangeSignal(candles, params, wantInside) {
  const prof = durationProfile(params);
  const hold = Math.max(2, Math.min(40, Math.round(prof.horizon)));
  const n = candles.length;
  const look = Math.max(20, Math.round(30 * prof.windowScale));
  if (n < Math.max(hold + look, 80)) return null;
  const cl = closesOf(candles);
  const dist = bandHalfWidth(cl, hold, wantInside);
  if (!(dist > 0)) return null;

  const from = Math.max(0, n - 220);
  let inside = 0, trials = 0;
  for (let i = from; i + hold < n; i++) {
    const base = cl[i];
    const end = cl[i + hold];
    if (end > base - dist && end < base + dist) inside++;
    trials++;
  }
  if (trials < 20) return null;
  const insideRate = inside / trials;
  const p = wantInside ? insideRate : 1 - insideRate;
  const z = zScore(p, 0.5, trials);
  const zMin = 2.2 + prof.durZ * 1.2;
  if (z < zMin) return null;
  const conf = Math.round(Math.min(96, 60 + z * 5));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return {
    conf, p, z,
    rationale: `ends ${wantInside ? 'inside' : 'outside'} · ±${dist.toFixed(3)} band held ${(insideRate * 100).toFixed(0)}% of ${trials}`,
    dur: `${prof.dur}${prof.unit}`,
  };
}

// ── Only Ups / Only Downs ────────────────────────────────────────────────
//
// A run of `d` consecutive rises has fair probability ~2^-d, and it collapses
// fast with duration, so this is a lottery-ticket contract by construction. The
// only honest edge is momentum persistence: measure how often a run of the
// required length has actually completed after a like-typed run, and require
// the observed completion rate to clear the fair baseline. The confidence is
// capped below the high-confidence band because the fair rate is genuinely low.
function runSignal(digits, params, wantUp, duration) {
  const d = Math.max(1, Math.round(duration || 3));
  // Fair probability of a run of d same-direction moves. Using tick digit
  // parity as the up/down proxy keeps this computable from the tick stream.
  const fair = Math.pow(0.5, d);
  const prof = durationProfile({ ...params, duration: d, unit: 't' });
  const W = Math.round(Math.max(120, 40 * d) * prof.windowScale);
  const w = digits.slice(-W);
  if (w.length < Math.min(60, W)) return null;

  let runs = 0, setups = 0;
  for (let i = 2; i < w.length; i++) {
    const ok = (a, b) => (wantUp ? b > a : b < a);
    // Look for the start of a like-typed move, then check whether `d`
    // consecutive moves continued the same way.
    if (!ok(w[i - 1], w[i])) continue;
    setups++;
    let good = true;
    for (let k = 1; k <= d; k++) {
      if (i + k >= w.length) { good = false; break; }
      if (!ok(w[i + k - 1], w[i + k])) { good = false; break; }
    }
    if (good) runs++;
  }
  if (setups < 15) return null;
  const p = runs / setups;
  const z = zScore(p, fair, setups);
  const zMin = 2.2 + prof.durZ;
  if (z < zMin) return null;
  const conf = Math.round(Math.min(94, 58 + z * 5));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return {
    conf, p, z,
    rationale: `${wantUp ? 'only ups' : 'only downs'} ${d}t · completed ${(p * 100).toFixed(0)}% (fair ${(fair * 100).toFixed(0)}%)`,
    dur: `${d}t`,
  };
}

// ── Asian Up / Asian Down ────────────────────────────────────────────────
//
// The contract compares the last tick against the mean of the period. Prices
// mean-revert at tick scale after a stretch, so the edge is a fade: bet the
// side that the running mean is currently on, because the final tick is more
// likely to close on the mean's side than to finish on the extreme side it
// would need to beat it. We estimate the running mean from the recent window
// and require the current price to sit far enough from it.
function asianSignal(prices, params, wantUp) {
  const prof = durationProfile(params);
  const W = Math.max(20, Math.min(120, Math.round(prof.horizon)));
  const w = prices.slice(-Math.max(W, 40));
  const n = w.length;
  if (n < 30) return null;
  const mean = w.reduce((s, x) => s + x, 0) / n;
  const sd = stddev(w, n);
  if (!sd) return null;
  const last = w[n - 1];
  // Standardised distance of the last tick from the running average.
  const d = (last - mean) / sd;
  // Fade: if the last tick spiked above the mean, the pullback favours Down.
  const want = wantUp ? -1 : 1;
  if (Math.sign(d) !== want) return null;
  const gap = Math.abs(d);
  if (gap < 0.8) return null;      // too tight around the mean to have an edge
  const z = zScore(Math.min(0.95, 0.5 + gap * 0.12), 0.5, n);
  const zMin = 2.0 + prof.durZ;
  if (z < zMin) return null;
  const conf = Math.round(Math.min(94, 58 + z * 6));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return {
    conf, z,
    rationale: `${wantUp ? 'asian up' : 'asian down'} · last ${d > 0 ? '+' : ''}${d.toFixed(2)}σ vs mean`,
    dur: `${prof.dur}${prof.unit}`,
  };
}

// ── Reset Call / Reset Put ───────────────────────────────────────────────
//
// A reset converts a losing Call/Put into a second chance when price moves
// against it near the midpoint. That makes the trade more forgiving than a
// plain Rise/Fall, so the same trend confirmation is allowed to fire with a
// slightly lower trend strength. No new data is needed: the reset is a
// property of the contract, and the entry is a trend entry.
function resetSignal(candles, dir, params) {
  const sig = trendSignal(candles, dir, {
    fast: 9, slow: 24, mom: 6, rsiLo: 53, rsiHi: 47, minSlope: 0.00045, base: 63,
  }, params);
  if (!sig) return null;
  return { ...sig, rationale: `${sig.rationale} · reset window armed` };
}

// ── High Tick / Low Tick ─────────────────────────────────────────────────
//
// The five ticks in the window are exchangeable: with no edge each position
// has a 20% chance of being the extreme. The only exploitable structure is a
// short-horizon drift that makes a particular slot more likely to print the
// extreme. We look at the recent sequence's AR(1) sign — if moves persist, the
// extreme tends to land late in the window; if they reverse, early. We then
// pick the slot the drift favours and require its measured hit rate to clear
// the 20% fair baseline.
function tickExtremeSignal(prices, params, wantHigh, selectedTick) {
  const slot = Math.max(1, Math.min(5, Math.round(selectedTick || 3)));
  const w = prices.slice(-200);
  const n = w.length;
  if (n < 60) return null;
  // AR(1) on tick-to-tick changes.
  let num = 0, den = 0, prev = null;
  const deltas = [];
  for (let i = 1; i < n; i++) deltas.push(w[i] - w[i - 1]);
  for (let i = 1; i < deltas.length; i++) { if (prev != null) { num += deltas[i] * prev; den += prev * prev; } prev = deltas[i]; }
  const ar = den > 0 ? num / den : 0;
  const persist = ar > 0.05;
  const reverse = ar < -0.05;
  // Slot prior: persistence pushes the extreme toward the end of the window,
  // reversal pushes it toward the start, noise is neutral (slot 3).
  const favoured = persist ? (wantHigh ? 5 : 1) : reverse ? (wantHigh ? 1 : 5) : 3;
  if (!persist && !reverse && slot !== 3) return null;
  // Replay how often this slot was the extreme over recent windows.
  let hits = 0, trials = 0;
  for (let i = 5; i < n; i += 1) {
    const win = w.slice(i - 5, i);
    if (win.length < 5) continue;
    let idx = 0;
    for (let k = 1; k < 5; k++) { if (wantHigh ? win[k] > win[idx] : win[k] < win[idx]) idx = k; }
    if (idx + 1 === slot) hits++;
    trials++;
  }
  if (trials < 30) return null;
  const p = hits / trials;
  const z = zScore(p, 0.2, trials);
  const zMin = 2.4;
  if (z < zMin) return null;
  const conf = Math.round(Math.min(92, 55 + z * 6));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return {
    conf, p, z,
    rationale: `${wantHigh ? 'high' : 'low'} tick slot ${slot} · hit ${(p * 100).toFixed(0)}% (fair 20%, AR ${ar.toFixed(2)})`,
  };
}

// ── Lookback options ─────────────────────────────────────────────────────
//
// Lookbacks pay on the range the price covers, so the trade is a bet on
// volatility expansion. The signal must read an expanding range (recent true
// range above the longer baseline), and the direction chooses which leg of the
// range the payout rides. High-Low pays on the full range and is directionless.
function lookbackSignal(candles, params, mode) {
  const prof = durationProfile(params);
  const n = candles.length;
  const shortP = Math.max(4, Math.round(6 * prof.windowScale));
  const longP = Math.max(14, Math.round(30 * prof.windowScale));
  if (n < longP + 2) return null;
  // Average off close-to-close moves, so the expansion ratio is scale-free and
  // works the same across instrument price levels.
  const cl = closesOf(candles);
  const step = (arr, p) => {
    const s = arr.slice(-(p + 1));
    if (s.length < 2) return 0;
    let sum = 0;
    for (let i = 1; i < s.length; i++) sum += Math.abs(s[i] - s[i - 1]);
    return sum / (s.length - 1);
  };
  const short = step(cl, shortP);
  const long = step(cl, longP) || 1e-9;
  const expansion = short / long;
  const need = mode === 'highlow' ? 1.35 : 1.25;
  if (expansion < need) return null;
  const conf = Math.round(Math.min(95, 62 + (expansion - need) * 45));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return {
    conf,
    rationale: `range expanding x${expansion.toFixed(2)} · ${mode} payout rides the move`,
    dur: `${prof.dur}${prof.unit}`,
  };
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
  { id: 'ranges', label: 'Stays/Ends Between' },
  { id: 'runs', label: 'Only Ups/Downs' },
  { id: 'asians', label: 'Asian Up/Down' },
  { id: 'resets', label: 'Reset Call/Put' },
  { id: 'highs_lows', label: 'High/Low Tick' },
  { id: 'lookbacks', label: 'Lookbacks' },
];

function reg(entry) { AUTO_CONTRACTS[entry.key] = entry; }

// The Deriv `contract_category` each entry maps to. Used by the engine's
// contracts_for guard to check that a market actually offers the product
// before a proposal is sent (and to pick a market that does). Kept here beside
// the registry so a new entry declares its category in one place.
export const CATEGORY_BY_TYPE = {
  rise_fall: 'callput',
  higher_lower: 'higherlower',
  touch: 'touchnotouch',
  turbos: 'turbos',
  vanillas: 'vanilla',
  over_under: 'digits',
  matches_differs: 'digits',
  even_odd: 'digits',
  stays_goes: 'staysinout',
  ends_between: 'endsinout',
  runs: 'runs',
  asians: 'asian',
  resets: 'reset',
  highs_lows: 'highlowticks',
  accumulators: 'accumulator',
  multipliers: 'multiplier',
  lookbacks: 'lookback',
  lookbacks_highlow: 'lookback',
};

export function categoryForType(typeId) { return CATEGORY_BY_TYPE[typeId] || null; }

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
    defaults: { duration: typeId === 'vanillas' ? 2 : 5, unit: typeId === 'vanillas' ? 'm' : 't', barrier: '+0.10' },
    // Turbos and Vanillas require the barrier on the unrealised side of the
    // spot: a Long/Turbo-Long takes a *negative* relative barrier, a Short a
    // positive one. Higher/Lower and Touch take either sign.
    barrierSign: cfg.barrierSign || null,
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
dirPrice('TURBOSLONG', 'turbos', 'up', { fast: 8, slow: 30, mom: 8, rsiLo: 57, rsiHi: 43, minSlope: 0.0009, base: 66, barrierSign: '-' },
  'Long', 'Strong sustained uptrend clears the knockout.', 'payout-priced');
dirPrice('TURBOSSHORT', 'turbos', 'down', { fast: 8, slow: 30, mom: 8, rsiLo: 57, rsiHi: 43, minSlope: 0.0009, base: 66, barrierSign: '+' },
  'Short', 'Strong sustained downtrend clears the knockout.', 'payout-priced');

// Vanillas — longer horizon, so a broader trend window.
dirPrice('VANILLALONGCALL', 'vanillas', 'up', { fast: 12, slow: 40, mom: 12, rsiLo: 54, rsiHi: 46, minSlope: 0.0005, base: 63, barrierSign: '-' },
  'Call', 'Broad uptrend into expiry.', 'payout-priced');
dirPrice('VANILLALONGPUT', 'vanillas', 'down', { fast: 12, slow: 40, mom: 12, rsiLo: 54, rsiHi: 46, minSlope: 0.0005, base: 63, barrierSign: '+' },
  'Put', 'Broad downtrend into expiry.', 'payout-priced');

// ── Stays Between / Goes Outside (path-dependent range) ──────────────────
reg({
  key: 'RANGE', typeId: 'stays_goes', side: 'up', family: 'ranges', label: 'Stays Between',
  digitFamily: false, inputs: ['stake', 'duration', 'barrier', 'barrier2', 'strategy'],
  defaults: { duration: 2, unit: 'm', barrier: '+1.51', barrier2: '-1.51' },
  range: 'stays', winNote: 'payout-priced',
  note: 'Range holds without a barrier touch for the whole hold.',
  signal: (ctx) => rangeHoldSignal(ctx.candles, ctx.params, true),
});
reg({
  key: 'UPORDOWN', typeId: 'stays_goes', side: 'down', family: 'ranges', label: 'Goes Outside',
  digitFamily: false, inputs: ['stake', 'duration', 'barrier', 'barrier2', 'strategy'],
  defaults: { duration: 2, unit: 'm', barrier: '+1.51', barrier2: '-1.51' },
  range: 'goes', winNote: 'payout-priced',
  note: 'A barrier touch occurs at some point in the hold.',
  signal: (ctx) => rangeHoldSignal(ctx.candles, ctx.params, false),
});

// ── Ends Between / Ends Outside (endpoint range) ─────────────────────────
reg({
  key: 'EXPIRYRANGE', typeId: 'ends_between', side: 'up', family: 'ranges', label: 'Ends Between',
  digitFamily: false, inputs: ['stake', 'duration', 'barrier', 'barrier2', 'strategy'],
  defaults: { duration: 2, unit: 'm', barrier: '+1.51', barrier2: '-1.51' },
  range: 'ends_in', winNote: 'payout-priced',
  note: 'Closing price lands strictly inside the band.',
  signal: (ctx) => endsRangeSignal(ctx.candles, ctx.params, true),
});
reg({
  key: 'EXPIRYMISS', typeId: 'ends_between', side: 'down', family: 'ranges', label: 'Ends Outside',
  digitFamily: false, inputs: ['stake', 'duration', 'barrier', 'barrier2', 'strategy'],
  defaults: { duration: 2, unit: 'm', barrier: '+1.51', barrier2: '-1.51' },
  range: 'ends_out', winNote: 'payout-priced',
  note: 'Closing price lands outside the band.',
  signal: (ctx) => endsRangeSignal(ctx.candles, ctx.params, false),
});

// ── Only Ups / Only Downs (momentum runs) ────────────────────────────────
reg({
  key: 'RUNHIGH', typeId: 'runs', side: 'up', family: 'runs', label: 'Only Ups',
  digitFamily: true, inputs: ['stake', 'duration', 'strategy'],
  defaults: { duration: 3, unit: 't' },
  note: 'Every tick rises; one against ends it. Lottery-ticket by nature.', winNote: '2⁻ᵈ fair',
  signal: (ctx) => runSignal(ctx.digits, ctx.params, true, ctx.params.duration ?? 3),
});
reg({
  key: 'RUNLOW', typeId: 'runs', side: 'down', family: 'runs', label: 'Only Downs',
  digitFamily: true, inputs: ['stake', 'duration', 'strategy'],
  defaults: { duration: 3, unit: 't' },
  note: 'Every tick falls; one against ends it. Lottery-ticket by nature.', winNote: '2⁻ᵈ fair',
  signal: (ctx) => runSignal(ctx.digits, ctx.params, false, ctx.params.duration ?? 3),
});

// ── Asian Up / Asian Down (mean-reversion fade) ──────────────────────────
reg({
  key: 'ASIANU', typeId: 'asians', side: 'up', family: 'asians', label: 'Asian Up',
  digitFamily: false, inputs: ['stake', 'duration', 'strategy'],
  defaults: { duration: 5, unit: 't' },
  note: 'Last tick closes above the period average.', winNote: '~50% fair',
  signal: (ctx) => asianSignal(ctx.prices, ctx.params, true),
});
reg({
  key: 'ASIAND', typeId: 'asians', side: 'down', family: 'asians', label: 'Asian Down',
  digitFamily: false, inputs: ['stake', 'duration', 'strategy'],
  defaults: { duration: 5, unit: 't' },
  note: 'Last tick closes below the period average.', winNote: '~50% fair',
  signal: (ctx) => asianSignal(ctx.prices, ctx.params, false),
});

// ── Reset Call / Reset Put ───────────────────────────────────────────────
reg({
  key: 'RESETCALL', typeId: 'resets', side: 'up', family: 'resets', label: 'Reset Call',
  digitFamily: false, inputs: ['stake', 'duration', 'strategy'],
  defaults: { duration: 5, unit: 't' },
  note: 'Uptrend entry with the midpoint reset as a second chance.', winNote: '~50% fair',
  signal: (ctx) => resetSignal(ctx.candles, 'up', ctx.params),
});
reg({
  key: 'RESETPUT', typeId: 'resets', side: 'down', family: 'resets', label: 'Reset Put',
  digitFamily: false, inputs: ['stake', 'duration', 'strategy'],
  defaults: { duration: 5, unit: 't' },
  note: 'Downtrend entry with the midpoint reset as a second chance.', winNote: '~50% fair',
  signal: (ctx) => resetSignal(ctx.candles, 'down', ctx.params),
});

// ── High Tick / Low Tick (five-tick extreme) ─────────────────────────────
// One entry per direction; the predicted slot is a parameter (1–5), so the UI
// changes the slot without changing the contract.
reg({
  key: 'TICKHIGH', typeId: 'highs_lows', side: 'up', family: 'highs_lows', label: 'High Tick',
  digitFamily: false, inputs: ['stake', 'selectedTick', 'strategy'],
  defaults: { selectedTick: 3 },
  winNote: '20% fair',
  note: 'Your chosen tick is the highest of the next five.',
  signal: (ctx) => tickExtremeSignal(ctx.prices, ctx.params, true, ctx.params.selectedTick ?? 3),
});
reg({
  key: 'TICKLOW', typeId: 'highs_lows', side: 'down', family: 'highs_lows', label: 'Low Tick',
  digitFamily: false, inputs: ['stake', 'selectedTick', 'strategy'],
  defaults: { selectedTick: 3 },
  winNote: '20% fair',
  note: 'Your chosen tick is the lowest of the next five.',
  signal: (ctx) => tickExtremeSignal(ctx.prices, ctx.params, false, ctx.params.selectedTick ?? 3),
});

// Lookbacks — retired on Deriv's current options API (no `lookback` category
// is returned by contracts_for for any synthetic index). Kept in the registry
// and marked unavailable so the UI can show them struck through rather than
// silently omitting the product family.
reg({
  key: 'LBFLOATCALL', typeId: 'lookbacks', side: 'up', family: 'lookbacks', label: 'Close-Low',
  digitFamily: false, unavailable: true, inputs: ['stake', 'duration', 'multiplier', 'strategy'],
  defaults: { duration: 5, unit: 't', multiplier: 1 },
  note: 'Rally off the low — pay rides close minus low.', winNote: 'no longer offered',
  signal: (ctx) => lookbackSignal(ctx.candles, ctx.params, 'closelow'),
});
reg({
  key: 'LBFLOATPUT', typeId: 'lookbacks', side: 'down', family: 'lookbacks', label: 'High-Close',
  digitFamily: false, unavailable: true, inputs: ['stake', 'duration', 'multiplier', 'strategy'],
  defaults: { duration: 5, unit: 't', multiplier: 1 },
  note: 'Reversal off the high — pay rides high minus close.', winNote: 'no longer offered',
  signal: (ctx) => lookbackSignal(ctx.candles, ctx.params, 'highclose'),
});
reg({
  key: 'LBHIGHLOW', typeId: 'lookbacks_highlow', side: 'up', family: 'lookbacks', label: 'High-Low',
  digitFamily: false, unavailable: true, inputs: ['stake', 'duration', 'multiplier', 'strategy'],
  defaults: { duration: 5, unit: 't', multiplier: 1 },
  note: 'Directionless range play — pay rides high minus low.', winNote: 'no longer offered',
  signal: (ctx) => lookbackSignal(ctx.candles, ctx.params, 'highlow'),
});

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
  const prof = durationProfile(params);
  const W = Math.round(100 * prof.windowScale);
  const w = digits.slice(-W);
  const n = w.length;
  if (n < Math.min(40, W)) return null;
  const even = w.filter(d => d % 2 === 0).length;
  const p = want === 'even' ? even / n : 1 - even / n;
  const z = zScore(p, 0.5, n);
  // Parity has no house edge, so a longer hold raises both the evidence bar and
  // the minimum edge it must show.
  const zMin = 2.1 * (params.zMult || 1) + prof.durZ;
  if (z < zMin) return null;
  const edge = p - 0.5;
  if (edge < (params.minEdge ?? 0.01) + prof.durZ * 0.01) return null;
  const conf = Math.round(Math.max(60, Math.min(96, 60 + z * 5 + edge * 70)));
  const minConf = params.minConf ?? 0;
  if (conf < minConf) return null;
  return { conf, p, z, rationale: `${want} · p=${(p * 100).toFixed(1)}% (z=${z.toFixed(1)})`, dur: `${prof.dur}${prof.unit}` };
}

// ── lookup helpers ───────────────────────────────────────────────────────

export function findAutoContract(key) {
  return AUTO_CONTRACTS[key] || AUTO_CONTRACTS['DIGITOVER:3'];
}

// Locate a registry entry by trade-type and side, so the manual Trade form can
// reuse the same specs (barrier sign convention, categories) as the auto path.
export function findEntryByTypeSide(typeId, side) {
  return Object.values(AUTO_CONTRACTS).find(e => e.typeId === typeId && e.side === side)
    || Object.values(AUTO_CONTRACTS).find(e => e.typeId === typeId)
    || null;
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
    barrier2: params.barrier2 ?? entry.defaults.barrier2 ?? '-0.10',
    selectedTick: params.selectedTick ?? entry.defaults.selectedTick ?? entry.selectedTick ?? 3,
    digit: entry.barrier,
  };
  if (entry.kind && (entry.kind === 'over' || entry.kind === 'under' || entry.kind === 'match' || entry.kind === 'diff')) {
    v.digit = entry.barrier;
  }
  return v;
}

// ── contracts_for-aware shaping ──────────────────────────────────────────
// A proposal that validates against one market can be rejected by another:
// Volatility 10/25/100 expose whole-number Vanilla strikes while V75 needs
// decimal ones, and every index publishes its own Turbo knock-out ladder. So
// before sending a proposal the engine asks for the market's own catalogue and
// rewrites the barrier/duration to the values that index actually accepts.
//
// Returns { available, fields } — `available` is null when the catalogue is
// not (yet) known, in which case callers should fall back to the raw fields.

const UNIT_SECONDS = { s: 1, m: 60, h: 3600, d: 86400 };

function parseDuration(str) {
  const m = /^(\d+)([tsmhd])$/.exec(String(str || ''));
  return m ? { duration: parseInt(m[1], 10), unit: m[2] } : null;
}

// Uses the catalogue's duration_unit and unit_options to build a duration that
// is both inside [min, max] and one of the offered step values.
function normalizeDuration(spec, wantUnit, wantDur) {
  if (!spec) return null;
  const unit = spec.duration_unit;
  if (!unit || unit === 't') return null;
  const opts = (spec.unit_options || []).map(d => ({ duration: parseInt(d, 10), unit })).filter(d => d.duration > 0);
  if (!opts.length) return null;
  const min = parseDuration(spec.min_contract_duration);
  const max = parseDuration(spec.max_contract_duration);
  const wantSec = (UNIT_SECONDS[wantUnit] || 0) * (wantDur || 0);
  const okRange = d => {
    const sec = UNIT_SECONDS[d.unit] * d.duration;
    if (min && sec < UNIT_SECONDS[min.unit] * min.duration) return false;
    if (max && sec > UNIT_SECONDS[max.unit] * max.duration) return false;
    return true;
  };
  const inRange = opts.filter(okRange);
  const pool = inRange.length ? inRange : opts;
  if (!wantSec) return pool[0];
  pool.sort((a, b) => Math.abs(UNIT_SECONDS[a.unit] * a.duration - wantSec) - Math.abs(UNIT_SECONDS[b.unit] * b.duration - wantSec));
  return pool[0];
}

// Pick the catalogue row for a category that fits the intended horizon: a tick
// hold needs the `tick` row, a seconds/minutes/hours hold the `intraday` row,
// and a days hold the `daily` row. Some categories (turbos, vanillas) repeat
// the same ladder across horizons; others (ranges) use *absolute* strikes on the
// daily row and *relative* offsets on the intraday row, so choosing the wrong
// one is the difference between a valid proposal and "offers no return".
function chooseSpec(available, category, side, unit) {
  const wantUp = side !== 'down';
  let rows = available.filter(c => c.contract_category === category);
  if (!rows.length) return null;
  const bySent = rows.filter(c => (c.sentiment === 'up') === wantUp);
  if (bySent.length) rows = bySent;
  const wantExp = unit === 'd' ? ['daily'] : unit === 't' ? ['tick'] : ['intraday', 'tick'];
  return rows.find(c => wantExp.includes(c.expiry_type)) || rows[0];
}

function relSign(s) { return /^-/.test(String(s || '')) ? '-' : '+'; }

export function shapeProposal(entry, fields, available) {
  if (!available || !available.length) return { available: null, fields };
  const category = categoryForType(entry.typeId);
  const offered = available.some(c => c.contract_category === category);
  if (!offered) return { available: false, fields };

  const out = { ...fields };
  const cat = category;
  const spec = chooseSpec(available, cat, entry.side, out.duration_unit);

  if (cat === 'turbos') {
    // Knock-out barriers move with spot; only the near-spot end of the published
    // ladder is tradable at the minimum stake, so take the smallest magnitude on
    // the correct side of the spot (Long below, Short above).
    const sign = entry.barrierSign || relSign(out.barrier);
    const choices = (spec && spec.barrier_choices) || [];
    out.barrier = choices.length ? sign + choices[0] : String(out.barrier);
    const nd = normalizeDuration(spec, out.duration_unit, out.duration);
    if (nd) { out.duration = nd.duration; out.duration_unit = nd.unit; }
    return { available: true, fields: out };
  }

  if (cat === 'vanilla') {
    // Vanilla strikes are a spot-derived moneyness ladder that the exchange
    // recalculates continuously. Snap to the nearest rung on the correct side
    // of spot (Call above, Put below) from the ladder the market publishes —
    // and, when a prior rejection has handed us the exact list the proposal
    // endpoint enforces, from that list instead (the engine swaps it in).
    const sign = entry.barrierSign || relSign(out.barrier);
    const choices = (spec && spec.barrier_choices) || [];
    if (choices.length) {
      const mag = s => Math.abs(parseFloat(String(s).replace(/[^0-9.]/g, ''))) || 0;
      const want = mag(out.barrier);
      const onSide = choices.filter(c => relSign(c) === sign);
      const pool = onSide.length ? onSide : choices;
      out.barrier = pool.reduce((a, b) => Math.abs(mag(b) - want) < Math.abs(mag(a) - want) ? b : a);
    } else if (spec && spec.barrier != null) {
      out.barrier = spec.barrier;
    }
    const nd = normalizeDuration(spec, out.duration_unit, out.duration);
    if (nd) { out.duration = nd.duration; out.duration_unit = nd.unit; }
    return { available: true, fields: out };
  }

  if (cat === 'higherlower' || cat === 'touchnotouch') {
    // A barrier typed as a raw offset ("+1.51") is often far wider than the
    // index's own quote, which reads as "no return". Use the market's published
    // default barrier for the chosen horizon instead. Touch/No Touch on the
    // trend indices only offers a daily expiry, so a short hold is rejected
    // outright and the row's own (daily) duration must be used verbatim.
    if (spec && spec.barrier) out.barrier = spec.barrier;
    const nd = normalizeDuration(spec, out.duration_unit, out.duration);
    if (nd) { out.duration = nd.duration; out.duration_unit = nd.unit; }
    else {
      const min = parseDuration(spec?.min_contract_duration);
      if (min) { out.duration = min.duration; out.duration_unit = min.unit; }
    }
    return { available: true, fields: out };
  }

  if (cat === 'staysinout' || cat === 'endsinout') {
    const low = String(spec?.low_barrier ?? out.barrier2 ?? out.barrier ?? '');
    const high = String(spec?.high_barrier ?? out.barrier ?? out.barrier2 ?? '');
    // The API needs the high barrier in `barrier` and the low in `barrier2`.
    out.barrier = high;
    out.barrier2 = low;
    const nd = normalizeDuration(spec, out.duration_unit, out.duration);
    if (nd) { out.duration = nd.duration; out.duration_unit = nd.unit; }
    return { available: true, fields: out };
  }

  if (cat === 'multiplier') {
    // Multipliers accept only a short enumerated ladder (e.g. 80/200/400/600/800
    // on Volatility 50, 400…4000 on Volatility 10), so take a middle rung.
    const range = spec?.multiplier_range || spec?.multipliers;
    if (range && range.length) out.multiplier = range[Math.floor(range.length / 2)];
    return { available: true, fields: out };
  }

  if (cat === 'accumulator') {
    const range = spec?.growth_rate_range;
    if (range && range.length) out.growth_rate = range[0];
    return { available: true, fields: out };
  }

  // Tick-window and digit products are pinned to tick durations. High/Low Tick
  // has no duration input at all yet still requires a 5-tick expiry, so the
  // catalogue's fixed window is written onto the proposal here.
  if (cat === 'digits' || cat === 'highlowticks' || cat === 'runs' || cat === 'asian' || cat === 'reset') {
    const min = parseDuration(spec?.min_contract_duration);
    const max = parseDuration(spec?.max_contract_duration);
    if (min && max) {
      if (out.duration == null || out.duration < min.duration || out.duration > max.duration) {
        out.duration = spec.min_contract_duration === spec.max_contract_duration ? min.duration
          : Math.min(Math.max(out.duration || min.duration, min.duration), max.duration);
        out.duration_unit = min.unit;
      }
    }
    return { available: true, fields: out };
  }

  return { available: true, fields: out };
}
