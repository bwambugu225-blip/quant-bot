// Calculated volume — the move-weighted activity model in `volume.js`.
//
// Deriv publishes no traded volume, so the reading is derived from the tape:
// a tick that moves the price counts for more than one that repeats it, and a
// move that is large *for this symbol* counts for more than an ordinary tick.
// These tests pin the properties that make the number meaningful rather than
// merely present.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tickMoves, moveUnit, tickVolume, tickVolumes, volumeActivity } from '../src/lib/volume.js';
import { tickSeconds, pipSize } from '../src/lib/symbols.js';
import { MarketStore, bucketTicks, bucketTicksByCount, TICK_BAR_SIZES } from '../src/lib/marketStore.js';

// ── cadence ────────────────────────────────────────────────────────────────
test('tick cadence reads the 1s and 2s families from the catalogue', () => {
  // The classic volatility and bull/bear indices tick every two seconds.
  for (const sym of ['R_10', 'R_25', 'R_50', 'R_75', 'R_100', 'RDBULL', 'RDBEAR']) {
    assert.equal(tickSeconds(sym), 2, `${sym} should be 2s`);
  }
  // The 1HZ family, the Step index and every Jump index tick every second —
  // verified against the live feed, which shows 100% one-second gaps for them.
  for (const sym of ['1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V', 'stpRNG', 'JD10', 'JD25', 'JD50', 'JD75', 'JD100']) {
    assert.equal(tickSeconds(sym), 1, `${sym} should be 1s`);
  }
  // A streaming pair has no fixed cadence; it falls back to 1.
  assert.equal(tickSeconds('frxEURUSD'), 1);
});

// ── moves and the symbol scale ─────────────────────────────────────────────
test('tickMoves is the absolute change between consecutive ticks', () => {
  assert.deepEqual(tickMoves([10, 12, 11, 11, 15]), [2, 1, 0, 4]);
  assert.deepEqual(tickMoves([5]), []);
  assert.deepEqual(tickMoves([]), []);
});

test('moveUnit is the median of the non-zero moves, so one jump does not set the scale', () => {
  // Nine ordinary one-pip moves and one fifty-pip jump: the median stays at the
  // ordinary move, which is the point — the jump is the outlier, not the norm.
  const moves = [0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.05];
  const unit = moveUnit(moves, 'R_10');
  assert.equal(unit, 0.001);
});

test('moveUnit falls back to one pip step on a flat or empty tape', () => {
  const step = Math.pow(10, -pipSize('R_10'));
  assert.equal(moveUnit([], 'R_10'), step);
  assert.equal(moveUnit([0, 0, 0], 'R_10'), step);
});

// ── the weight ─────────────────────────────────────────────────────────────
test('volume rises with the move size', () => {
  const unit = 1;
  const small = tickVolume(0.5, 1, unit, 1);
  const big = tickVolume(2, 1, unit, 1);
  assert.ok(big > small, 'a larger move must weigh more');
});

test('the move weight is concave — quadrupling the move doubles the weight', () => {
  const unit = 1;
  const base = tickVolume(1, 1, unit, 1);
  const quad = tickVolume(4, 1, unit, 1);
  assert.ok(Math.abs(quad - 2 * base) < 1e-9, `expected ${2 * base}, got ${quad}`);
});

test('a move twice the typical size outweighs an ordinary tick but not by 2x', () => {
  const unit = 1;
  const ordinary = tickVolume(unit, 1, unit, 1);
  const doubled = tickVolume(2 * unit, 1, unit, 1);
  assert.ok(doubled > ordinary);
  assert.ok(doubled < 2 * ordinary);
});

test('a flat tick carries no move weight', () => {
  assert.equal(tickVolume(0, 1, 1, 1), 0);
});

test('a tick that took longer to arrive counts proportionally more', () => {
  const unit = 1;
  const onTime = tickVolume(1, 2, unit, 2);   // arrived on a 2s cadence
  const late = tickVolume(1, 6, unit, 2);     // six seconds of tape in one tick
  assert.ok(Math.abs(late - 3 * onTime) < 1e-9, `expected ${3 * onTime}, got ${late}`);
});

test('a tick faster than the cadence still counts as a full tick', () => {
  const unit = 1;
  assert.equal(tickVolume(1, 0.1, unit, 2), tickVolume(1, 2, unit, 2));
});

// ── cross-symbol normalisation ─────────────────────────────────────────────
test('the same relative move gives the same volume on different-priced symbols', () => {
  // R_100 is quoted ~600 with 2dp; R_75 ~40,000 with 4dp. A tick that moves each
  // by its own typical amount must read the same, or the numbers are not
  // comparable across markets.
  const r100 = { step: Math.pow(10, -pipSize('R_100')), typical: 11 * Math.pow(10, -pipSize('R_100')) };
  const r75 = { step: Math.pow(10, -pipSize('R_75')), typical: 51440 * Math.pow(10, -pipSize('R_75')) };
  const a = tickVolume(r100.typical, 2, r100.typical, 2);
  const b = tickVolume(r75.typical, 2, r75.typical, 2);
  assert.ok(Math.abs(a - b) < 1e-9, `expected equal volume, got ${a} vs ${b}`);
});

// ── the tape helper ────────────────────────────────────────────────────────
test('tickVolumes aligns to the tape and starts at zero', () => {
  const prices = [100, 101, 101, 103, 102];
  const times = [0, 1, 2, 3, 4];
  const v = tickVolumes(prices, times, 'R_100');
  assert.equal(v.length, prices.length);
  assert.equal(v[0], 0, 'the first tick has no predecessor');
  assert.ok(v[3] > v[2], 'the bigger move (0 → 2) outweighs the flat tick');
  v.slice(1).forEach(x => assert.ok(x >= 0 && Number.isFinite(x)));
});

// ── the recent-activity read ───────────────────────────────────────────────
test('volumeActivity is the mean per-tick volume of the recent window', () => {
  const times = Array.from({ length: 200 }, (_, i) => 1_700_000_000 + i);
  const prices = times.map((_, i) => 1000 + i * 0.5);
  const a = volumeActivity(prices, times, 'R_100', 50);
  assert.ok(a > 0 && Number.isFinite(a));
});

test('volumeActivity rises when the tape starts moving more per tick', () => {
  const times = Array.from({ length: 120 }, (_, i) => 1_700_000_000 + i);
  // Quiet first 60 ticks (tiny moves), energetic last 60 (large moves).
  const prices = times.map((_, i) => 1000 + (i < 60 ? i * 0.001 : 0.06 + (i - 60) * 0.2));
  // The same tape read at two cut points: the last window of the quiet stretch,
  // then the last window of the busy one.
  const quiet = volumeActivity(prices.slice(0, 55), times.slice(0, 55), 'R_100', 50);
  const busy = volumeActivity(prices, times, 'R_100', 50);
  assert.ok(busy > quiet, `busy ${busy} should exceed quiet ${quiet}`);
});

test('volumeActivity is null until the window has warmed up', () => {
  const prices = Array.from({ length: 20 }, (_, i) => 100 + i);
  const times = prices.map((_, i) => 1_700_000_000 + i);
  assert.equal(volumeActivity(prices, times, 'R_100', 50), null);
  assert.equal(volumeActivity([], [], 'R_100', 50), null);
});

// ── integration with the store ─────────────────────────────────────────────
test('bucketTicks sums calculated volume, not tick counts', () => {
  // Two candles: the first from tiny moves, the second from a large one. Equal
  // tick counts, different volume — the whole point of the model.
  const times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const prices = [100, 100.01, 100.02, 100.01, 100.02, 100.03, 100.04, 100.05, 100.5, 100.06];
  const c = bucketTicks(times, prices, 5, 'R_100');
  assert.equal(c.length, 2);
  assert.equal(c[0].ticks, 5);
  assert.equal(c[1].ticks, 5);
  assert.ok(c[1].volume > c[0].volume, 'the candle with the jump must carry more volume');
});

test('a candle carries both a tick count and a volume, and they differ', () => {
  const times = [0, 1, 2, 3, 4];
  const prices = [100, 101, 102, 103, 104];
  const c = bucketTicks(times, prices, 60, 'R_100');
  assert.equal(c.length, 1);
  assert.equal(c[0].ticks, 5);
  assert.notEqual(c[0].volume, c[0].ticks);
});

test('the store folds calculated volume into every timeframe and the tick bars', () => {
  const store = new MarketStore();
  const times = Array.from({ length: 400 }, (_, i) => 1_700_000_000 + i * 2);
  // A rising tape with one deliberately outsized jump.
  const prices = times.map((_, i) => 1000 + i * 0.01 + (i === 200 ? 5 : 0));
  store.onHistory('R_75', times, prices);

  const c5 = store.candles('R_75', '5s');
  assert.ok(c5.length > 0);
  c5.forEach(k => {
    assert.ok(k.volume > 0, 'every candle has positive volume');
    assert.ok(Number.isFinite(k.volume));
  });
  // Volume is not merely the tick count: on a tape with any variation the two
  // series differ (they can coincide on a perfectly regular tape).
  assert.ok(c5.some(k => Math.abs(k.volume - k.ticks) > 1e-9), 'volume tracks moves, not counts');

  // The candle containing the jump must outweigh its neighbours.
  const jumpEpoch = Math.floor(times[200] / 5) * 5;
  const jump = c5.find(k => k.epoch === jumpEpoch);
  const before = c5[c5.findIndex(k => k.epoch === jumpEpoch) - 1];
  assert.ok(jump.volume > before.volume, 'the jump candle carries the most volume');

  const bars = store.tickBars('R_75', 50);
  assert.ok(bars.length > 0);
  bars.forEach(b => assert.ok(b.volume > 0 && Number.isFinite(b.volume)));

  // The scale is exposed and positive.
  assert.ok(store.moveUnit('R_75') > 0);
});

test('live ticks extend a candle and accumulate its volume', () => {
  const store = new MarketStore();
  const times = Array.from({ length: 100 }, (_, i) => 1_700_000_000 + i * 2);
  const prices = times.map((_, i) => 1000 + i * 0.01);
  store.onHistory('R_75', times, prices);
  const before = store.candles('R_75', '5s');
  const lastBefore = before[before.length - 1];

  // A live tick inside the same 5s bucket adds volume but not a tick count of 1.
  const t = times[times.length - 1] + 1;
  store.onTick('R_75', prices[prices.length - 1] + 0.5, t);
  const after = store.candles('R_75', '5s');
  const lastAfter = after[after.length - 1];
  if (lastAfter.epoch === lastBefore.epoch) {
    assert.equal(lastAfter.ticks, lastBefore.ticks + 1);
    assert.ok(lastAfter.volume > lastBefore.volume);
  } else {
    assert.equal(lastAfter.ticks, 1);
    assert.ok(lastAfter.volume > 0);
  }
});

test('every tick-bar size carries volume through bucketTicksByCount', () => {
  const times = Array.from({ length: 500 }, (_, i) => 1_700_000_000 + i);
  const prices = Array.from({ length: 500 }, (_, i) => 100 + Math.sin(i / 7) * 0.3);
  for (const size of TICK_BAR_SIZES) {
    const bars = bucketTicksByCount(times, prices, size, '1HZ100V');
    bars.forEach(b => assert.ok(b.volume > 0 && Number.isFinite(b.volume)));
  }
});

test('a flat tape still yields finite, non-negative volume everywhere', () => {
  const times = Array.from({ length: 50 }, (_, i) => 1_700_000_000 + i);
  const prices = new Array(50).fill(1000);
  const c = bucketTicks(times, prices, 5, 'R_100');
  c.forEach(k => {
    assert.ok(Number.isFinite(k.volume));
    assert.ok(k.volume >= 0);
  });
});
