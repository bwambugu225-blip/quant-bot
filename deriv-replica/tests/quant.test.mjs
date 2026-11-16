// Tests for the quantitative indicator family added alongside the classic TA
// set: Parabolic SAR, Williams %R ranges, and the rolling statistics that
// describe the character of a series rather than a direction.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  psarSeries, psar, williamsRRanges, zscoreSeries, zscore, efficiencyRatioSeries,
  efficiencyRatio, choppinessSeries, choppiness, hurstSeries, hurst,
  fractalDimensionSeries, fractalDimension, entropySeries, entropy,
  skewSeries, skew, kurtosisSeries, kurtosis, cusumSeries, cusum,
  kalmanSeries, kalman, indicatorSnapshot,
} from '../src/lib/indicators.js';
import { candles } from './helpers.mjs';

const C = candles(300, 5, 0.0002);
const CL = C.map(c => c.close);

test('psarSeries returns one value per bar and flips sides on a reversal', () => {
  const s = psarSeries(C);
  assert.equal(s.length, C.length);
  assert.ok(s.every(v => v == null || Number.isFinite(v)));
  // A strong up-then-down series must produce both long and short periods,
  // which shows up as the SAR sitting below then above price.
  const up = [];
  for (let i = 0; i < 60; i++) up.push({ open: i, high: i + 1.1, low: i - 0.1, close: i + 1 });
  const down = [];
  for (let i = 0; i < 60; i++) down.push({ open: 100 - i, high: 101 - i, low: 99 - i, close: 100 - i });
  const sar = psarSeries([...up, ...down]);
  const below = sar.slice(0, 55).some(v => v < up[0].close);
  const above = sar.slice(60).some(v => v > down[0].close);
  assert.ok(below, 'SAR sits below price in an uptrend');
  assert.ok(above, 'SAR sits above price in a downtrend');
  assert.ok(Number.isFinite(psar(C)));
});

test('williamsRRanges labels overbought, oversold and neutral zones', () => {
  // A series that closes at its high is overbought (-0 %R), at its low oversold.
  const strongUp = candles(60, 9, 0.004);
  const r = williamsRRanges(strongUp, 14);
  assert.equal(r.series.length, strongUp.length);
  assert.ok(['overbought', 'oversold', 'neutral'].includes(r.state));
  assert.equal(r.overbought, -20);
  assert.equal(r.oversold, -80);
  assert.ok(r.zone.every(z => z == null || ['overbought', 'oversold', 'neutral'].includes(z)));
});

test('zscore is zero for a flat series and signed for a stretched one', () => {
  const flat = new Array(30).fill(5);
  assert.equal(zscore(flat, 20), 0);
  const rising = Array.from({ length: 30 }, (_, i) => i);
  assert.ok(zscore(rising, 20) > 0);
  const z = zscoreSeries(rising, 20);
  assert.equal(z.length, 30);
  assert.equal(z[0], null);
});

test('efficiencyRatio is 1 on a straight line and low on noise', () => {
  // efficiencyRatio reads candles (closes), so build flat/trending candle runs.
  const line = Array.from({ length: 40 }, (_, i) => ({ open: i, high: i + 0.1, low: i - 0.1, close: i }));
  assert.ok(efficiencyRatio(line, 20) > 0.99);
  const zig = Array.from({ length: 40 }, (_, i) => ({ open: i % 2, high: 1.1, low: -0.1, close: i % 2 }));
  assert.ok(efficiencyRatio(zig, 20) < 0.1);
  assert.equal(efficiencyRatioSeries(line, 20)[10], null);
});

test('choppiness separates a range from a trend', () => {
  // A tight oscillating range has high choppiness; a clean trend has low.
  const ranging = [];
  for (let i = 0; i < 60; i++) {
    const p = 100 + (i % 2 ? 0.5 : -0.5);
    ranging.push({ open: p, high: p + 0.6, low: p - 0.6, close: p });
  }
  const trending = [];
  for (let i = 0; i < 60; i++) trending.push({ open: i, high: i + 1.5, low: i - 0.5, close: i + 1 });
  const chopRange = choppiness(ranging, 14);
  const chopTrend = choppiness(trending, 14);
  assert.ok(chopRange > chopTrend, `${chopRange} should exceed ${chopTrend}`);
  assert.equal(choppinessSeries(ranging, 14)[5], null);
});

test('hurst is near 0.5 for a random walk and higher for a trend', () => {
  const trend = Array.from({ length: 128 }, (_, i) => i + Math.sin(i) * 0.01);
  assert.ok(hurst(trend, 64) > 0.5);
  const s = hurstSeries(trend, 64);
  assert.equal(s.length, trend.length);
  assert.equal(s[10], null);
});

test('fractalDimension is near 1 for a straight line and larger for noise', () => {
  const line = Array.from({ length: 64 }, (_, i) => i);
  const noise = candles(64, 11, 0).map(c => c.close);
  const fdLine = fractalDimension(line, 32);
  const fdNoise = fractalDimension(noise, 32);
  assert.ok(fdLine < fdNoise, `${fdLine} should be below ${fdNoise}`);
  assert.ok(fdLine >= 1);
});

test('entropy is low for an ordered series and higher for noise', () => {
  const ordered = Array.from({ length: 80 }, (_, i) => i);
  const noisy = candles(80, 13, 0).map(c => c.close);
  assert.ok(entropy(ordered, 32) < entropy(noisy, 32));
  assert.equal(entropySeries(ordered, 32)[10], null);
});

test('skew and kurtosis are zero-ish for symmetric data and signed for tails', () => {
  const right = [1, 1, 1, 1, 1, 1, 1, 1, 1, 100];
  assert.ok(skew(right, 10) > 0);
  assert.ok(kurtosis(right, 10) > 0);
  const sym = [1, 2, 3, 4, 5, 4, 3, 2, 1, 2];
  assert.ok(Math.abs(skew(sym, 10)) < 1);
});

test('cusum accumulates standardised deviations and flags a shift', () => {
  const stable = new Array(40).fill(10);
  assert.equal(cusum(stable, 20), 0);
  const shifted = [...new Array(30).fill(10), ...new Array(20).fill(30)];
  assert.ok(cusum(shifted, 20) > 0);
  assert.equal(cusumSeries(stable, 20)[10], null);
});

test('kalman tracks a series and smooths noise', () => {
  const line = Array.from({ length: 50 }, (_, i) => i);
  const k = kalmanSeries(line);
  assert.equal(k.length, line.length);
  assert.ok(Math.abs(k[k.length - 1] - 49) < 5);
  const noisy = candles(120, 17, 0).map(c => c.close);
  const ks = kalmanSeries(noisy);
  const variance = arr => {
    const m = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length;
  };
  // The filtered path should be no more volatile than the raw closes.
  assert.ok(variance(ks.slice(5)) <= variance(noisy.slice(5)) + 1e-9);
});

test('the snapshot exposes every new indicator', () => {
  const s = indicatorSnapshot(C);
  for (const key of ['psar', 'williamsRanges', 'zscore', 'efficiencyRatio', 'choppiness',
    'hurst', 'fractalDimension', 'entropy', 'skew', 'kurtosis', 'cusum', 'kalman']) {
    assert.ok(key in s, `snapshot is missing ${key}`);
  }
  assert.ok(Number.isFinite(s.psar));
  assert.ok(['overbought', 'oversold', 'neutral'].includes(s.williamsRanges.state));
});
