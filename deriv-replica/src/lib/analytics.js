// Tape analytics: digit distribution and market-structure statistics.
// Pure functions over the imported tick/candle buffers.
import { mean, stdev } from './indicators.js';

// Digit distribution with a chi-square bias test, entropy, hot/cold digits,
// even/odd split and the longest streak. On a fair stream every reading is
// noise; the point is to measure the sample, not to promise an edge.
export function digitStats(digits) {
  const n = digits.length;
  const counts = new Array(10).fill(0);
  digits.forEach(d => { counts[d] = (counts[d] || 0) + 1; });
  const dist = counts.map(c => (c / n) * 100);
  const expected = n / 10;
  let chi2 = 0;
  counts.forEach(c => { chi2 += ((c - expected) ** 2) / expected; });
  let entropy = 0;
  dist.forEach(p => { const q = p / 100; if (q > 0) entropy -= q * Math.log2(q); });
  let hot = 0, cold = 0;
  counts.forEach((c, d) => { if (c > counts[hot]) hot = d; if (c < counts[cold]) cold = d; });
  const even = counts.filter((_, d) => d % 2 === 0).reduce((a, b) => a + b, 0);
  const odd = n - even;

  let streak = 0, streakDigit = null, cur = 0, curDigit = null;
  digits.forEach(d => {
    if (d === curDigit) cur++;
    else { curDigit = d; cur = 1; }
    if (cur > streak) { streak = cur; streakDigit = d; }
  });

  return {
    total: n, counts, dist, chi2, entropy,
    hot, cold, even: (even / n) * 100, odd: (odd / n) * 100,
    now: digits[n - 1], streak, streakDigit,
  };
}

// Candle-level market structure: range, realised volatility, mean body, bar
// balance, the longest up/down run and the linear-trend slope.
export function marketStats(candles) {
  const cl = candles.map(c => c.close);
  const n = candles.length;
  const rangeHigh = Math.max(...candles.map(c => c.high));
  const rangeLow = Math.min(...candles.map(c => c.low));
  const rets = [];
  for (let i = 1; i < n; i++) rets.push((cl[i] - cl[i - 1]) / cl[i - 1]);
  const vol = stdev(rets) ?? 0;
  const body = mean(candles.map(c => Math.abs(c.close - c.open))) ?? 0;
  let upBars = 0, downBars = 0;
  candles.forEach(c => { if (c.close >= c.open) upBars++; else downBars++; });
  let maxRunUp = 0, maxRunDown = 0, ru = 0, rd = 0;
  candles.forEach(c => {
    if (c.close >= c.open) { ru++; rd = 0; } else { rd++; ru = 0; }
    maxRunUp = Math.max(maxRunUp, ru); maxRunDown = Math.max(maxRunDown, rd);
  });
  // Least-squares slope of close vs index, normalised by mean price.
  const xs = candles.map((_, i) => i);
  const mx = mean(xs), my = mean(cl);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (cl[i] - my); den += (xs[i] - mx) ** 2; }
  const slope = den ? (num / den) / my : 0;
  const volume = candles.reduce((a, c) => a + (c.volume ?? c.ticks ?? 0), 0);
  return { bars: n, rangeHigh, rangeLow, vol, body, upBars, downBars, maxRunUp, maxRunDown, slope, volume };
}
