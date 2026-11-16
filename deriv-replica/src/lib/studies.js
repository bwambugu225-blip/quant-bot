// Chart studies.
//
// A "study" is one indicator placed on the chart: its registry name, the params
// it was added with, and the panel it belongs on. The chart draws a study's
// series through the same `operandSeries` resolver the strategy builder uses,
// so a line on the chart and a rule in the builder read identical values.
//
// Panel assignment is by price scale: indicators that live in price units
// (moving averages, bands, PSAR) overlay the candles; the rest (oscillators,
// volume, volatility) get their own pane below.
import { INDICATORS } from './strategyBuilder.js';

// Indicators whose values share the price axis.
const PRICE_SCALE = new Set([
  'sma', 'ema', 'wma', 'dema', 'tema', 'hma', 'bb', 'keltner', 'donchian',
  'ichimoku', 'superTrend', 'vwap', 'psar', 'alligator', 'kalman',
]);

export function defaultPanel(name) {
  return PRICE_SCALE.has(name) ? 'main' : 'sub';
}

// Distinct, legible line colours, cycled per output.
export const STUDY_COLORS = [
  '#4c86e0', '#c8a250', '#2bb673', '#e0524f', '#8b7fd4',
  '#d99a3a', '#3fa9c9', '#c95fa0', '#7fbf5f', '#b0b6c2',
];

export const studyKey = s => `${s.name}:${JSON.stringify(s.params || {})}`;

// One study per registry indicator, using its own default params. The picker
// lists these; adding one is a single click.
export function defaultStudy(name) {
  const ind = INDICATORS[name];
  if (!ind) return null;
  const params = {};
  (ind.params || []).forEach(p => { params[p.key] = p.def; });
  return { name, params, panel: defaultPanel(name) };
}

export function makeStudy(name, params = {}) {
  const base = defaultStudy(name);
  if (!base) return null;
  return { ...base, params: { ...base.params, ...params } };
}

// Resolve a study's outputs to aligned series, using the builder's resolver so
// the values match exactly what a strategy would see.
export function studyOutputs(candles, study, operandSeries) {
  const ind = INDICATORS[study.name];
  if (!ind) return [];
  return ind.outputs.map(output => ({
    output,
    series: operandSeries(candles, {
      kind: 'indicator', name: study.name, params: study.params, output,
    }),
  }));
}
