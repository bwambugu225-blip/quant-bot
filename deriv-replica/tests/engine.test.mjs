import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeEngine, loadTape, tick, tickTape } from './helpers.mjs';
import { defaultStrategy, validateStrategy } from '../src/lib/strategyBuilder.js';

test('importing a tape fills the store and the snapshot reports 1000 ticks', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(1000, 1));
  assert.equal(engine.store.tickCount('R_100'), 1000);
  assert.equal(engine.snapshot().ticks, 1000);
  assert.ok(engine.store.candles('R_100', '1m').length > 0);
});

test('warm-up gate: start queues until the market is warm', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  engine.setStrategy(defaultStrategy());
  loadTape(engine, 'R_100', tickTape(40, 1));   // only 40 ticks
  const started = engine.start();
  assert.equal(started, false);
  assert.equal(engine.running, false);
  assert.equal(engine.warmup().ready, false);
  // Now push the tape over the threshold and send one more tick: the pending
  // start engages automatically.
  loadTape(engine, 'R_100', tickTape(200, 2));
  tick(engine, 'R_100', 1000, 1_700_000_500);
  assert.equal(engine.running, true);
});

test('start refuses without a valid strategy', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(300, 1));
  assert.equal(engine.start(), false);          // no strategy yet
  engine.setStrategy({ name: '', long: { logic: 'AND', conditions: [] } });
  assert.equal(engine.start(), false);          // invalid strategy
});

test('the strategy fires on a closed candle and reaches the proposal socket', () => {
  const { engine, client } = makeEngine();
  client.autoRespond = true;
  engine.setSymbol('R_100');
  engine.setTimeframe('5s');
  const always = {
    id: 'always', name: 'always long', timeframe: '5s',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  };
  engine.setStrategy(always);
  loadTape(engine, 'R_100', tickTape(300, 3));
  engine.start();
  assert.equal(engine.running, true);

  // Push ticks across a 5s boundary so a candle closes, then one more tick so a
  // newer candle exists and the previous one is complete.
  let t = 1_700_001_000;
  for (let i = 0; i < 12; i++) { tick(engine, 'R_100', 1000 + i, t + i); }
  // A closed candle should now have produced a proposal.
  const proposals = client.sent.filter(m => m.proposal);
  assert.ok(proposals.length >= 1, 'no proposal sent after a candle closed');
  const p = proposals[0];
  assert.equal(p.contract_type, 'CALL');
  assert.equal(p.underlying_symbol, 'R_100');
  assert.equal(p.duration, 5);
  assert.equal(p.duration_unit, 't');
});

test('the engine does not trade twice on the same closed candle', () => {
  const { engine, client } = makeEngine();
  client.autoRespond = true;
  engine.setSymbol('R_100');
  engine.setTimeframe('5s');
  engine.setStrategy({
    id: 'always', name: 'always', timeframe: '5s',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0 },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  });
  loadTape(engine, 'R_100', tickTape(300, 4));
  engine.start();
  let t = 1_700_002_000;
  for (let i = 0; i < 10; i++) tick(engine, 'R_100', 1000 + i, t + i);
  const first = client.sent.filter(m => m.proposal).length;
  // Same candle window: no additional entries while an entry is 'sending'.
  for (let i = 0; i < 3; i++) tick(engine, 'R_100', 1000 + i, t + 9);
  const after = client.sent.filter(m => m.proposal).length;
  assert.ok(after - first <= 1, `fired ${after - first} extra proposals in one candle`);
});

test('manual placeTrade builds the exact proposal fields', () => {
  const { engine, client } = makeEngine();
  engine.setSymbol('R_50');
  const ok = engine.placeTrade('rise_fall', 'down', { stake: 10, duration: 3, unit: 't' });
  assert.equal(ok, true);
  const p = client.sent.find(m => m.proposal);
  assert.equal(p.contract_type, 'PUT');
  assert.equal(p.underlying_symbol, 'R_50');
  assert.equal(p.amount, 10);
  assert.equal(p.duration, 3);
});

test('manual placeTrade maps digit contracts to their barrier', () => {
  const { engine, client } = makeEngine();
  engine.setSymbol('R_100');
  engine.placeTrade('over_under', 'up', { stake: 1, duration: 1, unit: 't', digit: 3 });
  const p = client.sent.find(m => m.proposal);
  assert.equal(p.contract_type, 'DIGITOVER');
  assert.equal(p.barrier, '3');
});

test('buy then settlement updates wins, pnl and reports', () => {
  const { engine, client } = makeEngine();
  engine.setSymbol('R_100');
  engine.placeTrade('rise_fall', 'up', { stake: 5, duration: 1, unit: 't' });
  // Simulate the proposal response, then the buy.
  engine._onProposal({ proposal: { id: 'P1', ask_price: 5 } });
  engine._onBuy({ buy: { contract_id: 123, buy_price: 5, contract_type: 'CALL', longcode: 'Rise' } });
  assert.equal(engine.positions.length, 1);
  assert.equal(engine.trades, 1);
  engine._onContract({ contract_id: 123, status: 'won', profit: 4.75, is_sold: 1 });
  assert.equal(engine.wins, 1);
  assert.equal(engine.positions.length, 0);
  assert.equal(engine.reports.length, 1);
  assert.ok(Math.abs(engine.pnl - 4.75) < 1e-9);
});

test('a losing run hits maxLosses and stops the engine', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  engine.setStrategy({
    id: 's', name: 's', timeframe: '1m',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, maxLosses: 2, martingale: false },
    action: { contract: 'CALL', duration: 1, durationUnit: 't' },
  });
  engine.running = true;
  for (const id of [1, 2]) {
    engine._onBuy({ buy: { contract_id: id, buy_price: 1, contract_type: 'CALL' } });
    engine._onContract({ contract_id: id, status: 'lost', profit: -1, is_sold: 1 });
  }
  assert.equal(engine.running, false);
  assert.equal(engine.losses, 2);
});

test('the session risk caps stop trading at take profit', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  engine.setStrategy({
    id: 's', name: 's', timeframe: '1m',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 3 },
    action: { contract: 'CALL', duration: 1, durationUnit: 't' },
  });
  engine.running = true;
  engine.pnl = 5;
  assert.equal(engine._sessionAllows(), false);
  assert.equal(engine.running, false);
});

test('resetSession clears the bookkeeping', () => {
  const { engine } = makeEngine();
  engine.wins = 3; engine.losses = 2; engine.pnl = 10; engine.trades = 5;
  engine.reports = [{ id: 1 }];
  engine.resetSession();
  assert.equal(engine.wins, 0);
  assert.equal(engine.trades, 0);
  assert.equal(engine.reports.length, 0);
});

test('a strategy carrying barSize evaluates and trades fixed-tick-count bars', () => {
  const { engine, client } = makeEngine();
  client.autoRespond = true;
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(1000, 3));
  const s = {
    id: 'tb', name: 'tickbar long', timeframe: '5s', barSize: 10,
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false },
    action: { contract: 'CALL', duration: 10, durationUnit: 't' },
  };
  engine.setStrategy(s);
  assert.equal(engine.start(), true);
  // A fresh 10-tick bar closes on each 10th tick; the evaluator must read the
  // tick-bar buffer, not the clock candles.
  for (let i = 0; i < 30; i++) tick(engine, 'R_100', 1000 + i, 1_700_002_000 + i);
  const prop = client.sent.find(o => o.proposal);
  assert.ok(prop, 'expected a proposal from the tick-bar strategy');
  assert.equal(prop.duration, 10);
  assert.equal(prop.duration_unit, 't');
});

test('autoTune ranks the registry over the imported tape', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(1000, 7));
  const tune = engine.autoTune('R_100');
  assert.equal(tune.sym, 'R_100');
  assert.equal(tune.barSize, 10);
  assert.ok(tune.evaluated >= 30);
  assert.ok(Array.isArray(tune.ranked));
  if (tune.best) assert.ok(tune.best.strategy && tune.best.backtest);
});

test('startBest adopts the tuned winner and starts the engine', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  loadTape(engine, 'R_100', tickTape(1000, 11));
  engine.setStrategy(defaultStrategy());
  const started = engine.startBest('R_100');
  assert.equal(started, true);
  assert.equal(engine.running, true);
  // Whatever the tuner found, the running strategy is a valid one and the
  // snapshot reports the tune board.
  assert.deepEqual(validateStrategy(engine.strategy), []);
  const snap = engine.snapshot();
  assert.ok(snap.tune);
  assert.equal(snap.tune.barSize, 10);
});

test('startBest keeps the loaded strategy when nothing clears the bar', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  // A flat tape gives no indicator a directional edge with enough trades.
  loadTape(engine, 'R_100', { times: Array.from({ length: 1000 }, (_, i) => 1_700_000_000 + i), prices: Array(1000).fill(1000) });
  engine.setStrategy(defaultStrategy());
  engine.startBest('R_100');
  assert.equal(engine.running, true);
  assert.equal(engine.strategy.name, defaultStrategy().name);
  assert.equal(engine.snapshot().tune.best, null);
});

test('setRisk merges into the strategy risk block', () => {
  const { engine } = makeEngine();
  engine.setStrategy(defaultStrategy());
  engine.setRisk({ stake: 7 });
  assert.equal(engine.strategy.risk.stake, 7);
  assert.equal(engine.strategy.risk.martingale, false);   // default retained
});

test('backtest reads the selected symbol history', () => {
  const { engine } = makeEngine();
  engine.setSymbol('R_100');
  const s = defaultStrategy();
  s.timeframe = '5s';                 // 1000 ticks at 1/s → 200 candles
  engine.setStrategy(s);
  loadTape(engine, 'R_100', tickTape(1000, 9));
  const r = engine.backtest();
  assert.ok(r);
  assert.ok(!r.error, r.error);
  assert.ok(r.count >= 0);
  assert.ok(Number.isFinite(r.pnl));
});

test('execStats is empty before any trade and reports after one', () => {
  const { engine } = makeEngine();
  assert.equal(engine.execStats().n, 0);
  engine._recordExec(12);
  engine._recordExec(20);
  const s = engine.execStats();
  assert.equal(s.n, 2);
  assert.ok(s.p50 != null && s.p95 != null);
});
