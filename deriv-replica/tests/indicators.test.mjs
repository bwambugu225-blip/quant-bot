import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sma, smaSeries, ema, emaSeries, wmaSeries, rsi, rsiSeries, atr, atrSeries,
  bollinger, bollingerSeries, macd, macdSeries, stoch, stochSeries, adx, adxSeries,
  aroon, cci, williamsR, rocSeries, momentumSeries, obvSeries, mfiSeries, vwapSeries,
  ichimoku, superTrendSeries, keltnerSeries, donchianSeries, stochRsiSeries,
  indicatorSnapshot, calcKelly, heikenAshi, isPinbar, isStrong,
} from '../src/lib/indicators.js';
import { candles } from './helpers.mjs';

const C = candles(200, 3, 0.0004);
const CL = C.map(c => c.close);

test('sma matches the arithmetic mean of the last p values', () => {
  const arr = [1, 2, 3, 4, 5];
  assert.equal(sma(arr, 5), 3);
  assert.equal(sma(arr, 3), 4);
  const s = smaSeries(arr, 3);
  assert.deepEqual(s.slice(0, 2), [null, null]);
  assert.equal(s[2], 2);
  assert.equal(s[4], 4);
});

test('ema is a proper exponential average', () => {
  const arr = [1, 2, 3, 4, 5, 6];
  const s = emaSeries(arr, 3);
  assert.equal(s[2], 2);                     // seed = mean of first 3
  const k = 2 / 4;
  assert.ok(Math.abs(s[3] - (4 * k + 2 * (1 - k))) < 1e-9);
});

test('wma weights recent values more', () => {
  const s = wmaSeries([1, 2, 3], 3);
  assert.equal(s[2], (3 * 3 + 2 * 2 + 1 * 1) / 6);
});

test('rsi is 100 on a monotonic rise and 0 on a monotonic fall', () => {
  const up = Array.from({ length: 30 }, (_, i) => 100 + i);
  const dn = Array.from({ length: 30 }, (_, i) => 100 - i);
  assert.equal(rsi(up, 14), 100);
  assert.equal(rsi(dn, 14), 0);
});

test('atr is positive on a real tape', () => {
  const a = atr(C, 14);
  assert.ok(a > 0);
  const s = atrSeries(C, 14);
  assert.equal(s[s.length - 1], a);
});

test('bollinger bands straddle the mean', () => {
  const b = bollinger(CL, 20, 2);
  assert.ok(b.upper > b.mid);
  assert.ok(b.lower < b.mid);
  assert.ok(Math.abs((b.upper + b.lower) / 2 - b.mid) < 1e-6);
});

test('macd returns aligned macd/signal/hist', () => {
  const m = macd(CL);
  assert.ok(Number.isFinite(m.macd));
  assert.ok(Number.isFinite(m.signal));
  assert.ok(Math.abs(m.hist - (m.macd - m.signal)) < 1e-9);
});

test('stochastic is within 0..100', () => {
  const s = stoch(C.map(c => c.high), C.map(c => c.low), CL, 14);
  assert.ok(s >= 0 && s <= 100);
});

test('adx reports a direction and a strength', () => {
  const a = adx(C, 14);
  assert.ok(a && (a.trend === 'UP' || a.trend === 'DN'));
  assert.ok(a.strength >= 0);
});

test('aroon, cci, williams, roc, momentum, obv, mfi, vwap produce finite values', () => {
  const ar = aroon(C, 25);
  assert.ok(ar.up >= 0 && ar.up <= 100);
  assert.ok(Number.isFinite(cci(C, 20)));
  const wr = williamsR(C.map(c => c.high), C.map(c => c.low), CL, 14);
  assert.ok(wr >= -100 && wr <= 0);
  const r = rocSeries(CL, 12);
  assert.ok(Number.isFinite(r[r.length - 1]));
  const m = momentumSeries(CL, 10);
  assert.ok(Number.isFinite(m[m.length - 1]));
  const o = obvSeries(C);
  assert.ok(Number.isFinite(o[o.length - 1]));
  const mf = mfiSeries(C, 14);
  assert.ok(Number.isFinite(mf[mf.length - 1]));
  const vw = vwapSeries(C, 20);
  assert.ok(Number.isFinite(vw[vw.length - 1]));
});

test('ichimoku, supertrend, keltner, donchian, stoch-rsi are computable', () => {
  const ic = ichimoku(C);
  assert.ok(Number.isFinite(ic.tenkan));
  const st = superTrendSeries(C, 10, 3);
  assert.ok(st.dir[st.dir.length - 1] === 1 || st.dir[st.dir.length - 1] === -1);
  const kc = keltnerSeries(C, 20, 1.5);
  assert.ok(kc.upper[kc.upper.length - 1] > kc.lower[kc.lower.length - 1]);
  const dc = donchianSeries(C, 20);
  assert.ok(dc.upper[dc.upper.length - 1] >= dc.lower[dc.lower.length - 1]);
  const sr = stochRsiSeries(CL);
  assert.ok(sr.length === CL.length);
});

test('heiken ashi, pinbar and strong-candle helpers work', () => {
  const ha = heikenAshi(C);
  assert.equal(ha.length, C.length);
  // Long lower wick, small body → bullish pinbar.
  assert.equal(isPinbar({ open: 100.1, close: 100, high: 100.2, low: 99 }), 'bull');
  // Long upper wick, small body → bearish pinbar.
  assert.equal(isPinbar({ open: 100, close: 100.1, high: 101, low: 99.9 }), 'bear');
  assert.equal(isStrong({ open: 100, close: 101, high: 101.1, low: 99.9 }), true);
});

test('the indicator snapshot exposes 20+ named readings', () => {
  const snap = indicatorSnapshot(C);
  const keys = Object.keys(snap);
  assert.ok(keys.length >= 20, `snapshot has ${keys.length} readings`);
  for (const k of ['rsi', 'macd', 'bb', 'atr', 'adx', 'stoch', 'williamsR', 'cci', 'aroon', 'ichimoku', 'superTrend', 'vwap', 'obv', 'mfi', 'donchian', 'keltner', 'stochRsi']) {
    assert.ok(k in snap, `snapshot missing ${k}`);
  }
});

test('kelly fraction is bounded', () => {
  assert.ok(calcKelly(0.9) > 0 && calcKelly(0.9) <= 0.95);
  assert.equal(calcKelly(0.5), 0.05);   // negative edge clamps to the floor
});
