// Candle intelligence.
//
// Per-candle and per-sequence reads: how much of a bar is body versus wick, how
// large its range is against recent bars, and the classic multi-bar patterns
// (engulfing, inside/outside, pin bar, three-candle reversal). These describe
// the shape of price action; they do not assert intent.

import { mean } from './indicators.js';

// Body as a fraction of total range. 1 is a marubozu, 0 a doji.
export function bodyStrength(candle) {
  const range = candle.high - candle.low;
  return range ? Math.abs(candle.close - candle.open) / range : 0;
}

// Upper and lower wick as fractions of the range. A tall upper wick is
// rejection from above; a tall lower wick is rejection from below.
export function wickPressure(candle) {
  const range = candle.high - candle.low;
  if (!range) return { upper: 0, lower: 0 };
  const body = Math.abs(candle.close - candle.open);
  const top = Math.max(candle.open, candle.close);
  const bottom = Math.min(candle.open, candle.close);
  return { upper: (candle.high - top) / range, lower: (bottom - candle.low) / range };
}

// The bar's range against the average of the preceding `window` bars.
export function candleDisplacement(candles, window = 20) {
  if (!candles || candles.length < 2) return null;
  const cur = candles[candles.length - 1];
  const prior = candles.slice(-window - 1, -1);
  const base = mean(prior.map(k => k.high - k.low));
  return base ? (cur.high - cur.low) / base : null;
}

// How many of the trailing candles closed the same way, signed.
export function consecutiveStrength(candles) {
  if (!candles.length) return 0;
  let dir = 0, len = 0;
  for (let i = candles.length - 1; i >= 0; i--) {
    const s = Math.sign(candles[i].close - candles[i].open);
    if (s === 0) break;
    if (dir === 0) { dir = s; len = 1; }
    else if (s === dir) len++;
    else break;
  }
  return dir * len;
}

// A rejection candle: a long wick on one side with the close back inside.
export function rejection(candle) {
  const { upper, lower } = wickPressure(candle);
  const body = bodyStrength(candle);
  if (lower > 0.6 && body < 0.35) return 'bullish';
  if (upper > 0.6 && body < 0.35) return 'bearish';
  return null;
}

export function isPinBar(candle) {
  return rejection(candle) != null;
}

// Engulfing: the current body fully covers the previous body, in the opposite
// direction.
export function isEngulfing(candles) {
  if (candles.length < 2) return null;
  const a = candles[candles.length - 2], b = candles[candles.length - 1];
  const aTop = Math.max(a.open, a.close), aBot = Math.min(a.open, a.close);
  const bTop = Math.max(b.open, b.close), bBot = Math.min(b.open, b.close);
  if (b.close > b.open && a.close < a.open && bTop >= aTop && bBot <= aBot) return 'bullish';
  if (b.close < b.open && a.close > a.open && bTop >= aTop && bBot <= aBot) return 'bearish';
  return null;
}

// Inside bar: the whole current range sits within the previous bar's range.
export function isInsideBar(candles) {
  if (candles.length < 2) return false;
  const a = candles[candles.length - 2], b = candles[candles.length - 1];
  return b.high <= a.high && b.low >= a.low;
}

// Outside bar: the current range engulfs the previous bar's range.
export function isOutsideBar(candles) {
  if (candles.length < 2) return false;
  const a = candles[candles.length - 2], b = candles[candles.length - 1];
  return b.high > a.high && b.low < a.low;
}

// Three-candle reversal: a directional push, then a bar that closes back
// through the first bar's body.
export function threeCandleReversal(candles) {
  if (candles.length < 3) return null;
  const [a, b, c] = candles.slice(-3);
  const up = a.close > a.open && b.close > b.open;
  const down = a.close < a.open && b.close < b.open;
  if (up && c.close < a.open) return 'bearish';
  if (down && c.close > a.open) return 'bullish';
  return null;
}

// Candle imbalance: the sum of bullish bodies against bearish bodies over the
// window, as a -1…+1 ratio.
export function candleImbalance(candles, window = 20) {
  const win = candles.slice(-window);
  if (!win.length) return null;
  let up = 0, down = 0;
  win.forEach(k => {
    const body = k.close - k.open;
    if (body > 0) up += body;
    else down += -body;
  });
  const total = up + down;
  return total ? (up - down) / total : 0;
}

// Effort versus result: the activity spent (tick count) against the ground
// covered (body size). A high ratio means lots of ticks for little progress.
export function effortVsResult(candles, window = 20) {
  const win = candles.slice(-window);
  if (!win.length) return null;
  const effort = win.reduce((a, k) => a + (k.ticks ?? k.volume ?? 1), 0);
  const result = Math.abs(win[win.length - 1].close - win[0].open);
  return result ? effort / result : null;
}

// One object with every candle read for the latest bar.
export function candleRead(candles = []) {
  if (!candles.length) {
    return { body: null, wick: null, displacement: null, streak: 0, rejection: null, engulfing: null, inside: false, outside: false, reversal: null, imbalance: null, effort: null };
  }
  const cur = candles[candles.length - 1];
  return {
    body: bodyStrength(cur),
    wick: wickPressure(cur),
    displacement: candleDisplacement(candles),
    streak: consecutiveStrength(candles),
    rejection: rejection(cur),
    engulfing: isEngulfing(candles),
    inside: isInsideBar(candles),
    outside: isOutsideBar(candles),
    reversal: threeCandleReversal(candles),
    imbalance: candleImbalance(candles),
    effort: effortVsResult(candles),
  };
}
