// Technical-analysis library.
//
// Pure functions over OHLC candle arrays. Two shapes are exported:
//   • point helpers (sma, ema, rsi, …) return the latest value — cheap, used by
//     the live signal path.
//   • `*Series` helpers return the full series aligned to the input array
//     (index i = value computed through candle i, null while warming up) — used
//     by the strategy builder, the analytics panel and the backtester.
//
// Every indicator resolves a window/period from params and never reads beyond
// the candles it is given, so the same function works on a live buffer and on a
// historical slice during a backtest.

export const closes = c => c.map(x => x.close);
export const highs = c => c.map(x => x.high);
export const lows = c => c.map(x => x.low);
export const volumes = c => c.map(x => x.volume ?? x.ticks ?? 0);
export const hl2 = c => c.map(x => (x.high + x.low) / 2);
export const hlc3 = c => c.map(x => (x.high + x.low + x.close) / 3);
export const ohlc4 = c => c.map(x => (x.open + x.high + x.low + x.close) / 4);

export function max(arr) { let m = -Infinity; for (let i = 0; i < arr.length; i++) if (arr[i] > m) m = arr[i]; return m; }
export function min(arr) { let m = Infinity; for (let i = 0; i < arr.length; i++) if (arr[i] < m) m = arr[i]; return m; }
export function sum(arr) { let s = 0; for (let i = 0; i < arr.length; i++) s += arr[i]; return s; }
export function mean(arr) { return arr.length ? sum(arr) / arr.length : null; }

// Last defined value of a series — the snapshot uses this for every indicator
// that returns a plain aligned array.
export function lastOf(series) {
  for (let i = series.length - 1; i >= 0; i--) if (series[i] != null) return series[i];
  return null;
}

export function stdev(arr, p) {
  const slice = p ? arr.slice(-p) : arr;
  if (slice.length < 2) return null;
  const m = mean(slice);
  return Math.sqrt(slice.reduce((a, x) => a + (x - m) ** 2, 0) / slice.length);
}

// ── moving averages ───────────────────────────────────────────────────────
export function sma(arr, p) {
  if (arr.length < p || p <= 0) return null;
  let s = 0;
  for (let i = arr.length - p; i < arr.length; i++) s += arr[i];
  return s / p;
}

export function smaSeries(arr, p) {
  const out = new Array(arr.length).fill(null);
  let s = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i];
    if (i >= p) s -= arr[i - p];
    if (i >= p - 1) out[i] = s / p;
  }
  return out;
}

export function ema(arr, p) {
  const s = emaSeries(arr, p);
  return s[s.length - 1] ?? null;
}

export function emaSeries(arr, p) {
  const out = new Array(arr.length).fill(null);
  if (!arr.length || p <= 0) return out;
  const k = 2 / (p + 1);
  let e = null;
  for (let i = 0; i < arr.length; i++) {
    if (i === p - 1) {
      let s = 0;
      for (let j = 0; j < p; j++) s += arr[j];
      e = s / p;
      out[i] = e;
    } else if (i >= p) {
      e = arr[i] * k + e * (1 - k);
      out[i] = e;
    }
  }
  return out;
}

export function wmaSeries(arr, p) {
  const out = new Array(arr.length).fill(null);
  const denom = (p * (p + 1)) / 2;
  for (let i = p - 1; i < arr.length; i++) {
    let s = 0;
    for (let j = 0; j < p; j++) s += arr[i - j] * (p - j);
    out[i] = s / denom;
  }
  return out;
}

// ── volatility ────────────────────────────────────────────────────────────
export function trueRangeSeries(c) {
  const out = new Array(c.length).fill(null);
  for (let i = 0; i < c.length; i++) {
    if (i === 0) { out[i] = c[i].high - c[i].low; continue; }
    out[i] = Math.max(
      c[i].high - c[i].low,
      Math.abs(c[i].high - c[i - 1].close),
      Math.abs(c[i].low - c[i - 1].close),
    );
  }
  return out;
}

export function atrSeries(c, p = 14) {
  const tr = trueRangeSeries(c);
  const out = new Array(c.length).fill(null);
  if (c.length < p) return out;
  let a = mean(tr.slice(0, p));
  out[p - 1] = a;
  for (let i = p; i < c.length; i++) {
    a = (a * (p - 1) + tr[i]) / p;
    out[i] = a;
  }
  return out;
}

export function atr(c, p = 14) {
  const s = atrSeries(c, p);
  return s[s.length - 1] ?? null;
}

export function bollingerSeries(arr, p = 20, mult = 2) {
  const mid = smaSeries(arr, p);
  const upper = new Array(arr.length).fill(null);
  const lower = new Array(arr.length).fill(null);
  for (let i = 0; i < arr.length; i++) {
    if (mid[i] == null) continue;
    const sd = stdev(arr.slice(i - p + 1, i + 1));
    upper[i] = mid[i] + mult * sd;
    lower[i] = mid[i] - mult * sd;
  }
  return { mid, upper, lower };
}

export function bollinger(arr, p = 20, mult = 2) {
  const s = bollingerSeries(arr, p, mult);
  const i = arr.length - 1;
  return { mid: s.mid[i], upper: s.upper[i], lower: s.lower[i] };
}

export function keltnerSeries(c, p = 20, mult = 1.5) {
  const mid = emaSeries(closes(c), p);
  const atrS = atrSeries(c, p);
  const upper = new Array(c.length).fill(null);
  const lower = new Array(c.length).fill(null);
  for (let i = 0; i < c.length; i++) {
    if (mid[i] == null || atrS[i] == null) continue;
    upper[i] = mid[i] + mult * atrS[i];
    lower[i] = mid[i] - mult * atrS[i];
  }
  return { mid, upper, lower };
}

export function donchianSeries(c, p = 20) {
  const upper = new Array(c.length).fill(null);
  const lower = new Array(c.length).fill(null);
  for (let i = p - 1; i < c.length; i++) {
    let hi = -Infinity, lo = Infinity;
    for (let j = i - p + 1; j <= i; j++) { hi = Math.max(hi, c[j].high); lo = Math.min(lo, c[j].low); }
    upper[i] = hi; lower[i] = lo;
  }
  return { upper, lower, mid: upper.map((u, i) => (u == null ? null : (u + lower[i]) / 2)) };
}

// ── momentum / oscillators ─────────────────────────────────────────────────
export function rsiSeries(arr, p = 14) {
  const out = new Array(arr.length).fill(null);
  if (arr.length <= p) return out;
  let g = 0, l = 0;
  for (let i = 1; i <= p; i++) {
    const d = arr[i] - arr[i - 1];
    if (d > 0) g += d; else l -= d;
  }
  let ag = g / p, al = l / p;
  out[p] = al === 0 ? 100 : 100 - 100 / (1 + ag / al);
  for (let i = p + 1; i < arr.length; i++) {
    const d = arr[i] - arr[i - 1];
    const up = d > 0 ? d : 0, dn = d < 0 ? -d : 0;
    ag = (ag * (p - 1) + up) / p;
    al = (al * (p - 1) + dn) / p;
    out[i] = al === 0 ? 100 : 100 - 100 / (1 + ag / al);
  }
  return out;
}

export function rsi(arr, p = 14) {
  const s = rsiSeries(arr, p);
  return s[s.length - 1] ?? null;
}

export function stochSeries(c, p = 14, smooth = 3) {
  const kRaw = new Array(c.length).fill(null);
  for (let i = p - 1; i < c.length; i++) {
    let hi = -Infinity, lo = Infinity;
    for (let j = i - p + 1; j <= i; j++) { hi = Math.max(hi, c[j].high); lo = Math.min(lo, c[j].low); }
    kRaw[i] = hi === lo ? 50 : ((c[i].close - lo) / (hi - lo)) * 100;
  }
  const d = smaSeries(kRaw.map(x => x ?? 0), smooth);
  const k = smaSeries(kRaw.map(x => x ?? 0), smooth);
  return { k, d };
}

export function stoch(highArr, lowArr, closeArr, p = 14) {
  if (closeArr.length < p) return null;
  const hh = max(highArr.slice(-p));
  const ll = min(lowArr.slice(-p));
  return hh === ll ? 50 : ((closeArr[closeArr.length - 1] - ll) / (hh - ll)) * 100;
}

export function stochRsiSeries(arr, p = 14, k = 3) {
  const r = rsiSeries(arr, p);
  const out = new Array(arr.length).fill(null);
  for (let i = p * 2; i < arr.length; i++) {
    const win = r.slice(i - p + 1, i + 1).filter(x => x != null);
    if (win.length < p) continue;
    const hi = max(win), lo = min(win);
    out[i] = hi === lo ? 50 : ((r[i] - lo) / (hi - lo)) * 100;
  }
  return smaSeries(out.map(x => x ?? 0), k);
}

export function williamsRSeries(c, p = 14) {
  const out = new Array(c.length).fill(null);
  for (let i = p - 1; i < c.length; i++) {
    let hi = -Infinity, lo = Infinity;
    for (let j = i - p + 1; j <= i; j++) { hi = Math.max(hi, c[j].high); lo = Math.min(lo, c[j].low); }
    out[i] = hi === lo ? -50 : ((hi - c[i].close) / (hi - lo)) * -100;
  }
  return out;
}

export function williamsR(highArr, lowArr, closeArr, p = 14) {
  if (closeArr.length < p) return null;
  const hh = max(highArr.slice(-p));
  const ll = min(lowArr.slice(-p));
  return hh === ll ? -50 : ((hh - closeArr[closeArr.length - 1]) / (hh - ll)) * -100;
}

export function cciSeries(c, p = 20) {
  const tp = hlc3(c);
  const smaTp = smaSeries(tp, p);
  const out = new Array(c.length).fill(null);
  for (let i = p - 1; i < c.length; i++) {
    const win = tp.slice(i - p + 1, i + 1);
    const m = smaTp[i];
    let md = 0;
    for (const x of win) md += Math.abs(x - m);
    md /= p;
    out[i] = md === 0 ? 0 : (tp[i] - m) / (0.015 * md);
  }
  return out;
}

export function cci(c, p = 14) {
  const s = cciSeries(c, p);
  return s[s.length - 1] ?? null;
}

export function rocSeries(arr, p = 12) {
  const out = new Array(arr.length).fill(null);
  for (let i = p; i < arr.length; i++) {
    const prev = arr[i - p];
    out[i] = prev ? ((arr[i] - prev) / prev) * 100 : 0;
  }
  return out;
}

export function momentumSeries(arr, p = 10) {
  const out = new Array(arr.length).fill(null);
  for (let i = p; i < arr.length; i++) out[i] = arr[i] - arr[i - p];
  return out;
}

// ── trend strength / direction ─────────────────────────────────────────────
export function adxSeries(c, p = 14) {
  const n = c.length;
  const adx = new Array(n).fill(null), pdi = new Array(n).fill(null), ndi = new Array(n).fill(null);
  if (n < p + 1) return { adx, pdi, ndi };
  const tr = trueRangeSeries(c);
  let atrV = 0, pDM = 0, nDM = 0;
  for (let i = 1; i <= p; i++) {
    const up = c[i].high - c[i - 1].high;
    const dn = c[i - 1].low - c[i].low;
    pDM += up > dn && up > 0 ? up : 0;
    nDM += dn > up && dn > 0 ? dn : 0;
    atrV += tr[i];
  }
  const smooth = (i) => {
    const up = c[i].high - c[i - 1].high;
    const dn = c[i - 1].low - c[i].low;
    const pdm = up > dn && up > 0 ? up : 0;
    const ndm = dn > up && dn > 0 ? dn : 0;
    pDM = pDM - pDM / p + pdm;
    nDM = nDM - nDM / p + ndm;
    atrV = atrV - atrV / p + tr[i];
  };
  const dxAt = () => {
    const pDI = (100 * pDM) / (atrV || 1);
    const nDI = (100 * nDM) / (atrV || 1);
    pdi[0] = pDI; ndi[0] = nDI;
    return { pDI, nDI, dx: (Math.abs(pDI - nDI) / (pDI + nDI || 1)) * 100 };
  };
  let first = dxAt();
  pdi[p] = first.pDI; ndi[p] = first.nDI;
  let adxV = first.dx;
  adx[p] = adxV;
  for (let i = p + 1; i < n; i++) {
    smooth(i);
    const r = dxAt();
    pdi[i] = r.pDI; ndi[i] = r.nDI;
    adxV = (adxV * (p - 1) + r.dx) / p;
    adx[i] = adxV;
  }
  return { adx, pdi, ndi };
}

export function adx(c, p = 14) {
  const s = adxSeries(c, p);
  const i = c.length - 1;
  if (s.adx[i] == null) return null;
  return { pDI: s.pdi[i], nDI: s.ndi[i], adx: s.adx[i], trend: s.pdi[i] > s.ndi[i] ? 'UP' : 'DN', strength: s.adx[i] };
}

export function calcADX(c, period = 14) { return adx(c, period); }

export function aroonSeries(c, p = 25) {
  const up = new Array(c.length).fill(null), down = new Array(c.length).fill(null);
  for (let i = p; i < c.length; i++) {
    let hiIdx = i - p, loIdx = i - p;
    for (let j = i - p; j <= i; j++) {
      if (c[j].high >= c[hiIdx].high) hiIdx = j;
      if (c[j].low <= c[loIdx].low) loIdx = j;
    }
    up[i] = (100 * (p - (i - hiIdx))) / p;
    down[i] = (100 * (p - (i - loIdx))) / p;
  }
  return { up, down };
}

export function aroon(c, p = 25) {
  const s = aroonSeries(c, p);
  const i = c.length - 1;
  return { up: s.up[i] ?? 50, down: s.down[i] ?? 50 };
}

export function macdSeries(arr, fast = 12, slow = 26, signal = 9) {
  const ef = emaSeries(arr, fast);
  const es = emaSeries(arr, slow);
  const macd = arr.map((_, i) => (ef[i] != null && es[i] != null ? ef[i] - es[i] : null));
  const sig = emaSeries(macd.map(x => x ?? 0), signal).map((x, i) => (macd[i] == null ? null : x));
  const hist = macd.map((m, i) => (m == null || sig[i] == null ? null : m - sig[i]));
  return { macd, signal: sig, hist };
}

export function macd(arr, fast = 12, slow = 26, signal = 9) {
  const s = macdSeries(arr, fast, slow, signal);
  const i = arr.length - 1;
  return { macd: s.macd[i], signal: s.signal[i], hist: s.hist[i] };
}

// ── volume / flow ──────────────────────────────────────────────────────────
export function obvSeries(c) {
  const out = new Array(c.length).fill(0);
  for (let i = 1; i < c.length; i++) {
    const v = c[i].volume ?? c[i].ticks ?? 1;
    out[i] = out[i - 1] + (c[i].close > c[i - 1].close ? v : c[i].close < c[i - 1].close ? -v : 0);
  }
  return out;
}

export function mfiSeries(c, p = 14) {
  const out = new Array(c.length).fill(null);
  const tp = hlc3(c);
  for (let i = p; i < c.length; i++) {
    let pos = 0, neg = 0;
    for (let j = i - p + 1; j <= i; j++) {
      const flow = tp[j] * (c[j].volume ?? c[j].ticks ?? 1);
      if (tp[j] > tp[j - 1]) pos += flow; else if (tp[j] < tp[j - 1]) neg += flow;
    }
    out[i] = neg === 0 ? 100 : 100 - 100 / (1 + pos / neg);
  }
  return out;
}

export function vwapSeries(c, p = 20) {
  const out = new Array(c.length).fill(null);
  for (let i = p - 1; i < c.length; i++) {
    let pv = 0, vol = 0;
    for (let j = i - p + 1; j <= i; j++) {
      const v = c[j].volume ?? c[j].ticks ?? 1;
      pv += hlc3([c[j]])[0] * v; vol += v;
    }
    out[i] = vol ? pv / vol : null;
  }
  return out;
}

// ── Ichimoku ───────────────────────────────────────────────────────────────
export function ichimokuSeries(c, conv = 9, base = 26, spanB = 52) {
  const midOf = (i, p) => {
    if (i < p - 1) return null;
    let hi = -Infinity, lo = Infinity;
    for (let j = i - p + 1; j <= i; j++) { hi = Math.max(hi, c[j].high); lo = Math.min(lo, c[j].low); }
    return (hi + lo) / 2;
  };
  const tenkan = c.map((_, i) => midOf(i, conv));
  const kijun = c.map((_, i) => midOf(i, base));
  const senkouA = c.map((_, i) => (tenkan[i] != null && kijun[i] != null ? (tenkan[i] + kijun[i]) / 2 : null));
  const senkouB = c.map((_, i) => midOf(i, spanB));
  return { tenkan, kijun, senkouA, senkouB };
}

export function ichimoku(c) {
  const s = ichimokuSeries(c);
  const i = c.length - 1;
  return { tenkan: s.tenkan[i], kijun: s.kijun[i], senkouA: s.senkouA[i], senkouB: s.senkouB[i] };
}

// ── candlestick patterns ───────────────────────────────────────────────────
export function isPinbar(k, wickMin = 0.6) {
  const range = (k.high - k.low) || 1e-9;
  const body = Math.abs(k.close - k.open);
  const upperWick = k.high - Math.max(k.open, k.close);
  const lowerWick = Math.min(k.open, k.close) - k.low;
  if (lowerWick / range >= wickMin && body / range < 0.4) return 'bull';
  if (upperWick / range >= wickMin && body / range < 0.4) return 'bear';
  return null;
}

export function isStrong(k, minRatio = 0.7) {
  const range = (k.high - k.low) || 1e-9;
  return Math.abs(k.close - k.open) / range >= minRatio;
}

export function heikenAshi(candles) {
  const ha = [];
  for (let i = 0; i < candles.length; i++) {
    const k = candles[i];
    const haO = i === 0 ? (k.open + k.close) / 2 : (ha[i - 1].open + ha[i - 1].close) / 2;
    const haC = (k.open + k.high + k.low + k.close) / 4;
    ha.push({ epoch: k.epoch, open: haO, high: Math.max(k.high, haO, haC), low: Math.min(k.low, haO, haC), close: haC });
  }
  return ha;
}

export function superTrendSeries(c, p = 10, mult = 3) {
  const atrS = atrSeries(c, p);
  const up = new Array(c.length).fill(null), dn = new Array(c.length).fill(null), dir = new Array(c.length).fill(null);
  let prevUp = null, prevDn = null, trend = 1;
  for (let i = 0; i < c.length; i++) {
    if (atrS[i] == null) continue;
    const mid = (c[i].high + c[i].low) / 2;
    let upper = mid + mult * atrS[i];
    let lower = mid - mult * atrS[i];
    if (prevUp != null) upper = c[i - 1].close > prevUp ? upper : Math.min(upper, prevUp);
    if (prevDn != null) lower = c[i - 1].close < prevDn ? lower : Math.max(lower, prevDn);
    if (prevUp != null && c[i].close > prevUp) trend = 1;
    else if (prevDn != null && c[i].close < prevDn) trend = -1;
    up[i] = upper; dn[i] = lower; dir[i] = trend;
    prevUp = upper; prevDn = lower;
  }
  return { up, dn, dir };
}

// ── extended indicator library ─────────────────────────────────────────────
// Every function below returns an aligned series (index i = value through
// candle i, null while warming up), matching the rest of the library.

// Double / triple exponential moving averages — faster trend reads than a plain
// EMA at the same period.
export function demaSeries(arr, p = 20) {
  const e1 = emaSeries(arr, p);
  const e2 = emaSeries(e1.map(v => (v == null ? 0 : v)), p);
  return arr.map((_, i) => (e1[i] != null && e2[i] != null ? 2 * e1[i] - e2[i] : null));
}

export function temaSeries(arr, p = 20) {
  const e1 = emaSeries(arr, p);
  const e2 = emaSeries(e1.map(v => (v == null ? 0 : v)), p);
  const e3 = emaSeries(e2.map(v => (v == null ? 0 : v)), p);
  return arr.map((_, i) => (e1[i] != null && e2[i] != null && e3[i] != null ? 3 * e1[i] - 3 * e2[i] + e3[i] : null));
}

// Hull moving average — a low-lag smoothing built from two WMAs.
export function hmaSeries(arr, p = 20) {
  const half = Math.max(1, Math.round(p / 2));
  const root = Math.max(1, Math.round(Math.sqrt(p)));
  const wHalf = wmaSeries(arr, half);
  const wFull = wmaSeries(arr, p);
  const raw = arr.map((_, i) => (wHalf[i] != null && wFull[i] != null ? 2 * wHalf[i] - wFull[i] : null));
  const seed = raw.map(v => (v == null ? 0 : v));
  const out = wmaSeries(seed, root);
  return arr.map((_, i) => (raw[i] == null ? null : out[i]));
}

// TRIX — the rate of change of a triple-smoothed EMA. Crossings of zero mark
// trend reversals with very little noise.
export function trixSeries(arr, p = 15) {
  const e1 = emaSeries(arr, p);
  const e2 = emaSeries(e1.map(v => (v == null ? 0 : v)), p);
  const e3 = emaSeries(e2.map(v => (v == null ? 0 : v)), p);
  const out = new Array(arr.length).fill(null);
  for (let i = 1; i < arr.length; i++) {
    if (e3[i] != null && e3[i - 1]) out[i] = ((e3[i] - e3[i - 1]) / e3[i - 1]) * 100;
  }
  return out;
}

// Williams %R is defined earlier; Williams Alligator uses three shifted SMAs.
export function alligatorSeries(c, jaw = 13, teeth = 8, lips = 5) {
  const cl = closes(c);
  const shift = (s, n) => s.map((_, i) => (i - n >= 0 ? s[i - n] : null));
  return {
    jaw: shift(smaSeries(cl, jaw), 8),
    teeth: shift(smaSeries(cl, teeth), 5),
    lips: shift(smaSeries(cl, lips), 3),
  };
}

// Awesome Oscillator — the 5/34 SMA of the median price, a momentum histogram.
export function awesomeSeries(c) {
  const med = c.map(k => (k.high + k.low) / 2);
  const f = smaSeries(med, 5);
  const s = smaSeries(med, 34);
  return med.map((_, i) => (f[i] != null && s[i] != null ? f[i] - s[i] : null));
}

// Chaikin Money Flow — the money-flow volume over a window, signed by where the
// close sits inside each bar's range.
export function cmfSeries(c, p = 20) {
  const out = new Array(c.length).fill(null);
  for (let i = p - 1; i < c.length; i++) {
    let mfv = 0, vol = 0;
    for (let j = i - p + 1; j <= i; j++) {
      const k = c[j];
      const range = (k.high - k.low) || 1e-9;
      const v = k.volume ?? k.ticks ?? 1;
      mfv += (((k.close - k.low) - (k.high - k.close)) / range) * v;
      vol += v;
    }
    out[i] = vol ? mfv / vol : null;
  }
  return out;
}

// Klinger Volume Oscillator — the EMA(34) − EMA(55) of a volume force, with a
// 13-period signal line.
export function klingerSeries(c, fast = 34, slow = 55, signal = 13) {
  const vf = new Array(c.length).fill(null);
  let prevTrend = 0, prevDm = 0;
  for (let i = 0; i < c.length; i++) {
    const k = c[i];
    const trend = k.high + k.low + k.close;
    const dm = k.high - k.low;
    if (i === 0) { prevTrend = trend; prevDm = dm; vf[i] = 0; continue; }
    const cm = prevTrend === trend ? prevDm + dm
      : trend > prevTrend ? prevDm + dm
      : dm;
    const v = k.volume ?? k.ticks ?? 1;
    vf[i] = v * Math.abs(2 * dm / ((k.high - k.low) || 1e-9) - 1) * (trend > prevTrend ? 1 : -1) * cm;
    prevTrend = trend; prevDm = dm;
  }
  const ef = emaSeries(vf, fast);
  const es = emaSeries(vf, slow);
  const kvo = vf.map((_, i) => (ef[i] != null && es[i] != null ? ef[i] - es[i] : null));
  const sig = emaSeries(kvo.map(v => (v == null ? 0 : v)), signal);
  return { kvo, signal: sig };
}

// Fisher Transform — sharpens turning points by mapping a normalised price to a
// Gaussian-like range.
export function fisherSeries(c, p = 10) {
  const med = c.map(k => (k.high + k.low) / 2);
  const out = new Array(c.length).fill(null);
  let value = 0;
  for (let i = p - 1; i < c.length; i++) {
    let hi = -Infinity, lo = Infinity;
    for (let j = i - p + 1; j <= i; j++) { hi = Math.max(hi, med[j]); lo = Math.min(lo, med[j]); }
    const range = (hi - lo) || 1e-9;
    const x = 2 * ((med[i] - lo) / range - 0.5);
    value = 0.33 * x + 0.67 * value;
    value = Math.max(-0.999, Math.min(0.999, value));
    out[i] = 0.5 * Math.log((1 + value) / (1 - value));
  }
  return out;
}

// Vortex Indicator — the positive and negative trend strength; VI+ above VI−
// is an uptrend.
export function vortexSeries(c, p = 14) {
  const vmP = new Array(c.length).fill(null);
  const vmN = new Array(c.length).fill(null);
  const tr = trueRangeSeries(c);
  const vip = new Array(c.length).fill(null);
  const vin = new Array(c.length).fill(null);
  for (let i = 0; i < c.length; i++) {
    if (i === 0) continue;
    vmP[i] = Math.abs(c[i].high - c[i - 1].low);
    vmN[i] = Math.abs(c[i].low - c[i - 1].high);
  }
  for (let i = p; i < c.length; i++) {
    let sp = 0, sn = 0, st = 0;
    for (let j = i - p + 1; j <= i; j++) { sp += vmP[j]; sn += vmN[j]; st += tr[j]; }
    vip[i] = st ? sp / st : null;
    vin[i] = st ? sn / st : null;
  }
  return { plus: vip, minus: vin };
}

// Detrended Price Oscillator — price minus its own shifted SMA, which removes
// the trend and leaves the cycle.
export function dpoSeries(c, p = 20) {
  const cl = closes(c);
  const s = smaSeries(cl, p);
  const shift = Math.floor(p / 2) + 1;
  return cl.map((v, i) => (s[i - shift] != null ? v - s[i - shift] : null));
}

// Ease of Movement — how far price travels per unit of volume.
export function eomSeries(c, p = 14) {
  const out = new Array(c.length).fill(null);
  const raw = new Array(c.length).fill(null);
  for (let i = 1; i < c.length; i++) {
    const k = c[i], pk = c[i - 1];
    const midMove = ((k.high + k.low) / 2) - ((pk.high + pk.low) / 2);
    const boxRatio = ((k.volume ?? k.ticks ?? 1) / 1e4) / ((k.high - k.low) || 1e-9);
    raw[i] = boxRatio ? midMove / boxRatio : 0;
  }
  const seed = raw.map(v => (v == null ? 0 : v));
  const s = smaSeries(seed, p);
  return raw.map((v, i) => (v == null ? null : s[i]));
}

// Elder's Force Index — volume-weighted price change.
export function forceIndexSeries(c, p = 13) {
  const raw = new Array(c.length).fill(null);
  for (let i = 1; i < c.length; i++) {
    const v = c[i].volume ?? c[i].ticks ?? 1;
    raw[i] = (c[i].close - c[i - 1].close) * v;
  }
  const seed = raw.map(v => (v == null ? 0 : v));
  const s = emaSeries(seed, p);
  return raw.map((v, i) => (v == null ? null : s[i]));
}

// Ultimate Oscillator — a weighted blend of three timeframes that is less prone
// to false divergences than a single-period oscillator.
export function ultimateSeries(c, p1 = 7, p2 = 14, p3 = 28) {
  const bp = new Array(c.length).fill(null);
  const tr = trueRangeSeries(c);
  for (let i = 1; i < c.length; i++) {
    bp[i] = c[i].close - Math.min(c[i].low, c[i - 1].close);
  }
  const sum = (arr, i, p) => {
    let s = 0;
    for (let j = i - p + 1; j <= i; j++) { if (arr[j] == null) return null; s += arr[j]; }
    return s;
  };
  const out = new Array(c.length).fill(null);
  for (let i = p3; i < c.length; i++) {
    const a1 = sum(bp, i, p1), b1 = sum(tr, i, p1);
    const a2 = sum(bp, i, p2), b2 = sum(tr, i, p2);
    const a3 = sum(bp, i, p3), b3 = sum(tr, i, p3);
    if (!b1 || !b2 || !b3) continue;
    out[i] = 100 * ((4 * (a1 / b1)) + (2 * (a2 / b2)) + (a3 / b3)) / 7;
  }
  return out;
}

// Pivot points (classic) from the previous completed bar — the levels traders
// watch. The forming bar is skipped: mid-bar it is not yet a real HLC, and its
// O=H=L=C early in a bucket would collapse every level onto the pivot.
export function pivotPoints(c) {
  const k = c.length >= 2 ? c[c.length - 2] : c[c.length - 1];
  if (!k) return null;
  const p = (k.high + k.low + k.close) / 3;
  const r1 = 2 * p - k.low;
  const s1 = 2 * p - k.high;
  const r2 = p + (k.high - k.low);
  const s2 = p - (k.high - k.low);
  return { p, r1, r2, s1, s2 };
}

// Volume profile: the price levels that traded the most, as a coarse histogram
// over the visible window. Buckets are (high − low) / bins wide.
export function volumeProfile(c, bins = 12) {
  if (!c.length) return { bins: [], poc: null };
  let hi = -Infinity, lo = Infinity;
  c.forEach(k => { hi = Math.max(hi, k.high); lo = Math.min(lo, k.low); });
  const width = ((hi - lo) || 1) / bins;
  const hist = new Array(bins).fill(0);
  c.forEach(k => {
    const v = k.volume ?? k.ticks ?? 1;
    const b = Math.min(bins - 1, Math.max(0, Math.floor((((k.high + k.low) / 2) - lo) / width)));
    hist[b] += v;
  });
  const max = Math.max(...hist);
  let pocIdx = 0;
  hist.forEach((v, i) => { if (v > hist[pocIdx]) pocIdx = i; });
  return {
    bins: hist.map((v, i) => ({ from: lo + i * width, to: lo + (i + 1) * width, volume: v, pct: max ? v / max : 0 })),
    poc: lo + (pocIdx + 0.5) * width,
    low: lo, high: hi, max,
  };
}

// ── convenience: the full snapshot used by the analytics panel ─────────────
// Returns the latest value of every indicator the terminal exposes. Missing
// inputs yield null rather than throwing, so a short tape still renders.
export function indicatorSnapshot(c, params = {}) {
  const cl = closes(c);
  const p = { rsi: 14, emaFast: 9, emaSlow: 21, sma: 20, bb: 20, bbMult: 2, atr: 14, adx: 14, ...params };
  return {
    price: cl[cl.length - 1] ?? null,
    sma: sma(cl, p.sma),
    emaFast: ema(cl, p.emaFast),
    emaSlow: ema(cl, p.emaSlow),
    rsi: rsi(cl, p.rsi),
    macd: macd(cl),
    bb: bollinger(cl, p.bb, p.bbMult),
    atr: atr(c, p.atr),
    adx: adx(c, p.adx),
    stoch: (() => { const s = stochSeries(c); const i = c.length - 1; return { k: s.k[i], d: s.d[i] }; })(),
    williamsR: williamsR(highs(c), lows(c), cl, 14),
    cci: cci(c, 20),
    roc: (() => { const s = rocSeries(cl, 12); return s[s.length - 1] ?? null; })(),
    momentum: (() => { const s = momentumSeries(cl, 10); return s[s.length - 1] ?? null; })(),
    aroon: aroon(c, 25),
    ichimoku: ichimoku(c),
    superTrend: (() => { const s = superTrendSeries(c); const i = c.length - 1; return { value: s.dir[i] === 1 ? s.dn[i] : s.up[i], dir: s.dir[i] }; })(),
    vwap: (() => { const s = vwapSeries(c, 20); return s[s.length - 1] ?? null; })(),
    obv: (() => { const s = obvSeries(c); return s[s.length - 1] ?? null; })(),
    mfi: (() => { const s = mfiSeries(c, 14); return s[s.length - 1] ?? null; })(),
    donchian: (() => { const s = donchianSeries(c, 20); const i = c.length - 1; return { upper: s.upper[i], lower: s.lower[i], mid: s.mid[i] }; })(),
    keltner: (() => { const s = keltnerSeries(c); const i = c.length - 1; return { mid: s.mid[i], upper: s.upper[i], lower: s.lower[i] }; })(),
    stochRsi: (() => { const s = stochRsiSeries(cl); return s[s.length - 1] ?? null; })(),
    dema: lastOf(demaSeries(cl, 20)),
    tema: lastOf(temaSeries(cl, 20)),
    hma: lastOf(hmaSeries(cl, 20)),
    trix: lastOf(trixSeries(cl, 15)),
    alligator: (() => { const s = alligatorSeries(c); const i = c.length - 1; return { jaw: s.jaw[i], teeth: s.teeth[i], lips: s.lips[i] }; })(),
    awesome: lastOf(awesomeSeries(c)),
    cmf: lastOf(cmfSeries(c, 20)),
    klinger: (() => { const s = klingerSeries(c); const i = c.length - 1; return { kvo: s.kvo[i], signal: s.signal[i] }; })(),
    fisher: lastOf(fisherSeries(c, 10)),
    vortex: (() => { const s = vortexSeries(c, 14); const i = c.length - 1; return { plus: s.plus[i], minus: s.minus[i] }; })(),
    dpo: lastOf(dpoSeries(c, 20)),
    eom: lastOf(eomSeries(c, 14)),
    forceIndex: lastOf(forceIndexSeries(c, 13)),
    ultimate: lastOf(ultimateSeries(c)),
    pivots: pivotPoints(c),
    volumeProfile: volumeProfile(c, 12),
  };
}

// ── sizing helper retained from the original engine ────────────────────────
export function calcKelly(pWin, payoutRatio = 0.8) {
  if (pWin <= 0 || pWin >= 1) return 0.5;
  const b = payoutRatio;
  const f = (pWin * b - (1 - pWin)) / b;
  return Math.max(0.05, Math.min(0.95, f || 0.5));
}
