import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultPanel, defaultStudy, makeStudy, studyKey, studyOutputs } from '../src/lib/studies.js';
import { INDICATORS, operandSeries } from '../src/lib/strategyBuilder.js';
import { candles } from './helpers.mjs';

const C = candles(400, 5, 0.0002);

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
