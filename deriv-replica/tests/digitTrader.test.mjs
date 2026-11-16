// Digit autotrader tests: Over/Under and Even/Odd.
//
// The decision logic is pure, so every case is driven from a deterministic
// digit stream. The engine cases drive the real routing: a biased tape should
// produce a proposal for the right contract, a fair tape should produce none.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { digitStream, makeEngine, loadTape, tick } from './helpers.mjs';
import {
  digitCounts, sideRates, digitBias, digitRead, digitSignal,
  defaultDigitConfig, digitMode, DIGIT_MODES,
} from '../src/lib/digitTrader.js';

// A tape of prices whose last digit is the requested stream. R_75 uses 4
// decimals, so a price of 1000 + d/10000 renders a final digit of d.
function digitTape(digits, start = 1_700_000_000) {
  return { times: digits.map((_, i) => start + i), prices: digits.map(d => 1000 + d / 10000) };
}

test('digitCounts tallies only the most recent window', () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1];
  const { counts, n } = digitCounts(digits, 5);
  assert.equal(n, 5);
  const expected = new Array(10).fill(0);
  expected[9] = 1; expected[1] = 3; expected[8] = 1;
  assert.deepEqual(counts, expected);
});

test('even/odd splits the ten digits five and five with a half baseline', () => {
  const counts = new Array(10).fill(0);
  counts.forEach((_, d) => { counts[d] = 10; });
  const r = sideRates('even_odd', 4, counts, 100);
  assert.equal(r.up.base, 0.5);
  assert.equal(r.down.base, 0.5);
  assert.equal(r.up.rate, 0.5);
  assert.equal(r.down.rate, 0.5);
});

test('over/under baselines follow the barrier and the barrier digit wins neither', () => {
  const counts = new Array(10).fill(0);
  counts.forEach((_, d) => { counts[d] = 10; });
  const r = sideRates('over_under', 4, counts, 100);
  // Over 4 wins digits 5..9 (five digits) and Under 4 wins 0..3 (four digits).
  assert.equal(r.up.base, 0.5);
  assert.equal(r.down.base, 0.4);
  assert.equal(r.up.rate, 0.5);
  assert.equal(r.down.rate, 0.4);
  // The two sides plus the barrier partition the sample exactly.
  assert.equal(r.up.wins + r.down.wins + counts[4], 100);
});

test('a biased stream lifts the matching side above its baseline', () => {
  const digits = digitStream(d => d % 2 === 0, 0.8, 400, 11);
  const { counts, n } = digitCounts(digits, 300);
  const r = sideRates('even_odd', 4, counts, n);
  assert.ok(r.up.rate > 0.7, `even rate ${r.up.rate}`);
  assert.ok(r.up.edge > 0.2);
  assert.ok(r.up.z > 4, `z ${r.up.z}`);
  assert.ok(r.down.edge < 0);
});

test('digitSignal picks the side that clears both gates', () => {
  const digits = digitStream(d => d > 4, 0.65, 400, 5);
  const sig = digitSignal({ ...defaultDigitConfig(), mode: 'over_under', barrier: 4, window: 300 }, digits);
  assert.ok(sig, 'expected a signal');
  assert.equal(sig.side, 'up');
  assert.equal(sig.contract, 'DIGITOVER');
  assert.equal(sig.barrier, 4);
  assert.equal(sig.tradeType, 'over_under');
  assert.ok(sig.edge > 0.05);
});

test('digitSignal stands aside on a fair stream', () => {
  const digits = digitStream(() => true, 1, 600, 3);
  assert.equal(digitSignal({ ...defaultDigitConfig(), window: 300 }, digits), null);
});

test('digitSignal stands aside when the sample is too short', () => {
  const digits = digitStream(d => d % 2 === 0, 0.9, 15, 2);
  assert.equal(digitSignal({ ...defaultDigitConfig(), mode: 'even_odd' }, digits), null);
});

test('an explicit side is only taken when it clears the gate itself', () => {
  // Even is the strong side; asking for Odd must produce nothing.
  const digits = digitStream(d => d % 2 === 0, 0.85, 400, 8);
  const cfg = { ...defaultDigitConfig(), mode: 'even_odd', window: 300, side: 'down' };
  assert.equal(digitSignal(cfg, digits), null);
  const up = digitSignal({ ...cfg, side: 'up' }, digits);
  assert.ok(up);
  assert.equal(up.side, 'up');
});

test('a higher z gate rejects a real but marginal deviation', () => {
  const digits = digitStream(d => d % 2 === 0, 0.55, 400, 4);
  const cfg = { ...defaultDigitConfig(), mode: 'even_odd', window: 300 };
  const loose = digitSignal({ ...cfg, minZ: 0 }, digits);
  assert.ok(loose, 'a small edge should pass a zero z gate');
  assert.equal(digitSignal({ ...cfg, minZ: 6 }, digits), null);
});

test('even/odd carries no barrier; over/under carries the clamped barrier', () => {
  const digits = digitStream(d => d % 2 === 0, 0.8, 300, 6);
  const eo = digitSignal({ ...defaultDigitConfig(), mode: 'even_odd', window: 200 }, digits);
  assert.equal(eo.barrier, null);
  const ou = digitSignal({ ...defaultDigitConfig(), mode: 'over_under', barrier: 12, window: 200 }, digits);
  if (ou) assert.ok(ou.barrier >= 0 && ou.barrier <= 9);
});

test('digitRead reports the counts, both rates and the distribution bias', () => {
  const digits = digitStream(() => true, 1, 500, 12);
  const read = digitRead({ ...defaultDigitConfig(), window: 300 }, digits);
  assert.equal(read.n, 300);
  assert.equal(read.counts.length, 10);
  assert.equal(read.counts.reduce((a, b) => a + b, 0), 300);
  assert.ok(Number.isFinite(read.bias.chi2));
  assert.ok(read.rates.up && read.rates.down);
});

test('digitBias is ~0 for a uniform stream and large for a lopsided one', () => {
  const uniform = new Array(10).fill(50);
  assert.equal(digitBias(uniform, 500).chi2, 0);
  const lopsided = [500, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assert.ok(digitBias(lopsided, 500).chi2 > 16.9);
});

test('digitMode resolves known ids and falls back to the first', () => {
  assert.equal(digitMode('even_odd').id, 'even_odd');
  assert.equal(digitMode('nope').id, DIGIT_MODES[0].id);
});

// ── engine routing ──────────────────────────────────────────────────────

test('the digit autotrader proposes the side the read names', () => {
  const { engine, client } = makeEngine();
  const digits = digitStream(d => d % 2 === 0, 0.8, 400, 21);
  loadTape(engine, 'R_75', digitTape(digits));
  engine.setDigitConfig({ mode: 'even_odd', window: 200, minEdge: 0.02, minZ: 2, side: 'auto', duration: 5 });
  engine.setTradeMode('digit');
  assert.equal(engine.startDigits(), true);
  for (let i = 0; i < 60; i++) tick(engine, 'R_75', 1000 + (i % 10) / 10000, 1_700_000_400 + i);
  const p = client.sent.find(m => m.proposal);
  assert.ok(p, 'expected a proposal');
  assert.equal(p.contract_type, 'DIGITEVEN');
  assert.equal(p.duration_unit, 't');
  assert.equal(p.duration, 5);
});

test('over/under sends the barrier as the contract digit', () => {
  const { engine, client } = makeEngine();
  const digits = digitStream(d => d > 4, 0.8, 400, 22);
  loadTape(engine, 'R_75', digitTape(digits));
  engine.setDigitConfig({ mode: 'over_under', barrier: 4, window: 200, minEdge: 0.02, minZ: 2, side: 'auto' });
  engine.setTradeMode('digit');
  engine.startDigits();
  for (let i = 0; i < 60; i++) tick(engine, 'R_75', 1000 + (i % 10) / 10000, 1_700_000_400 + i);
  const p = client.sent.find(m => m.proposal);
  assert.ok(p, 'expected a proposal');
  assert.equal(p.contract_type, 'DIGITOVER');
  assert.equal(p.barrier, '4');
});

test('a fair tape places no digit trade', () => {
  const { engine, client } = makeEngine();
  const digits = digitStream(() => true, 1, 600, 23);
  loadTape(engine, 'R_75', digitTape(digits));
  engine.setDigitConfig({ mode: 'even_odd', window: 200, minEdge: 0.02, minZ: 2, side: 'auto' });
  engine.setTradeMode('digit');
  engine.startDigits();
  // The tape above is a fair sample; the ticks that follow are too, so no
  // window clears the gate and nothing is sent.
  for (let i = 0; i < 80; i++) tick(engine, 'R_75', 1000 + (i % 10) / 10000, 1_700_000_600 + i);
  assert.equal(client.sent.filter(m => m.proposal).length, 0);
});

test('digit mode and strategy mode are mutually exclusive', () => {
  const { engine } = makeEngine();
  engine.setTradeMode('digit');
  assert.equal(engine.snapshot().tradeMode, 'digit');
  // A digit run cannot be started through the strategy entry point.
  engine.setDigitConfig({ mode: 'even_odd', window: 100 });
  loadTape(engine, 'R_75', digitTape(digitStream(() => true, 1, 200, 24)));
  assert.equal(engine.start(), false);
  engine.setTradeMode('strategy');
  assert.equal(engine.snapshot().tradeMode, 'strategy');
});

test('the digit trader refuses a market whose digit is not meaningful', () => {
  const { engine } = makeEngine();
  engine.setSymbol('frxEURUSD');
  engine.setTradeMode('digit');
  assert.equal(engine.startDigits(), false);
  assert.equal(engine.running, false);
});

test('digit mode does not also trade the loaded strategy', () => {
  const { engine, client } = makeEngine();
  // A strategy that would fire on almost any tape, plus a strongly biased digit
  // tape: only the digit trader may place a trade while digit mode is on.
  const digits = digitStream(d => d % 2 === 0, 0.85, 400, 31);
  loadTape(engine, 'R_75', digitTape(digits));
  engine.setStrategy({
    id: 'always', name: 'always long', timeframe: '5s', barSize: 10,
    long: { logic: 'AND', conditions: [{ left: { kind: 'price', field: 'close' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    short: null,
    risk: { stake: 0.35, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false, martMult: 2, martSteps: 3, sizing: 'fixed' },
    action: { type: 'rise_fall', duration: 5, durationUnit: 't' },
  });
  engine.setDigitConfig({ mode: 'even_odd', window: 50, minEdge: 0.02, minZ: 2, side: 'auto' });
  engine.setTradeMode('digit');
  engine.startDigits();
  for (let i = 0; i < 200; i++) tick(engine, 'R_75', 1000 + (i % 10) / 10000, 1_700_000_400 + i);
  const types = client.sent.filter(m => m.proposal).map(m => m.contract_type);
  assert.ok(types.length >= 1, 'expected at least one digit trade');
  assert.ok(types.every(t => t === 'DIGITEVEN' || t === 'DIGITODD'), `unexpected contract among ${types}`);
});

test('the digit trader cannot stack contracts while one is open', () => {
  const { engine, client } = makeEngine();
  const digits = digitStream(d => d % 2 === 0, 0.85, 500, 25);
  loadTape(engine, 'R_75', digitTape(digits));
  engine.setDigitConfig({ mode: 'even_odd', window: 50, minEdge: 0.02, minZ: 2, side: 'auto' });
  engine.setTradeMode('digit');
  engine.startDigits();
  for (let i = 0; i < 400; i++) tick(engine, 'R_75', 1000 + (i % 10) / 10000, 1_700_000_500 + i);
  // The 'sending' slot is never cleared because no proposal response arrives,
  // so exactly one proposal goes out regardless of how many ticks follow.
  assert.equal(client.sent.filter(m => m.proposal).length, 1);
});
