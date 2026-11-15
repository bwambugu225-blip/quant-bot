import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  INDICATORS, OPERATORS, operandSeries, evalGroupAt, compileStrategy,
  evaluateStrategy, validateStrategy, describeStrategy, describeGroup,
  defaultStrategy, defaultParamsFor, STRATEGY_TEMPLATES,
} from '../src/lib/strategyBuilder.js';
import { candles } from './helpers.mjs';

const C = candles(200, 7, 0.0003);

test('the indicator registry exposes 20+ indicators with params and outputs', () => {
  const names = Object.keys(INDICATORS);
  assert.ok(names.length >= 22, `only ${names.length} indicators`);
  for (const [name, ind] of Object.entries(INDICATORS)) {
    assert.equal(typeof ind.series, 'function', `${name} has no series`);
    assert.ok(Array.isArray(ind.outputs) && ind.outputs.length, `${name} has no outputs`);
  }
});

test('operandSeries resolves price, const and indicator operands', () => {
  const close = operandSeries(C, { kind: 'price', field: 'close' });
  assert.equal(close.length, C.length);
  assert.equal(close[0], C[0].close);
  const konst = operandSeries(C, { kind: 'const', value: 42 });
  assert.ok(konst.every(v => v === 42));
  const rsi = operandSeries(C, { kind: 'indicator', name: 'rsi', params: { period: 14 } });
  assert.equal(rsi.length, C.length);
  assert.ok(rsi[rsi.length - 1] >= 0 && rsi[rsi.length - 1] <= 100);
});

test('operandSeries supports an output selector and a lag offset', () => {
  const macdHist = operandSeries(C, { kind: 'indicator', name: 'macd', output: 'hist' });
  const macd0 = operandSeries(C, { kind: 'indicator', name: 'macd', output: 'hist', offset: 0 });
  assert.deepEqual(macdHist, macd0);
  const lagged = operandSeries(C, { kind: 'indicator', name: 'macd', output: 'hist', offset: 1 });
  assert.equal(lagged[0], null);
  assert.equal(lagged[1], macdHist[0]);
});

test('evalGroupAt respects AND and OR, and nests groups', () => {
  const alwaysTrue = { left: { kind: 'const', value: 1 }, op: 'gt', right: { kind: 'const', value: 0 } };
  const alwaysFalse = { left: { kind: 'const', value: 0 }, op: 'gt', right: { kind: 'const', value: 1 } };
  assert.equal(evalGroupAt(C, { logic: 'AND', conditions: [alwaysTrue, alwaysTrue] }, 50), true);
  assert.equal(evalGroupAt(C, { logic: 'AND', conditions: [alwaysTrue, alwaysFalse] }, 50), false);
  assert.equal(evalGroupAt(C, { logic: 'OR', conditions: [alwaysTrue, alwaysFalse] }, 50), true);
  assert.equal(evalGroupAt(C, { logic: 'OR', conditions: [alwaysFalse, alwaysFalse] }, 50), false);
  // Nested: (A AND B) OR C
  const nested = { logic: 'OR', conditions: [{ logic: 'AND', conditions: [alwaysFalse, alwaysTrue] }, alwaysTrue] };
  assert.equal(evalGroupAt(C, nested, 50), true);
});

test('crossOver fires only on the crossing bar', () => {
  // Build a tape where a fast constant series crosses a slow one at index 3.
  const seq = [1, 2, 3, 4, 5].map(v => ({ epoch: v, open: v, high: v, low: v, close: v }));
  const group = {
    logic: 'AND',
    conditions: [{ left: { kind: 'price', field: 'close' }, op: 'crossOver', right: { kind: 'const', value: 3 } }],
  };
  // close crosses above 3 at index 3 (4 > 3, prev 3 not > 3).
  assert.equal(evalGroupAt(seq, group, 3), true);
  assert.equal(evalGroupAt(seq, group, 4), false);
  assert.equal(evalGroupAt(seq, group, 2), false);
});

test('rising / falling detect the direction of the last step', () => {
  const seq = [1, 2, 3].map(v => ({ epoch: v, open: v, high: v, low: v, close: v }));
  const up = { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'rising' }] };
  const dn = { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'falling' }] };
  assert.equal(evalGroupAt(seq, up, 2), true);
  assert.equal(evalGroupAt(seq, dn, 2), false);
});

test('evaluateStrategy returns a side on the last candle or null', () => {
  const strat = defaultStrategy();
  strat.timeframe = '1m';
  const res = evaluateStrategy(strat, C);
  // It may or may not fire on a random tape; if it fires the action is a side.
  if (res) assert.ok(['up', 'down', 'both'].includes(res.action));
  // A guaranteed long: close > 0.
  const always = {
    id: 'x', name: 'always', timeframe: '1m',
    long: { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt', right: { kind: 'const', value: 0 } }] },
    risk: defaultStrategy().risk, action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  };
  assert.equal(evaluateStrategy(always, C).action, 'up');
});

test('validateStrategy flags missing pieces', () => {
  assert.deepEqual(validateStrategy({ ...defaultStrategy() }), []);
  assert.ok(validateStrategy({ name: '', long: { logic: 'AND', conditions: [] } }).length >= 1);
  const badOp = defaultStrategy();
  badOp.long = { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'nope' }] };
  assert.ok(validateStrategy(badOp).some(e => /unknown operator/.test(e)));
  const missingRight = defaultStrategy();
  missingRight.long = { logic: 'AND', conditions: [{ left: { kind: 'price' }, op: 'gt' }] };
  assert.ok(validateStrategy(missingRight).some(e => /right operand/.test(e)));
});

test('describeStrategy renders a human-readable expression', () => {
  const d = describeStrategy(defaultStrategy());
  assert.ok(/EMA/.test(d));
  assert.ok(/crosses above/.test(d));
});

test('every template is valid and compiles', () => {
  for (const make of STRATEGY_TEMPLATES) {
    const s = make();
    assert.deepEqual(validateStrategy(s), [], `${s.name} invalid`);
    const compiled = compileStrategy(s, C);
    for (let i = 10; i < 30; i++) {
      const r = compiled.at(i);
      assert.equal(typeof r.long, 'boolean');
    }
  }
});

test('defaultParamsFor reads the indicator definition', () => {
  assert.deepEqual(defaultParamsFor('rsi'), { period: 14 });
  assert.deepEqual(defaultParamsFor('bb'), { period: 20, mult: 2 });
});

test('every operator is used by at least one descriptor', () => {
  const ids = OPERATORS.map(o => o.id);
  for (const want of ['gt', 'gte', 'lt', 'lte', 'crossOver', 'crossUnder', 'rising', 'falling', 'within']) {
    assert.ok(ids.includes(want), `missing operator ${want}`);
  }
});
