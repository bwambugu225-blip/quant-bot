// Tick-level microstructure analysis.
//
// Every reading here is derived from the raw timestamped tick stream — the
// prices and epochs the market feed hands over — rather than from aggregated
// candles. On Deriv's synthetic indices there is no centralised traded volume
// or bid/ask footprint, so activity is measured by tick *counts* and price
// *changes*. Nothing here claims to observe real order flow; each function
// returns a measurable property of the tape and says so in its name.
//
// All functions are pure: pass (prices, times) and get a number or null while
// the window is still warming up. A null means "not enough data", never zero.

import { mean, stdev, max, min } from './indicators.js';

const last = arr => (arr.length ? arr[arr.length - 1] : null);
const clamp01 = v => Math.max(0, Math.min(1, v));

// Successive price differences. The sign is the tick's direction.
export function tickReturns(prices) {
  const out = [];
  for (let i = 1; i < prices.length; i++) out.push(prices[i] - prices[i - 1]);
  return out;
}

// Price change per second across the last `window` ticks. Positive means the
// tape is climbing, and the magnitude is the speed.
export function tickVelocity(prices, times, window = 20) {
  if (prices.length < window + 1 || times.length < window + 1) return null;
  const n = prices.length;
  const dt = times[n - 1] - times[n - 1 - window];
  if (dt <= 0) return null;
  return (prices[n - 1] - prices[n - 1 - window]) / dt;
}

// Change in velocity: the recent window's velocity against the one before it.
// Positive means movement is speeding up, negative means it is fading.
export function tickAcceleration(prices, times, window = 20) {
  if (prices.length < window * 2 + 1 || times.length < window * 2 + 1) return null;
  const n = prices.length;
  const recent = tickVelocity(prices.slice(-window - 1), times.slice(-window - 1), window);
  const prior = tickVelocity(prices.slice(-window * 2 - 1, -window), times.slice(-window * 2 - 1, -window), window);
  if (recent == null || prior == null) return null;
  return recent - prior;
}

// Ticks received per second over the trailing `seconds` window. A spike means
// the feed is busy; a lull means the tape has gone quiet.
export function tickFrequency(times, seconds = 5) {
  if (times.length < 2) return null;
  const end = times[times.length - 1];
  const from = end - seconds;
  let count = 0;
  for (let i = times.length - 1; i >= 0; i--) {
    if (times[i] < from) break;
    count++;
  }
  return count / seconds;
}

// Share of the last `window` ticks that moved up. 0.5 is balanced.
export function tickDirectionRatio(prices, window = 50) {
  const rets = tickReturns(prices).slice(-window);
  if (!rets.length) return null;
  const ups = rets.filter(r => r > 0).length;
  return ups / rets.length;
}

// Length of the current run of same-direction ticks. Positive is an up streak,
// negative a down streak.
export function tickStreak(prices) {
  const rets = tickReturns(prices);
  if (!rets.length) return 0;
  let dir = 0, len = 0;
  for (let i = rets.length - 1; i >= 0; i--) {
    const s = Math.sign(rets[i]);
    if (s === 0) break;
    if (dir === 0) { dir = s; len = 1; }
    else if (s === dir) len++;
    else break;
  }
  return dir * len;
}

// Net move over the last `window` ticks relative to the range they spanned.
// Near ±1 means the window travelled cleanly; near 0 means it churned.
export function microDisplacement(prices, window = 50) {
  const win = prices.slice(-window);
  if (win.length < 2) return null;
  const net = win[win.length - 1] - win[0];
  const range = max(win) - min(win);
  return range ? net / range : 0;
}

// Net displacement divided by the total distance travelled — how directly the
// price reached where it is. 1 is a straight line, 0 is pure noise.
export function priceEfficiency(prices, window = 50) {
  const win = prices.slice(-window);
  if (win.length < 2) return null;
  const net = Math.abs(win[win.length - 1] - win[0]);
  let path = 0;
  for (let i = 1; i < win.length; i++) path += Math.abs(win[i] - win[i - 1]);
  return path ? net / path : 0;
}

// Standard deviation of tick returns — the noise level of the tape itself.
export function tickVolatility(prices, window = 50) {
  const rets = tickReturns(prices).slice(-window);
  if (rets.length < 2) return null;
  return stdev(rets);
}

// Accumulated squared returns over the window: the realised variance of the
// tick stream, square-rooted back to price units.
export function realizedVolatility(prices, window = 50) {
  const rets = tickReturns(prices).slice(-window);
  if (rets.length < 2) return null;
  return Math.sqrt(rets.reduce((a, r) => a + r * r, 0));
}

// Short-window volatility against a longer baseline. >1 means volatility is
// expanding; a large reading is a burst.
export function volatilityBurst(prices, short = 20, long = 100) {
  const sv = tickVolatility(prices, short);
  const lv = tickVolatility(prices, long);
  if (sv == null || lv == null || lv === 0) return null;
  return sv / lv;
}

// Directional persistence across the window: the fraction of consecutive ticks
// that continued the prior tick's direction. 0.5 is a coin flip.
export function microTrendStrength(prices, window = 30) {
  const rets = tickReturns(prices).slice(-window);
  if (rets.length < 3) return null;
  let cont = 0, total = 0;
  for (let i = 1; i < rets.length; i++) {
    const a = Math.sign(rets[i - 1]), b = Math.sign(rets[i]);
    if (a === 0 || b === 0) continue;
    total++;
    if (a === b) cont++;
  }
  return total ? cont / total : null;
}

// How often the tick direction flips over the window. High means a choppy,
// two-way tape; low means one side is in control.
export function tickReversalRate(prices, window = 30) {
  const rets = tickReturns(prices).slice(-window);
  if (rets.length < 3) return null;
  let flips = 0, total = 0;
  for (let i = 1; i < rets.length; i++) {
    const a = Math.sign(rets[i - 1]), b = Math.sign(rets[i]);
    if (a === 0 || b === 0) continue;
    total++;
    if (a !== b) flips++;
  }
  return total ? flips / total : null;
}

// Deceleration after a strong directional move. A large positive reading means
// a fast move has lost its push — the raw material of exhaustion.
export function accelerationExhaustion(prices, times, window = 20) {
  const acc = tickAcceleration(prices, times, window);
  const vel = tickVelocity(prices, times, window);
  if (acc == null || vel == null || vel === 0) return null;
  // Exhaustion only reads when a real move is present and it is slowing.
  return acc * -Math.sign(vel);
}

// The most recent bar's range against the average range of the bars before it.
// >1 flags an unusually large move.
export function rangeExpansion(candles, window = 20) {
  if (!candles || candles.length < window + 1) return null;
  const ranges = candles.map(k => k.high - k.low);
  const recent = last(ranges);
  const base = mean(ranges.slice(-window - 1, -1));
  return base ? recent / base : null;
}

// ── composite read ─────────────────────────────────────────────────────────
// One object with every microstructure reading, plus a normalised pressure
// score that blends streak, direction ratio and efficiency into a single
// -1…+1 number. `null` fields mean the window was too short, not "neutral".
export function tickIntelligence(prices = [], times = []) {
  const velocity = tickVelocity(prices, times, 20);
  const acceleration = tickAcceleration(prices, times, 20);
  const frequency = tickFrequency(times, 5);
  const directionRatio = tickDirectionRatio(prices, 50);
  const streak = tickStreak(prices);
  const displacement = microDisplacement(prices, 50);
  const efficiency = priceEfficiency(prices, 50);
  const volatility = tickVolatility(prices, 50);
  const realized = realizedVolatility(prices, 50);
  const burst = volatilityBurst(prices, 20, 100);
  const trendStrength = microTrendStrength(prices, 30);
  const reversalRate = tickReversalRate(prices, 30);
  const exhaustion = accelerationExhaustion(prices, times, 20);

  // Directional pressure: how one-sided the recent tape is, weighted by how
  // efficiently it moved. Bounded to ±1.
  let pressure = null;
  if (directionRatio != null && efficiency != null) {
    const bias = (directionRatio - 0.5) * 2;              // -1…+1
    const streakBias = clamp01(Math.abs(streak) / 8) * Math.sign(streak || 0);
    pressure = clamp01(Math.abs(bias * 0.6 + streakBias * 0.4)) * Math.sign(bias + streakBias || bias);
    pressure *= efficiency;                               // a churny tape reads weaker
  }

  return {
    velocity, acceleration, frequency, directionRatio, streak,
    displacement, efficiency, volatility, realized, burst,
    trendStrength, reversalRate, exhaustion, pressure,
  };
}
