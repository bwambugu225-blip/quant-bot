// Strategy engine ported from the original bot.html.
//
// The live engine runs a single confluent reversal strategy (Bollinger
// exhaustion + confirmed rejection). The larger ensemble/brain code in the
// original is retained there but not wired into runStrategyAnalysis, so it is
// intentionally not reproduced here.
import { sma, stddev, rsi, max, min } from './indicators.js';

export const STRATEGIES = [
  {
    name: 'Bollinger Reversal',
    code: 'REV_BB',
    analyze: (c) => {
      const n = c.length;
      if (n < 25) return null;
      const k = c[n - 1];
      const closes = c.map(x => x.close);
      const last = closes[n - 1];
      const prev = closes[n - 2];
      const per = 20;
      const m = sma(closes, per);
      if (m === null) return null;
      const sd = stddev(closes, per);
      if (sd === null || sd < 1e-9) return null;
      const bbU = m + 2 * sd;
      const bbL = m - 2 * sd;
      const width = (bbU - bbL) / (m || 1e-9);
      if (width < 0.0006) return null;
      const r = rsi(closes, 14) || 50;
      const sdN = sd || 1e-9;
      const bodyR = kr => Math.abs(kr.close - kr.open) / ((kr.high - kr.low) || 1e-9);

      if (prev <= bbL && last > prev && last > k.open && last > bbL && r < 38 && bodyR(k) > 0.5) {
        const depth = (bbL - prev) / sdN;
        const dur = Math.max(3, Math.min(12, Math.round(4 + depth * 3)));
        const conf = Math.round(80 + Math.min(15, depth * 6 + bodyR(k) * 5));
        return { action: 'RISE', conf, src: 'REV_BB', dur, durUnit: 't' };
      }
      if (prev >= bbU && last < prev && last < k.open && last < bbU && r > 62 && bodyR(k) > 0.5) {
        const depth = (prev - bbU) / sdN;
        const dur = Math.max(3, Math.min(12, Math.round(4 + depth * 3)));
        const conf = Math.round(80 + Math.min(15, depth * 6 + bodyR(k) * 5));
        return { action: 'FALL', conf, src: 'REV_BB', dur, durUnit: 't' };
      }
      return null;
    },
  },
];

export function runStrategyAnalysis(candles) {
  const c = candles;
  if (!c || c.length < 30) return null;
  let v = null;
  for (const st of STRATEGIES) {
    try {
      const r = st.analyze(c);
      if (r) { v = r; break; }
    } catch (e) { /* ignore a strategy's own error */ }
  }
  if (v) {
    const conf = Math.min(95, Math.max(70, Math.round(v.conf)));
    return { action: v.action, conf, src: v.src, dur: v.dur, durUnit: v.durUnit };
  }
  return null;
}

// Auto-pick a trade duration from signal source/strength/volatility. Ported
// from bot.html pickOptimalDuration.
export function pickOptimalDuration(src, conf, sym, candles) {
  const map = {
    ICT_OB: [3, 6], FVG: [2, 5], BB_BOUNCE: [5, 8], MSB: [4, 7],
    SUPERTREND: [6, 10], S_D_FLIP: [3, 6], RSI_DIV: [3, 6],
    KELTNER_SQZ: [4, 7], MOMENTUM: [2, 5], ADX_TREND: [7, 10], REV_BB: [1, 3],
  };
  const [lo, hi] = map[src] || [3, 6];
  const cw = Math.max(0, Math.min(1, (conf - 80) / 16));
  let ticks = Math.round(hi - (hi - lo) * cw);
  if (candles && candles.length >= 6) {
    const slice = candles.slice(-6);
    const avgR = slice.reduce((s, c) => s + (c.high - c.low), 0) / slice.length || 1;
    const lastR = slice[slice.length - 1].high - slice[slice.length - 1].low;
    const vol = lastR / (avgR * 2 || 1);
    if (vol > 0.8) ticks = Math.max(lo, ticks - 1);
    if (vol < 0.3) ticks = Math.min(hi, ticks + 1);
  }
  if ((src === 'SUPERTREND' || src === 'ADX_TREND') && conf >= 90 && ticks >= 6 && !(sym && sym.startsWith('1HZ'))) {
    const sec = Math.round(20 + (ticks - 6) * 10);
    return { dur: Math.min(60, sec), unit: 's' };
  }
  return { dur: Math.max(1, Math.min(10, ticks)), unit: 't' };
}

// Digit probability priors (from bot.html initStrategies) — used for the
// per-market digit distribution reference shown in the digits panel.
export const DIGIT_PROBS = {
  R_10: { dc: [125, 121, 155, 118, 127, 133, 146, 143, 123, 145] },
  R_25: { dc: [136, 120, 134, 132, 139, 128, 123, 132, 157, 135] },
  R_50: { dc: [146, 121, 163, 141, 132, 136, 137, 134, 108, 118] },
  R_75: { dc: [118, 143, 128, 131, 132, 122, 142, 153, 137, 130] },
  R_100: { dc: [122, 138, 135, 130, 122, 120, 145, 146, 142, 136] },
  '1HZ10V': { dc: [59, 80, 75, 53, 79, 56, 72, 50, 75, 70] },
  '1HZ25V': { dc: [61, 55, 63, 44, 72, 80, 86, 76, 67, 65] },
  '1HZ50V': { dc: [61, 60, 76, 77, 73, 76, 51, 68, 61, 66] },
  '1HZ75V': { dc: [66, 76, 53, 68, 58, 55, 75, 76, 73, 69] },
  '1HZ100V': { dc: [77, 60, 76, 62, 62, 65, 74, 61, 69, 63] },
};

// Digit strategies: rolling-window empirical bias (over/under/match). Ported
// from bot.html evaluateDigitStrategy — returns the best candidate or null.
export function evaluateDigitStrategy(hist) {
  const buf = hist.slice(-1000);
  const len = buf.length;
  if (len < 50) return null;
  const W = Math.min(len, 120);
  const win = buf.slice(-W);
  const n = win.length;

  const freq = Array(10).fill(0);
  for (const d of win) freq[d]++;
  let md = 0, mf = 0;
  for (let d = 0; d < 10; d++) { if (freq[d] > mf) { mf = freq[d]; md = d; } }

  const cands = [
    { dir: 'DIGITOVER', barrier: 2, baseline: 0.70 },
    { dir: 'DIGITOVER', barrier: 3, baseline: 0.60 },
    { dir: 'DIGITOVER', barrier: 4, baseline: 0.50 },
    { dir: 'DIGITUNDER', barrier: 5, baseline: 0.50 },
    { dir: 'DIGITUNDER', barrier: 6, baseline: 0.60 },
    { dir: 'DIGITUNDER', barrier: 7, baseline: 0.70 },
    { dir: 'DIGITMATCH', barrier: md, baseline: 0.10 },
  ];

  let best = null;
  for (const c of cands) {
    let w = 0;
    for (const d of win) {
      if (c.dir === 'DIGITOVER' && d > c.barrier) w++;
      else if (c.dir === 'DIGITUNDER' && d < c.barrier) w++;
      else if (c.dir === 'DIGITMATCH' && d === c.barrier) w++;
    }
    const p = w / n;
    const edge = p - c.baseline;
    if (w < Math.ceil(n * (c.baseline + 0.04))) continue;
    if (edge < 0.045) continue;
    if (!best || edge > best.edge) best = { dir: c.dir, barrier: c.barrier, p, edge };
  }
  return best;
}

export function digitRollingStats(hist) {
  const buf = hist.slice(-1000);
  const len = buf.length || 1;
  return {
    o2: buf.filter(d => d > 2).length / len,
    o3: buf.filter(d => d > 3).length / len,
    u6: buf.filter(d => d < 6).length / len,
    u7: buf.filter(d => d < 7).length / len,
    n: buf.length,
  };
}
