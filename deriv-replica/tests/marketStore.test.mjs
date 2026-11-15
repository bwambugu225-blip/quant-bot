import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MarketStore, bucketTicks, TIMEFRAMES, TF_SEC, IMPORT_TICKS } from '../src/lib/marketStore.js';
import { digitOf, pipSize } from '../src/lib/symbols.js';
import { tickTape } from './helpers.mjs';

test('the timeframe ladder covers 5s..30s and 1m..15m', () => {
  const ids = TIMEFRAMES.map(t => t.id);
  for (const want of ['5s', '10s', '15s', '30s', '1m', '2m', '3m', '5m', '10m', '15m']) {
    assert.ok(ids.includes(want), `missing timeframe ${want}`);
  }
  assert.equal(ids.length, 19);
  assert.equal(TF_SEC['15m'], 900);
  assert.equal(TF_SEC['5s'], 5);
});

test('bucketTicks aggregates ticks into time-based candles', () => {
  // 10 ticks at t=0..9 seconds → 5s candles [0-4] and [5-9].
  const times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const prices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const c5 = bucketTicks(times, prices, 5);
  assert.equal(c5.length, 2);
  assert.deepEqual([c5[0].open, c5[0].high, c5[0].low, c5[0].close], [1, 5, 1, 5]);
  assert.deepEqual([c5[1].open, c5[1].high, c5[1].low, c5[1].close], [6, 10, 6, 10]);
  // A 15s bucket holds all ten.
  const c15 = bucketTicks(times, prices, 15);
  assert.equal(c15.length, 1);
  assert.equal(c15[0].ticks, 10);
});

test('imports 1000 ticks and builds candles for every timeframe', () => {
  const store = new MarketStore();
  const tape = tickTape(1000, 1);
  store.onHistory('R_100', tape.times, tape.prices);
  assert.equal(store.tickCount('R_100'), 1000);
  assert.equal(IMPORT_TICKS, 1000);
  for (const t of TIMEFRAMES) {
    const c = store.candles('R_100', t.id);
    assert.ok(c.length > 0, `no candles for ${t.id}`);
    // Every candle must be internally consistent.
    for (const k of c) {
      assert.ok(k.high >= k.low, 'high < low');
      assert.ok(k.high >= k.open && k.high >= k.close, 'high not the max');
      assert.ok(k.low <= k.open && k.low <= k.close, 'low not the min');
    }
  }
  // 1000 ticks at 1/s = 1000s; 5s → 200 candles, 15m → 2 candles.
  assert.equal(store.candles('R_100', '5s').length, 200);
  assert.equal(store.candles('R_100', '15m').length, 2);
});

test('live ticks extend the current candle and open a new one on the boundary', () => {
  const store = new MarketStore();
  store.onHistory('R_100', [0, 1, 2, 3, 4], [10, 11, 12, 13, 14]);
  assert.equal(store.candles('R_100', '5s').length, 1);
  // Same 5s bucket → update in place.
  store.onTick('R_100', 15, 4);
  let c = store.candles('R_100', '5s');
  assert.equal(c.length, 1);
  assert.equal(c[0].close, 15);
  assert.equal(c[0].high, 15);
  // Next bucket → new candle.
  store.onTick('R_100', 16, 5);
  c = store.candles('R_100', '5s');
  assert.equal(c.length, 2);
  assert.equal(c[1].open, 16);
});

test('digit extraction uses the symbol pip size', () => {
  // 1296.20 arrives as 1296.2 from the API; at pip 2 the last digit is 0.
  assert.equal(digitOf(1296.2, 'R_100'), 0);
  assert.equal(pipSize('R_100'), 2);
  // R_50 is pip 4: 1234.567 → "1234.5670" → last digit 0.
  assert.equal(pipSize('R_50'), 4);
  assert.equal(digitOf(1234.567, 'R_50'), 0);
  assert.equal(digitOf(1234.5671, 'R_50'), 1);
});

test('digit history is derived from the imported tape', () => {
  const store = new MarketStore();
  store.onHistory('R_100', [0, 1, 2], [100.12, 100.23, 100.34]);
  const d = store.digits('R_100');
  assert.equal(d.length, 3);
  assert.deepEqual(d, [2, 3, 4]);
  assert.equal(store.lastDigit('R_100'), 4);
});

test('openPrice is the first imported price, the reference for a session change', () => {
  const store = new MarketStore();
  assert.equal(store.openPrice('R_100'), null);
  store.onHistory('R_100', [0, 1, 2], [100.1, 101.2, 102.3]);
  assert.equal(store.openPrice('R_100'), 100.1);
  assert.equal(store.lastPrice('R_100'), 102.3);
});

test('candles() returns a fresh reference so React re-renders a live chart', () => {
  const store = new MarketStore();
  store.onHistory('R_100', [0, 1, 2], [100.1, 101.2, 102.3]);
  const a = store.candles('R_100', '5s');
  const b = store.candles('R_100', '5s');
  assert.notEqual(a, b, 'each call returns a new array');
  assert.deepEqual(a, b, 'with the same contents');

  // The in-progress candle is cloned, so mutating it in place on the next tick
  // cannot retroactively change an array a component already rendered.
  const held = store.candles('R_100', '5s');
  const heldLast = held[held.length - 1];
  const heldClose = heldLast.close;
  store.onTick('R_100', 105, 2);
  assert.equal(heldLast.close, heldClose, 'the held snapshot is not mutated in place');
  assert.notEqual(heldLast.close, 105, 'the held last candle keeps its old close');
  const fresh = store.candles('R_100', '5s');
  assert.equal(fresh[fresh.length - 1].close, 105, 'the fresh read carries the new close');
});

test('a live tick folds into the forming candle and opens a new one on the boundary', () => {
  const store = new MarketStore();
  store.onHistory('R_100', [0, 1, 2], [100, 101, 102]);
  const before = store.candles('R_100', '5s').length;
  // Same 5s bucket (epoch 0..4): extends the last candle.
  store.onTick('R_100', 104, 3);
  let arr = store.candles('R_100', '5s');
  assert.equal(arr.length, before, 'no new candle inside the bucket');
  assert.equal(arr[arr.length - 1].close, 104);
  assert.equal(arr[arr.length - 1].high, 104);
  // Next bucket (epoch 5): a new candle opens.
  store.onTick('R_100', 103, 5);
  arr = store.candles('R_100', '5s');
  assert.equal(arr.length, before + 1, 'a new candle opened on the boundary');
  assert.equal(arr[arr.length - 1].open, 103);
});
