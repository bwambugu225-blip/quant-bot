import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runBacktest, holdCandles } from '../src/lib/backtest.js';
import { defaultStrategy } from '../src/lib/strategyBuilder.js';
import { candles, lcg } from './helpers.mjs';

test('holdCandles converts duration units into candles of the timeframe', () => {
  assert.equal(holdCandles('1m', 5, 't'), 5);       // ticks → candles
  assert.equal(holdCandles('1m', 120, 's'), 2);     // 120s = 2 x 1m
  assert.equal(holdCandles('5s', 60, 's'), 12);     // 60s / 5s
  assert.equal(holdCandles('15m', 1, 'h'), 4);      // 1h / 15m
  assert.equal(holdCandles('1m', 1, 'm'), 1);
});

// A tape that trends hard one way then reverses, so a cross strategy must trade.
function trendingCandles() {
  const r = lcg(11);
  const out = [];
  let px = 1000;
  for (let i = 0; i < 400; i++) {
    const drift = i < 200 ? 0.0012 : -0.0012;
    px += drift * px + (r() - 0.5) * 0.0006 * px;
    out.push({ epoch: 1_700_000_000 + i * 60, open: px, high: px * 1.0004, low: px * 0.9996, close: px, ticks: 5, volume: 5 });
  }
  return out;
}

test('a cross strategy trades on a trending tape', () => {
  const s = defaultStrategy();
  s.timeframe = '1m';
  const r = runBacktest(s, trendingCandles(), { payoutRatio: 0.95, startEquity: 1000 });
  assert.ok(r.count > 0, 'no trades taken');
  assert.equal(r.wins + r.losses, r.count);
  assert.ok(Number.isFinite(r.pnl));
  assert.ok(r.maxDrawdown >= 0);
});

test('backtest honours the max-trades cap', () => {
  const s = defaultStrategy();
  s.timeframe = '1m';
  s.risk.maxTrades = 3;
  const r = runBacktest(s, trendingCandles());
  assert.ok(r.count <= 3, `took ${r.count} trades despite a cap of 3`);
});

test('martingale escalates the stake after a loss', () => {
  // Always-long strategy on a falling tape loses every trade → martingale must
  // step the stake up each time (until the cap).
  const falling = [];
  let px = 1000;
  for (let i = 0; i < 100; i++) { px *= 0.999; falling.push({ epoch: i, open: px, high: px, low: px, close: px * 0.999, ticks: 5 }); }
  const s = {
    id: 'always', name: 'always', timeframe: '1m',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 4, maxLosses: 0, martingale: true, martMult: 2, martSteps: 3 },
    action: { contract: 'CALL', duration: 1, durationUnit: 't' },
  };
  const r = runBacktest(s, falling);
  assert.ok(r.count >= 3);
  // stakes should strictly increase across the losing run
  assert.ok(r.trades[1].stake > r.trades[0].stake);
  assert.ok(r.trades[2].stake > r.trades[1].stake);
});

test('profit factor and win rate are consistent with the trade list', () => {
  const s = defaultStrategy();
  s.timeframe = '1m';
  const r = runBacktest(s, trendingCandles());
  const wins = r.trades.filter(t => t.won).length;
  assert.equal(r.wins, wins);
  assert.ok(Math.abs(r.winRate - (wins / r.count)) < 1e-9);
  if (r.count) assert.equal(r.trades[0].equity != null, true);
});

test('a strategy with no matching condition takes no trades', () => {
  const s = {
    id: 'never', name: 'never', timeframe: '1m',
    long: { logic: 'AND', conditions: [{ left: { kind: 'const', value: 1 }, op: 'gt', right: { kind: 'const', value: 2 } }] },
    risk: defaultStrategy().risk, action: { contract: 'CALL', duration: 1, durationUnit: 't' },
  };
  const r = runBacktest(s, candles(100, 2));
  assert.equal(r.count, 0);
  assert.equal(r.pnl, 0);
});

test('a tick-bar backtest reads a tick-unit hold as a fraction of a bar', () => {
  const bars = candles(200, 3, 0.0002);
  const s = {
    name: 'x', timeframe: '5s', barSize: 10,
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    short: null,
    risk: { stake: 0.35, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 10, durationUnit: 't' },
  };
  const r = runBacktest(s, bars, { barTicks: 10 });
  assert.equal(r.hold, 1);           // 10-tick hold == one 10-tick bar
});
