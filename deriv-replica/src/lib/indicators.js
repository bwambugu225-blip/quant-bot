// Technical-analysis helpers ported from the original bot.html engine.
// Pure functions over arrays of numbers or OHLC candles — no state.

export const closes = c => c.map(x => x.close);
export const highs = c => c.map(x => x.high);
export const lows = c => c.map(x => x.low);

export function max(arr) { let m = -Infinity; for (let i = 0; i < arr.length; i++) if (arr[i] > m) m = arr[i]; return m; }
export function min(arr) { let m = Infinity; for (let i = 0; i < arr.length; i++) if (arr[i] < m) m = arr[i]; return m; }

export function sma(arr, p) {
  if (arr.length < p) return null;
  let s = 0;
  for (let i = arr.length - p; i < arr.length; i++) s += arr[i];
  return s / p;
}

export function ema(arr, p) {
  if (arr.length < p) return null;
  const k = 2 / (p + 1);
  let e = 0;
  for (let i = 0; i < p; i++) e += arr[i];
  e /= p;
  for (let i = p; i < arr.length; i++) e = arr[i] * k + e * (1 - k);
  return e;
}

export function stddev(arr, p) {
  const m = sma(arr, p);
  if (m === null) return null;
  let s = 0;
  for (let i = arr.length - p; i < arr.length; i++) s += (arr[i] - m) ** 2;
  return Math.sqrt(s / p);
}

export function rsi(arr, p = 14) {
  if (arr.length < p + 1) return null;
  let g = 0, l = 0;
  for (let i = arr.length - p; i < arr.length; i++) {
    const d = arr[i] - arr[i - 1];
    if (d > 0) g += d; else l -= d;
  }
  const ag = g / p, al = l / p;
  if (al === 0) return 100;
  return 100 - 100 / (1 + ag / al);
}

export function stoch(highArr, lowArr, closeArr, p = 14) {
  if (closeArr.length < p) return null;
  const hh = max(highArr.slice(-p));
  const ll = min(lowArr.slice(-p));
  return hh === ll ? 50 : ((closeArr[closeArr.length - 1] - ll) / (hh - ll)) * 100;
}

export function williamsR(highArr, lowArr, closeArr, p = 14) {
  if (closeArr.length < p) return null;
  const hh = max(highArr.slice(-p));
  const ll = min(lowArr.slice(-p));
  return hh === ll ? -50 : ((hh - closeArr[closeArr.length - 1]) / (hh - ll)) * -100;
}

export function cci(c, p = 14) {
  if (c.length < p) return null;
  const tps = c.slice(-p).map(x => (x.high + x.low + x.close) / 3);
  let s = 0;
  for (let i = 0; i < tps.length; i++) s += tps[i];
  const mn = s / p;
  let md = 0;
  for (let i = 0; i < tps.length; i++) md += Math.abs(tps[i] - mn);
  md /= p;
  if (md === 0) return 0;
  return (tps[tps.length - 1] - mn) / (0.015 * md);
}

export function heikenAshi(candles) {
  const ha = [];
  for (let i = 0; i < candles.length; i++) {
    const k = candles[i];
    let haO;
    if (i === 0) haO = (k.open + k.close) / 2;
    else { const prev = ha[i - 1]; haO = (prev.open + prev.close) / 2; }
    const haC = (k.open + k.high + k.low + k.close) / 4;
    const haH = Math.max(k.high, haO, haC);
    const haL = Math.min(k.low, haO, haC);
    ha.push({ epoch: k.epoch, open: haO, high: haH, low: haL, close: haC });
  }
  return ha;
}

export function atr(c, p = 14) {
  if (c.length < p + 1) return null;
  let s = 0;
  for (let i = c.length - p; i < c.length; i++) {
    const tr = c[i].high - c[i].low;
    const a1 = Math.abs(c[i].high - c[i - 1].close);
    const a2 = Math.abs(c[i].low - c[i - 1].close);
    s += Math.max(tr, a1, a2);
  }
  return s / p;
}

export function median(c) { return c.map(k => (k.high + k.low) / 2); }

export function aroon(candles, p = 25) {
  const n = candles.length;
  if (n < p + 1) return { up: 50, down: 50 };
  let hiIdx = n - 1, loIdx = n - 1;
  for (let i = n - 1; i > n - 1 - p; i--) {
    if (candles[i].high >= candles[hiIdx].high) hiIdx = i;
    if (candles[i].low <= candles[loIdx].low) loIdx = i;
  }
  const up = (100 * (p - (n - 1 - hiIdx))) / p;
  const down = (100 * (p - (n - 1 - loIdx))) / p;
  return { up, down };
}

export function ao(candles) {
  const m = median(candles);
  const out = [];
  for (let i = 0; i < m.length; i++) {
    if (i < 33) { out.push(0); continue; }
    const s5 = sma(m.slice(i - 4, i + 1), 5);
    const s34 = sma(m.slice(i - 33, i + 1), 34);
    out.push(s5 - s34);
  }
  return out;
}

export function ac(aoArr) {
  const out = [];
  for (let i = 0; i < aoArr.length; i++) {
    if (i < 5) { out.push(0); continue; }
    const s5 = sma(aoArr.slice(i - 4, i + 1), 5);
    out.push(aoArr[i] - s5);
  }
  return out;
}

export function isPinbar(k, wickMin = 0.6) {
  const range = (k.high - k.low) || 0.0001;
  const body = Math.abs(k.close - k.open);
  const upperWick = k.high - Math.max(k.open, k.close);
  const lowerWick = Math.min(k.open, k.close) - k.low;
  if (lowerWick / range >= wickMin && body / range < 0.4) return 'bull';
  if (upperWick / range >= wickMin && body / range < 0.4) return 'bear';
  return null;
}

export function isStrong(k, minRatio = 0.7) {
  const range = (k.high - k.low) || 0.0001;
  const body = Math.abs(k.close - k.open);
  return body / range >= minRatio;
}

export function calcEMA(prices, period) {
  if (prices.length < period) return prices[prices.length - 1];
  const k = 2 / (period + 1);
  let e = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) e = prices[i] * k + e * (1 - k);
  return e;
}

export function calcADX(candles, period = 14) {
  if (candles.length < period + 1) return null;
  let plusDM = 0, minusDM = 0, atrVal = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    const up = candles[i].high - candles[i - 1].high;
    const dn = candles[i - 1].low - candles[i].low;
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close)
    );
    if (i === candles.length - period) atrVal = tr;
    else atrVal = (atrVal * 13 + tr) / 14;
    if (up > dn && up > 0) plusDM += up;
    if (dn > up && dn > 0) minusDM += dn;
  }
  const pDI = (100 * plusDM) / (atrVal * period || 1);
  const nDI = (100 * minusDM) / (atrVal * period || 1);
  const dx = (Math.abs(pDI - nDI) / (pDI + nDI || 1)) * 100;
  return { pDI, nDI, adx: dx, trend: pDI > nDI ? 'UP' : 'DN', strength: dx };
}

export function calcKelly(pWin, payoutRatio = 0.8) {
  if (pWin <= 0 || pWin >= 1) return 0.5;
  const q = 1 - pWin;
  const b = payoutRatio;
  const f = (pWin * b - q) / b;
  return Math.max(0.05, Math.min(0.95, f || 0.5));
}
