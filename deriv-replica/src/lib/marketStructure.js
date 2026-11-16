// Market structure analysis.
//
// These routines read candle sequences and label them the way a discretionary
// trader would: swing highs and lows, the sequence of higher-highs and
// lower-lows, breaks of structure, gaps left behind by fast moves, and the
// zones price has reacted from. They are algorithmic interpretations of price
// alone — Deriv synthetic feeds carry no order book, so a "liquidity sweep" is
// an inference from a break-and-reclaim, never proof that any stop was taken.

import { max, min } from './indicators.js';

// Local swing points. A bar is a swing high when its high is the strict maximum
// of the `strength` bars on each side; the mirror defines a swing low. `type`
// is 'high' or 'low'.
export function swings(candles, strength = 2) {
  const out = [];
  for (let i = strength; i < candles.length - strength; i++) {
    const k = candles[i];
    let isHigh = true, isLow = true;
    for (let j = i - strength; j <= i + strength; j++) {
      if (j === i) continue;
      if (candles[j].high >= k.high) isHigh = false;
      if (candles[j].low <= k.low) isLow = false;
    }
    if (isHigh) out.push({ index: i, epoch: k.epoch, price: k.high, type: 'high' });
    if (isLow) out.push({ index: i, epoch: k.epoch, price: k.low, type: 'low' });
  }
  return out;
}

// Classify each swing against the previous same-type swing: HH, LH, HL or LL.
export function labelSwings(swingList) {
  const labeled = [];
  let lastHigh = null, lastLow = null;
  for (const s of swingList) {
    if (s.type === 'high') {
      const label = lastHigh == null ? 'H' : s.price > lastHigh ? 'HH' : 'LH';
      labeled.push({ ...s, label });
      lastHigh = s.price;
    } else {
      const label = lastLow == null ? 'L' : s.price > lastLow ? 'HL' : 'LL';
      labeled.push({ ...s, label });
      lastLow = s.price;
    }
  }
  return labeled;
}

// The market-structure read: the labelled swings, the current bias, and the
// most recent break of structure (BOS) or change of character (CHoCH).
// A BOS continues the prevailing trend; a CHoCH is the first break against it.
export function marketStructure(candles, strength = 2) {
  const labeled = labelSwings(swings(candles, strength));
  const highs = labeled.filter(s => s.type === 'high');
  const lows = labeled.filter(s => s.type === 'low');
  const lastHigh = highs[highs.length - 1] || null;
  const lastLow = lows[lows.length - 1] || null;

  let bias = 'neutral';
  if (lastHigh && lastLow) {
    if (lastHigh.label === 'HH' && lastLow.label === 'HL') bias = 'bullish';
    else if (lastHigh.label === 'LH' && lastLow.label === 'LL') bias = 'bearish';
    else bias = 'ranging';
  }

  // Walk the labelled swings in order and record every time a swing exceeds the
  // prior opposite extreme.
  let trend = null;
  let event = null;
  let prevHigh = null, prevLow = null;
  for (const s of labeled) {
    if (s.type === 'high') {
      if (prevHigh != null && s.price > prevHigh) {
        event = { kind: trend === 'bearish' ? 'CHoCH' : 'BOS', direction: 'up', price: s.price, epoch: s.epoch };
        trend = 'bullish';
      }
      prevHigh = s.price;
    } else {
      if (prevLow != null && s.price < prevLow) {
        event = { kind: trend === 'bullish' ? 'CHoCH' : 'BOS', direction: 'down', price: s.price, epoch: s.epoch };
        trend = 'bearish';
      }
      prevLow = s.price;
    }
  }

  return {
    swings: labeled,
    bias,
    trend,
    event,
    lastHigh,
    lastLow,
    higherHighs: highs.filter(s => s.label === 'HH').length,
    lowerLows: lows.filter(s => s.label === 'LL').length,
  };
}

// Fair value gaps: a three-bar sequence where the middle bar's range leaves a
// gap between the first and third bars' wicks. Returns unfilled gaps only.
export function fairValueGaps(candles, lookback = 50) {
  const gaps = [];
  const start = Math.max(2, candles.length - lookback);
  for (let i = start; i < candles.length; i++) {
    const [a, , c] = [candles[i - 2], candles[i - 1], candles[i]];
    if (c.low > a.high) gaps.push({ type: 'bullish', from: a.high, to: c.low, index: i - 1, epoch: candles[i - 1].epoch });
    else if (c.high < a.low) gaps.push({ type: 'bearish', from: c.high, to: a.low, index: i - 1, epoch: candles[i - 1].epoch });
  }
  // Drop gaps the price has since traded back through.
  const lastClose = candles.length ? candles[candles.length - 1].close : null;
  return gaps.filter(g => (g.type === 'bullish' ? lastClose > g.to : lastClose < g.to));
}

// Order blocks: the last opposing candle before a displacement move that broke
// structure. Simplified to "last down candle before a strong up move" and its
// mirror, which is what the block visually marks.
export function orderBlocks(candles, lookback = 60, displacementMult = 1.5) {
  if (candles.length < 6) return [];
  const ranges = candles.map(k => k.high - k.low);
  const start = Math.max(1, candles.length - lookback);
  const blocks = [];
  for (let i = start; i < candles.length; i++) {
    const prev = candles[i - 1], cur = candles[i];
    const avg = ranges.slice(Math.max(0, i - 20), i).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(20, i));
    const strong = avg > 0 && (cur.high - cur.low) > avg * displacementMult;
    if (!strong) continue;
    if (cur.close > cur.open && prev.close < prev.open) {
      blocks.push({ type: 'bullish', from: prev.low, to: prev.high, index: i - 1, epoch: prev.epoch });
    } else if (cur.close < cur.open && prev.close > prev.open) {
      blocks.push({ type: 'bearish', from: prev.high, to: prev.low, index: i - 1, epoch: prev.epoch });
    }
  }
  return blocks.slice(-6);
}

// Liquidity sweep: price pokes beyond a recent swing extreme then closes back
// inside within a few bars. This is a price-action inference, not a record of
// any actual stop order being triggered.
export function liquiditySweeps(candles, strength = 2, reclaimBars = 3) {
  const labeled = labelSwings(swings(candles, strength));
  const sweeps = [];
  for (const s of labeled) {
    const after = candles.slice(s.index + 1, s.index + 1 + reclaimBars);
    if (!after.length) continue;
    if (s.type === 'high') {
      const poked = after.some(k => k.high > s.price);
      const reclaimed = after.some(k => k.close < s.price);
      if (poked && reclaimed) sweeps.push({ type: 'bearish', level: s.price, index: s.index, epoch: s.epoch });
    } else {
      const poked = after.some(k => k.low < s.price);
      const reclaimed = after.some(k => k.close > s.price);
      if (poked && reclaimed) sweeps.push({ type: 'bullish', level: s.price, index: s.index, epoch: s.epoch });
    }
  }
  return sweeps.slice(-6);
}

// Equal highs / lows: swing extremes within a tolerance of one another, which
// often sit just before a sweep.
export function equalExtremes(candles, strength = 2, tolerancePct = 0.0005) {
  const labeled = labelSwings(swings(candles, strength));
  const highs = labeled.filter(s => s.type === 'high');
  const lows = labeled.filter(s => s.type === 'low');
  const pairs = [];
  const scan = (list, type) => {
    for (let i = 1; i < list.length; i++) {
      const a = list[i - 1], b = list[i];
      const tol = Math.abs(a.price) * tolerancePct;
      if (Math.abs(a.price - b.price) <= tol) pairs.push({ type, price: (a.price + b.price) / 2, epochs: [a.epoch, b.epoch] });
    }
  };
  scan(highs, 'high');
  scan(lows, 'low');
  return pairs.slice(-6);
}

// Premium / discount within the current dealing range: the midpoint of the
// last swing high and low splits the range, and price above it trades at a
// premium, below it at a discount.
export function premiumDiscount(candles, strength = 2) {
  const labeled = labelSwings(swings(candles, strength));
  const highs = labeled.filter(s => s.type === 'high');
  const lows = labeled.filter(s => s.type === 'low');
  const hi = highs.length ? highs[highs.length - 1].price : (candles.length ? max(candles.map(k => k.high)) : null);
  const lo = lows.length ? lows[lows.length - 1].price : (candles.length ? min(candles.map(k => k.low)) : null);
  if (hi == null || lo == null || hi === lo) return { hi, lo, mid: null, position: null, zone: null };
  const mid = (hi + lo) / 2;
  const close = candles[candles.length - 1].close;
  const position = (close - lo) / (hi - lo);       // 0 at range low, 1 at range high
  return { hi, lo, mid, position, zone: position >= 0.5 ? 'premium' : 'discount' };
}

// One object with every structural reading, for the analytics panel.
export function structureRead(candles = []) {
  if (!candles || candles.length < 5) {
    return { structure: null, fvg: [], blocks: [], sweeps: [], equals: [], range: null };
  }
  return {
    structure: marketStructure(candles),
    fvg: fairValueGaps(candles),
    blocks: orderBlocks(candles),
    sweeps: liquiditySweeps(candles),
    equals: equalExtremes(candles),
    range: premiumDiscount(candles),
  };
}
