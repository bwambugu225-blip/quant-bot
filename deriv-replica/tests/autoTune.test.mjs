import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_BAR_SIZE, indicatorTemplates, scoreBacktest, rankStrategies, autoTune,
} from '../src/lib/autoTune.js';
import { defaultPanel, defaultStudy, makeStudy, studyKey, studyOutputs } from '../src/lib/studies.js';
import { INDICATORS, validateStrategy, compileStrategy, operandSeries } from '../src/lib/strategyBuilder.js';
import { runBacktest } from '../src/lib/backtest.js';
import { candles } from './helpers.mjs';

const C = candles(400, 5, 0.0002);

test('the default trading cadence is 10 ticks', () => {
  assert.equal(DEFAULT_BAR_SIZE, 10);
});

test('every indicator in the registry has a rule template', () => {
  const templates = indicatorTemplates(10);
  const covered = new Set(templates.map(t => t.indicator));
  for (const name of Object.keys(INDICATORS)) {
    if (name === 'price') continue;      // raw price field, not a tradable indicator
    assert.ok(covered.has(name), `no template for ${name}`);
  }
});

test('every generated template is valid and compiles', () => {
  for (const s of indicatorTemplates(10)) {
    assert.deepEqual(validateStrategy(s), [], `${s.name} invalid`);
    const compiled = compileStrategy(s, C);
    const r = compiled.at(50);
    assert.equal(typeof r.long, 'boolean');
    assert.equal(typeof r.short, 'boolean');
  }
});

test('every template trades a 10-tick contract on tick-count bars', () => {
  for (const s of indicatorTemplates(10)) {
    assert.equal(s.action.duration, 10);
    assert.equal(s.action.durationUnit, 't');
    assert.equal(s.barSize, 10);
  }
});

test('scoreBacktest rejects a backtest below the minimum trade count', () => {
  assert.equal(scoreBacktest({ count: 1, trades: [], expectancy: 5 }, { minTrades: 5 }).score, -Infinity);
  assert.equal(scoreBacktest(null).score, -Infinity);
});

test('scoreBacktest ranks a profitable run above a losing one', () => {
  const win = { count: 20, trades: [{ stake: 0.35 }], expectancy: 0.05, profitFactor: 1.6, maxDrawdown: 1, startEquity: 1000 };
  const lose = { count: 20, trades: [{ stake: 0.35 }], expectancy: -0.05, profitFactor: 0.6, maxDrawdown: 5, startEquity: 1000 };
  assert.ok(scoreBacktest(win).score > scoreBacktest(lose).score);
});

test('rankStrategies orders by score and drops thin results', () => {
  const strategies = indicatorTemplates(10);
  const ranked = rankStrategies(strategies, () => C, { minTrades: 5 });
  for (let i = 1; i < ranked.length; i++) assert.ok(ranked[i - 1].score >= ranked[i].score);
  assert.ok(ranked.every(r => r.backtest.count >= 5 || r.score === -Infinity));
});

test('autoTune returns the winner plus a ranked board', () => {
  const res = autoTune(() => C, { barSize: 10 });
  assert.ok(res.evaluated >= Object.keys(INDICATORS).length);
  assert.ok(res.ranked.length <= 12);
  if (res.best) {
    assert.ok(res.best.strategy);
    assert.ok(res.best.backtest);
    assert.ok(res.best.score >= res.ranked[0].score);
  }
});

test('studies: price-scale indicators overlay, oscillators get a pane', () => {
  assert.equal(defaultPanel('ema'), 'main');
  assert.equal(defaultPanel('bb'), 'main');
  assert.equal(defaultPanel('psar'), 'main');
  assert.equal(defaultPanel('rsi'), 'sub');
  assert.equal(defaultPanel('macd'), 'sub');
  assert.equal(defaultPanel('atr'), 'sub');
});

test('studies: defaultStudy carries the registry defaults', () => {
  const s = defaultStudy('ema');
  assert.equal(s.name, 'ema');
  assert.equal(s.params.period, INDICATORS.ema.params[0].def);
  assert.equal(s.panel, 'main');
  assert.equal(defaultStudy('nope'), null);
});

test('studies: makeStudy overrides params and studyKey is stable', () => {
  const a = makeStudy('ema', { period: 50 });
  assert.equal(a.params.period, 50);
  assert.equal(studyKey(a), studyKey(makeStudy('ema', { period: 50 })));
  assert.notEqual(studyKey(a), studyKey(makeStudy('ema', { period: 9 })));
});

test('studies: studyOutputs resolves aligned series via the builder resolver', () => {
  const study = makeStudy('macd', {});
  const outs = studyOutputs(C, study, operandSeries);
  assert.equal(outs.length, INDICATORS.macd.outputs.length);
  for (const o of outs) {
    assert.equal(o.series.length, C.length);
    assert.ok(o.series.some(v => v != null));
  }
});

test('a tick-bar backtest reads a tick-unit hold as a fraction of a bar', () => {
  const bars = C.slice(0, 200);
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
