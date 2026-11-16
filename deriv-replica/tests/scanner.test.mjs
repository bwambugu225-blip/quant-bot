import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanMarkets, scoreMarket } from '../src/lib/marketScanner.js';
import { makeEngine, loadTape, tick, tickTape } from './helpers.mjs';
import { defaultStrategy } from '../src/lib/strategyBuilder.js';

// A tape that trends steadily, so a trend-following rule fires on it.
function trendingTape(n = 400, seed = 5) {
  const { times, prices } = tickTape(n, seed);
  // Add a real drift on top of the random walk so a MA-cross rule has signal.
  const out = prices.map((p, i) => +(p * (1 + i * 0.0004)).toFixed(5));
  return { times, prices: out };
}

test('scoreMarket returns -Infinity below the minimum bar count', () => {
  const r = scoreMarket(defaultStrategy(), [{ epoch: 1, open: 1, high: 1, low: 1, close: 1 }]);
  assert.equal(r.score, -Infinity);
  assert.equal(r.backtest, null);
});

test('scanMarkets ranks every market and orders by score', () => {
  const s = {
    id: 'always', name: 'always', timeframe: '5s',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 1, durationUnit: 't' },
  };
  const barsFor = sym => {
    const { times, prices } = trendingTape(400, sym.length + 3);
    const out = [];
    for (let i = 0; i < times.length; i += 5) {
      out.push({ epoch: times[i], open: prices[i], high: prices[i], low: prices[i], close: prices[i], ticks: 5, volume: 5 });
    }
    return out;
  };
  const board = scanMarkets(s, ['R_10', 'R_25', 'R_50', 'R_75'], barsFor);
  assert.equal(board.length, 4);
  for (let i = 1; i < board.length; i++) assert.ok(board[i - 1].score >= board[i].score);
  board.forEach(m => assert.ok(Number.isFinite(m.score)));
  board.forEach(m => assert.ok(m.count > 0));
});

test('scanMarkets skips markets with too little history', () => {
  const s = {
    id: 'always', name: 'always', timeframe: '5s',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 1, durationUnit: 't' },
  };
  const bars = (n) => trendingTape(n, 2).prices.map((p, i) => ({ epoch: 1_700_000_000 + i * 5, open: p, high: p, low: p, close: p, ticks: 1, volume: 1 }));
  const barsFor = sym => (sym === 'R_10' ? bars(5) : bars(120));
  const board = scanMarkets(s, ['R_10', 'R_25'], barsFor);
  assert.ok(!board.some(m => m.sym === 'R_10'));
  assert.ok(board.some(m => m.sym === 'R_25'));
});

test('setAutoScan toggles the flag and clears the queue', () => {
  const { engine } = makeEngine();
  assert.equal(engine.autoScan, false);
  engine._pendingSignals.set('R_10', { sym: 'R_10' });
  engine.setAutoScan(true);
  assert.equal(engine.autoScan, true);
  assert.equal(engine._pendingSignals.size, 0);
  assert.equal(engine.snapshot().autoScan, true);
  engine.setAutoScan(false);
  assert.equal(engine.autoScan, false);
});

test('scanUniverse only includes markets with a warm tape', () => {
  const { engine } = makeEngine();
  loadTape(engine, 'R_10', tickTape(1000, 1));
  loadTape(engine, 'R_25', tickTape(20, 2));
  const uni = engine.scanUniverse();
  assert.ok(uni.includes('R_10'));
  assert.ok(!uni.includes('R_25'));
});

test('auto-scan trades the market whose rule fires, not the selected one', () => {
  const { engine, client } = makeEngine();
  client.autoRespond = true;
  // A rule that fires on every closed candle, so every warm market qualifies.
  engine.setStrategy({
    id: 'always', name: 'always', timeframe: '5s',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  });
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(300, 3));
  loadTape(engine, 'R_50', tickTape(300, 4));
  engine.start();
  engine.setAutoScan(true);
  // Push ticks on both markets across a 5s boundary so a candle closes on each.
  let t = 1_700_010_000;
  for (let i = 0; i < 12; i++) {
    tick(engine, 'R_100', 1000 + i, t + i);
    tick(engine, 'R_50', 1000 + i, t + i);
  }
  // The entry lands on one of the scanned markets (not necessarily R_100).
  const prop = client.sent.find(m => m.proposal);
  assert.ok(prop, 'expected an auto-scan proposal');
  assert.ok(['R_100', 'R_50'].includes(prop.underlying_symbol));
});

test('auto-scan picks the highest-scoring market when several fire', () => {
  const { engine, client } = makeEngine();
  client.autoRespond = true;
  engine.setStrategy({
    id: 'always', name: 'always', timeframe: '5s',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  });
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(300, 3));
  loadTape(engine, 'R_50', tickTape(300, 4));
  engine.start();
  engine.setAutoScan(true);
  // Force a known ranking so the pick is deterministic.
  engine._scanScore = new Map([['R_100', 5], ['R_50', 50]]);
  engine.scanBoard = [
    { sym: 'R_50', score: 50, count: 3, winRate: 0.6 },
    { sym: 'R_100', score: 5, count: 3, winRate: 0.4 },
  ];
  let t = 1_700_020_000;
  for (let i = 0; i < 12; i++) {
    tick(engine, 'R_100', 1000 + i, t + i);
    tick(engine, 'R_50', 1000 + i, t + i);
  }
  const prop = client.sent.find(m => m.proposal);
  assert.ok(prop);
  assert.equal(prop.underlying_symbol, 'R_50');   // the higher-scoring market
  assert.equal(engine.snapshot().autoMarket, 'R_50');
});

test('auto-scan does not fire when nothing clears the rule', () => {
  const { engine, client } = makeEngine();
  client.autoRespond = true;
  engine.setStrategy({
    id: 'never', name: 'never', timeframe: '5s',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'lt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  });
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(300, 3));
  engine.start();
  engine.setAutoScan(true);
  let t = 1_700_030_000;
  for (let i = 0; i < 20; i++) tick(engine, 'R_100', 1000 + i, t + i);
  assert.equal(client.sent.filter(m => m.proposal).length, 0);
});

test('auto-scan off keeps trading only the selected market', () => {
  const { engine, client } = makeEngine();
  client.autoRespond = true;
  engine.setStrategy({
    id: 'always', name: 'always', timeframe: '5s',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  });
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(300, 3));
  loadTape(engine, 'R_50', tickTape(300, 4));
  engine.start();
  // autoScan stays off. Ticks only on R_50 must not trade (R_50 is not selected).
  let t = 1_700_040_000;
  for (let i = 0; i < 20; i++) tick(engine, 'R_50', 1000 + i, t + i);
  assert.equal(client.sent.filter(m => m.proposal).length, 0);
});
