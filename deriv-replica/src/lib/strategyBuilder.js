// Strategy builder.
//
// A strategy is plain data the user assembles in the UI:
//
//   {
//     id, name, timeframe,
//     long:  <group>,            // rise / buy condition
//     short: <group>,            // fall / sell condition (optional)
//     risk:  { stake, takeProfit, stopLoss, maxTrades, maxLosses,
//              martingale, martMult, martSteps, sizing },
//     action: { contract: 'CALL', duration: 10, durationUnit: 't' }
//   }
//
//   <group>     = { logic: 'AND' | 'OR', conditions: [<condition> | <group>] }
//   <condition> = { left: <operand>, op, right: <operand> }
//   <operand>   = { kind: 'indicator', name, params, output, offset }
//               | { kind: 'price', field }        // open/high/low/close/hl2/hlc3/ohlc4
//               | { kind: 'const', value }
//
// `compileStrategy` resolves every operand to a series aligned to the candle
// array, so the same compiled form is used by the live signal path (evaluate at
// the last index) and by the backtester (evaluate at every index). This is what
// makes the builder "however complex" — groups nest arbitrarily and every
// comparison, crossover and slope test is available at any depth.
import * as TA from './indicators.js';
import { DEFAULT_STAKE } from './format.js';

// ── indicator registry ─────────────────────────────────────────────────────
// `series(candles, params)` returns an object of aligned series. `params`
// describes the controls the UI renders for that indicator.
const num = (key, label, def, min = 1, max = 400) => ({ key, label, def, min, max, type: 'number' });

export const INDICATORS = {
  price: {
    label: 'Price', params: [], outputs: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
    series: c => ({
      open: c.map(x => x.open), high: c.map(x => x.high), low: c.map(x => x.low),
      close: TA.closes(c), hl2: TA.hl2(c), hlc3: TA.hlc3(c), ohlc4: TA.ohlc4(c),
    }),
  },
  sma: { label: 'SMA', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.smaSeries(TA.closes(c), p.period) }) },
  ema: { label: 'EMA', params: [num('period', 'Period', 21)], outputs: ['value'], series: (c, p) => ({ value: TA.emaSeries(TA.closes(c), p.period) }) },
  wma: { label: 'WMA', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.wmaSeries(TA.closes(c), p.period) }) },
  rsi: { label: 'RSI', params: [num('period', 'Period', 14)], outputs: ['value'], series: (c, p) => ({ value: TA.rsiSeries(TA.closes(c), p.period) }) },
  macd: {
    label: 'MACD', params: [num('fast', 'Fast', 12), num('slow', 'Slow', 26), num('signal', 'Signal', 9)],
    outputs: ['macd', 'signal', 'hist'],
    series: (c, p) => TA.macdSeries(TA.closes(c), p.fast, p.slow, p.signal),
  },
  bb: {
    label: 'Bollinger Bands', params: [num('period', 'Period', 20), num('mult', 'StdDev', 2, 0.1, 10)],
    outputs: ['upper', 'mid', 'lower'],
    series: (c, p) => TA.bollingerSeries(TA.closes(c), p.period, p.mult),
  },
  keltner: {
    label: 'Keltner Channel', params: [num('period', 'Period', 20), num('mult', 'Mult', 1.5, 0.1, 10)],
    outputs: ['upper', 'mid', 'lower'],
    series: (c, p) => TA.keltnerSeries(c, p.period, p.mult),
  },
  donchian: {
    label: 'Donchian Channel', params: [num('period', 'Period', 20)],
    outputs: ['upper', 'mid', 'lower'],
    series: (c, p) => TA.donchianSeries(c, p.period),
  },
  atr: { label: 'ATR', params: [num('period', 'Period', 14)], outputs: ['value'], series: (c, p) => ({ value: TA.atrSeries(c, p.period) }) },
  adx: { label: 'ADX', params: [num('period', 'Period', 14)], outputs: ['adx', 'pdi', 'ndi'], series: (c, p) => TA.adxSeries(c, p.period) },
  stoch: { label: 'Stochastic', params: [num('period', 'Period', 14), num('smooth', 'Smooth', 3)], outputs: ['k', 'd'], series: (c, p) => TA.stochSeries(c, p.period, p.smooth) },
  stochRsi: { label: 'Stoch RSI', params: [num('period', 'RSI', 14), num('smooth', 'Smooth', 3)], outputs: ['value'], series: (c, p) => ({ value: TA.stochRsiSeries(TA.closes(c), p.period, p.smooth) }) },
  williamsR: { label: 'Williams %R', params: [num('period', 'Period', 14)], outputs: ['value'], series: (c, p) => ({ value: TA.williamsRSeries(c, p.period) }) },
  cci: { label: 'CCI', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.cciSeries(c, p.period) }) },
  roc: { label: 'Rate of Change', params: [num('period', 'Period', 12)], outputs: ['value'], series: (c, p) => ({ value: TA.rocSeries(TA.closes(c), p.period) }) },
  momentum: { label: 'Momentum', params: [num('period', 'Period', 10)], outputs: ['value'], series: (c, p) => ({ value: TA.momentumSeries(TA.closes(c), p.period) }) },
  aroon: { label: 'Aroon', params: [num('period', 'Period', 25)], outputs: ['up', 'down'], series: (c, p) => TA.aroonSeries(c, p.period) },
  ichimoku: { label: 'Ichimoku', params: [num('conv', 'Conversion', 9), num('base', 'Base', 26), num('spanB', 'Span B', 52)], outputs: ['tenkan', 'kijun', 'senkouA', 'senkouB'], series: (c, p) => TA.ichimokuSeries(c, p.conv, p.base, p.spanB) },
  superTrend: { label: 'SuperTrend', params: [num('period', 'Period', 10), num('mult', 'Mult', 3, 0.1, 10)], outputs: ['up', 'dn', 'dir'], series: (c, p) => TA.superTrendSeries(c, p.period, p.mult) },
  vwap: { label: 'VWAP', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.vwapSeries(c, p.period) }) },
  obv: { label: 'OBV', params: [], outputs: ['value'], series: c => ({ value: TA.obvSeries(c) }) },
  mfi: { label: 'MFI', params: [num('period', 'Period', 14)], outputs: ['value'], series: (c, p) => ({ value: TA.mfiSeries(c, p.period) }) },
  volume: { label: 'Volume', params: [], outputs: ['value'], series: c => ({ value: TA.volumes(c) }) },
  dema: { label: 'DEMA', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.demaSeries(TA.closes(c), p.period) }) },
  tema: { label: 'TEMA', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.temaSeries(TA.closes(c), p.period) }) },
  hma: { label: 'Hull MA', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.hmaSeries(TA.closes(c), p.period) }) },
  trix: { label: 'TRIX', params: [num('period', 'Period', 15)], outputs: ['value'], series: (c, p) => ({ value: TA.trixSeries(TA.closes(c), p.period) }) },
  alligator: {
    label: 'Alligator', params: [num('jaw', 'Jaw', 13), num('teeth', 'Teeth', 8), num('lips', 'Lips', 5)],
    outputs: ['jaw', 'teeth', 'lips'],
    series: (c, p) => TA.alligatorSeries(c, p.jaw, p.teeth, p.lips),
  },
  awesome: { label: 'Awesome Osc', params: [], outputs: ['value'], series: c => ({ value: TA.awesomeSeries(c) }) },
  cmf: { label: 'Chaikin MF', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.cmfSeries(c, p.period) }) },
  klinger: {
    label: 'Klinger Osc', params: [num('fast', 'Fast', 34), num('slow', 'Slow', 55), num('signal', 'Signal', 13)],
    outputs: ['kvo', 'signal'],
    series: (c, p) => TA.klingerSeries(c, p.fast, p.slow, p.signal),
  },
  fisher: { label: 'Fisher', params: [num('period', 'Period', 10)], outputs: ['value'], series: (c, p) => ({ value: TA.fisherSeries(c, p.period) }) },
  vortex: { label: 'Vortex', params: [num('period', 'Period', 14)], outputs: ['plus', 'minus'], series: (c, p) => TA.vortexSeries(c, p.period) },
  dpo: { label: 'DPO', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.dpoSeries(c, p.period) }) },
  eom: { label: 'Ease of Move', params: [num('period', 'Period', 14)], outputs: ['value'], series: (c, p) => ({ value: TA.eomSeries(c, p.period) }) },
  forceIndex: { label: 'Force Index', params: [num('period', 'Period', 13)], outputs: ['value'], series: (c, p) => ({ value: TA.forceIndexSeries(c, p.period) }) },
  ultimate: { label: 'Ultimate Osc', params: [], outputs: ['value'], series: c => ({ value: TA.ultimateSeries(c) }) },
  psar: { label: 'Parabolic SAR', params: [num('step', 'Step', 0.02, 0.001, 1), num('max', 'Max AF', 0.2, 0.01, 1)], outputs: ['value'], series: (c, p) => ({ value: TA.psarSeries(c, p.step, p.max) }) },
  zscore: { label: 'Z-Score', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.zscoreSeries(TA.closes(c), p.period) }) },
  efficiencyRatio: { label: 'Efficiency Ratio', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.efficiencyRatioSeries(c, p.period) }) },
  choppiness: { label: 'Choppiness Index', params: [num('period', 'Period', 14)], outputs: ['value'], series: (c, p) => ({ value: TA.choppinessSeries(c, p.period) }) },
  hurst: { label: 'Hurst Exponent', params: [num('period', 'Period', 64)], outputs: ['value'], series: (c, p) => ({ value: TA.hurstSeries(TA.closes(c), p.period) }) },
  fractalDimension: { label: 'Fractal Dimension', params: [num('period', 'Period', 32)], outputs: ['value'], series: (c, p) => ({ value: TA.fractalDimensionSeries(TA.closes(c), p.period) }) },
  entropy: { label: 'Entropy', params: [num('period', 'Period', 32), num('bins', 'Bins', 6, 2, 20)], outputs: ['value'], series: (c, p) => ({ value: TA.entropySeries(TA.closes(c), p.period, p.bins) }) },
  skew: { label: 'Skew', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.skewSeries(TA.closes(c), p.period) }) },
  kurtosis: { label: 'Kurtosis', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.kurtosisSeries(TA.closes(c), p.period) }) },
  cusum: { label: 'CUSUM', params: [num('period', 'Period', 20)], outputs: ['value'], series: (c, p) => ({ value: TA.cusumSeries(TA.closes(c), p.period) }) },
  kalman: { label: 'Kalman Filter', params: [num('process', 'Process', 0.01, 0.00001, 1), num('measure', 'Measure', 0.1, 0.00001, 1)], outputs: ['value'], series: (c, p) => ({ value: TA.kalmanSeries(TA.closes(c), p.process, p.measure) }) },
};

export const OPERATORS = [
  { id: 'gt', label: 'is greater than', arity: 2 },
  { id: 'gte', label: 'is at least', arity: 2 },
  { id: 'lt', label: 'is less than', arity: 2 },
  { id: 'lte', label: 'is at most', arity: 2 },
  { id: 'crossOver', label: 'crosses above', arity: 2 },
  { id: 'crossUnder', label: 'crosses below', arity: 2 },
  { id: 'rising', label: 'is rising', arity: 1 },
  { id: 'falling', label: 'is falling', arity: 1 },
  { id: 'within', label: 'is within % of', arity: 2 },
];

export function defaultParamsFor(name) {
  const ind = INDICATORS[name];
  const out = {};
  (ind?.params || []).forEach(p => { out[p.key] = p.def; });
  return out;
}

// ── operand resolution ─────────────────────────────────────────────────────
export function operandSeries(candles, operand) {
  const n = candles.length;
  if (!operand) return new Array(n).fill(null);
  if (operand.kind === 'const') return new Array(n).fill(+operand.value || 0);
  if (operand.kind === 'price') {
    const field = operand.field || 'close';
    return candles.map(k => (field === 'hl2' ? (k.high + k.low) / 2
      : field === 'hlc3' ? (k.high + k.low + k.close) / 3
      : field === 'ohlc4' ? (k.open + k.high + k.low + k.close) / 4
      : k[field]));
  }
  const ind = INDICATORS[operand.name];
  if (!ind) return new Array(n).fill(null);
  const params = { ...defaultParamsFor(operand.name), ...(operand.params || {}) };
  const series = ind.series(candles, params);
  const key = operand.output || ind.outputs[0];
  let out = series[key] || new Array(n).fill(null);
  const offset = +operand.offset || 0;
  if (offset) out = out.map((_, i) => (i - offset >= 0 ? out[i - offset] : null));
  return out;
}

// ── condition evaluation at a single index ─────────────────────────────────
function evalConditionAt(candles, cond, i, cache) {
  const key = (o) => JSON.stringify(o);
  const get = (o) => {
    const k = key(o);
    if (!cache[k]) cache[k] = operandSeries(candles, o);
    return cache[k];
  };
  const a = get(cond.left);
  const b = cond.right != null ? get(cond.right) : null;
  const av = a[i], bv = b ? b[i] : null;
  switch (cond.op) {
    case 'gt': return av != null && bv != null && av > bv;
    case 'gte': return av != null && bv != null && av >= bv;
    case 'lt': return av != null && bv != null && av < bv;
    case 'lte': return av != null && bv != null && av <= bv;
    case 'crossOver': return av != null && bv != null && a[i - 1] != null && b[i - 1] != null && a[i - 1] <= b[i - 1] && av > bv;
    case 'crossUnder': return av != null && bv != null && a[i - 1] != null && b[i - 1] != null && a[i - 1] >= b[i - 1] && av < bv;
    case 'rising': return av != null && a[i - 1] != null && av > a[i - 1];
    case 'falling': return av != null && a[i - 1] != null && av < a[i - 1];
    case 'within': return av != null && bv != null && Math.abs(av - bv) <= Math.abs(bv) * ((+cond.tolerance || 1) / 100);
    default: return false;
  }
}

function isGroup(node) { return node && Array.isArray(node.conditions); }

export function evalGroupAt(candles, group, i, cache = {}) {
  if (!group || !group.conditions || !group.conditions.length) return false;
  const logic = group.logic === 'OR' ? 'OR' : 'AND';
  const results = group.conditions.map(child =>
    isGroup(child) ? evalGroupAt(candles, child, i, cache) : evalConditionAt(candles, child, i, cache));
  return logic === 'OR' ? results.some(Boolean) : results.every(Boolean);
}

// ── compiled strategy ──────────────────────────────────────────────────────
// Pre-resolves the series once for a given candle array, so evaluating at many
// indices (backtest) or on each tick (live) is cheap.
export function compileStrategy(strategy, candles) {
  const cache = {};
  const warm = node => {
    if (!node) return;
    if (isGroup(node)) { node.conditions.forEach(warm); return; }
    cache[JSON.stringify(node.left)] = operandSeries(candles, node.left);
    if (node.right != null) cache[JSON.stringify(node.right)] = operandSeries(candles, node.right);
  };
  warm(strategy.long);
  warm(strategy.short);
  return {
    strategy,
    candles,
    cache,
    at(i) {
      const long = evalGroupAt(candles, strategy.long, i, cache);
      const short = strategy.short ? evalGroupAt(candles, strategy.short, i, cache) : false;
      return { long, short };
    },
  };
}

// Live evaluation: compile on the current buffer and read the last closed
// candle. Returns null when there is not enough history or no signal.
export function evaluateStrategy(strategy, candles) {
  if (!strategy || !candles || candles.length < 2) return null;
  const compiled = compileStrategy(strategy, candles);
  const i = candles.length - 1;
  const { long, short } = compiled.at(i);
  if (!long && !short) return null;
  return { action: long && !short ? 'up' : short && !long ? 'down' : 'both', index: i, at: candles[i].epoch };
}

// A description of the strategy for logs/UI, e.g. "EMA(9) crosses above EMA(21)".
export function describeOperand(o) {
  if (!o) return '?';
  if (o.kind === 'const') return String(o.value);
  if (o.kind === 'price') return (o.field || 'close').toUpperCase();
  const ind = INDICATORS[o.name];
  const params = { ...defaultParamsFor(o.name), ...(o.params || {}) };
  const arg = Object.values(params).join(', ');
  const out = o.output ? `.${o.output}` : '';
  const off = o.offset ? ` [${o.offset}]` : '';
  return `${ind ? ind.label : o.name}${out}(${arg})${off}`;
}

export function describeCondition(c) {
  const op = OPERATORS.find(o => o.id === c.op) || { label: c.op };
  if (op.arity === 1) return `${describeOperand(c.left)} ${op.label}`;
  return `${describeOperand(c.left)} ${op.label} ${describeOperand(c.right)}`;
}

export function describeGroup(g, depth = 0) {
  if (!g || !g.conditions?.length) return '(empty)';
  const parts = g.conditions.map(child =>
    isGroup(child) ? `(${describeGroup(child, depth + 1)})` : describeCondition(child));
  return parts.join(g.logic === 'OR' ? ' OR ' : ' AND ');
}

export function describeStrategy(s) {
  if (!s) return '';
  const long = describeGroup(s.long);
  const short = s.short && s.short.conditions?.length ? describeGroup(s.short) : null;
  return short ? `LONG: ${long} | SHORT: ${short}` : long;
}

// ── validation ─────────────────────────────────────────────────────────────
export function validateStrategy(s) {
  const errors = [];
  if (!s) return ['No strategy'];
  if (!s.name || !s.name.trim()) errors.push('Strategy needs a name');
  if (!s.long?.conditions?.length) errors.push('Long entry needs at least one condition');
  const walk = (g, path) => {
    (g.conditions || []).forEach((child, idx) => {
      if (isGroup(child)) { walk(child, `${path}.${idx}`); return; }
      if (!child.left) errors.push(`${path}.${idx}: missing left operand`);
      const op = OPERATORS.find(o => o.id === child.op);
      if (!op) errors.push(`${path}.${idx}: unknown operator`);
      else if (op.arity === 2 && child.right == null) errors.push(`${path}.${idx}: operator needs a right operand`);
    });
  };
  walk(s.long, 'long');
  if (s.short) walk(s.short, 'short');
  return errors;
}

// ── starter templates ──────────────────────────────────────────────────────
// Every built-in starts from the same risk block: the venue-minimum stake, no
// caps, no martingale. A template is a complete, tradeable desk on its own.
function baseRisk() {
  return {
    stake: DEFAULT_STAKE, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0,
    martingale: false, martMult: 2, martSteps: 3, sizing: 'fixed',
  };
}

export function defaultStrategy() {
  return {
    id: 'ema-cross',
    name: 'EMA cross with trend filter',
    // 5s is the default: a 1000-tick import spans ~33 min on the volatility
    // indices, which is ~400 five-second candles — enough for every window.
    timeframe: '5s',
    long: {
      logic: 'AND',
      conditions: [
        { left: { kind: 'indicator', name: 'ema', params: { period: 9 } }, op: 'crossOver', right: { kind: 'indicator', name: 'ema', params: { period: 21 } } },
        { left: { kind: 'indicator', name: 'rsi', params: { period: 14 } }, op: 'gt', right: { kind: 'const', value: 50 } },
      ],
    },
    short: {
      logic: 'AND',
      conditions: [
        { left: { kind: 'indicator', name: 'ema', params: { period: 9 } }, op: 'crossUnder', right: { kind: 'indicator', name: 'ema', params: { period: 21 } } },
        { left: { kind: 'indicator', name: 'rsi', params: { period: 14 } }, op: 'lt', right: { kind: 'const', value: 50 } },
      ],
    },
    risk: baseRisk(),
    action: { type: 'rise_fall', contract: 'CALL', duration: 10, durationUnit: 't' },
  };
}

export const STRATEGY_TEMPLATES = [
  defaultStrategy,
  () => ({
    id: 'rsi-reversal', name: 'RSI reversal', timeframe: '5s',
    long: { logic: 'AND', conditions: [
      { left: { kind: 'indicator', name: 'rsi', params: { period: 14 } }, op: 'crossOver', right: { kind: 'const', value: 35 } },
      { left: { kind: 'indicator', name: 'adx', output: 'adx', params: { period: 14 } }, op: 'gt', right: { kind: 'const', value: 20 } },
    ] },
    short: { logic: 'AND', conditions: [
      { left: { kind: 'indicator', name: 'rsi', params: { period: 14 } }, op: 'crossUnder', right: { kind: 'const', value: 65 } },
      { left: { kind: 'indicator', name: 'adx', output: 'adx', params: { period: 14 } }, op: 'gt', right: { kind: 'const', value: 20 } },
    ] },
    risk: baseRisk(),
    action: { type: 'rise_fall', contract: 'CALL', duration: 10, durationUnit: 't' },
  }),
  () => ({
    id: 'bb-breakout', name: 'Bollinger breakout', timeframe: '5s',
    long: { logic: 'AND', conditions: [
      { left: { kind: 'price' }, op: 'crossOver', right: { kind: 'indicator', name: 'bb', output: 'upper', params: { period: 20, mult: 2 } } },
      { left: { kind: 'indicator', name: 'adx', output: 'adx', params: { period: 14 } }, op: 'gt', right: { kind: 'const', value: 20 } },
    ] },
    short: { logic: 'AND', conditions: [
      { left: { kind: 'price' }, op: 'crossUnder', right: { kind: 'indicator', name: 'bb', output: 'lower', params: { period: 20, mult: 2 } } },
      { left: { kind: 'indicator', name: 'adx', output: 'adx', params: { period: 14 } }, op: 'gt', right: { kind: 'const', value: 20 } },
    ] },
    risk: baseRisk(),
    action: { type: 'rise_fall', contract: 'CALL', duration: 10, durationUnit: 't' },
  }),
  () => ({
    id: 'supertrend', name: 'SuperTrend follow', timeframe: '5s',
    long: { logic: 'AND', conditions: [
      { left: { kind: 'indicator', name: 'superTrend', output: 'dir', params: { period: 10, mult: 3 } }, op: 'crossOver', right: { kind: 'const', value: 0 } },
      { left: { kind: 'indicator', name: 'adx', output: 'adx', params: { period: 14 } }, op: 'gt', right: { kind: 'const', value: 20 } },
    ] },
    short: { logic: 'AND', conditions: [
      { left: { kind: 'indicator', name: 'superTrend', output: 'dir', params: { period: 10, mult: 3 } }, op: 'crossUnder', right: { kind: 'const', value: 0 } },
      { left: { kind: 'indicator', name: 'adx', output: 'adx', params: { period: 14 } }, op: 'gt', right: { kind: 'const', value: 20 } },
    ] },
    risk: baseRisk(),
    action: { type: 'rise_fall', contract: 'CALL', duration: 10, durationUnit: 't' },
  }),
];

// ── one complete setup per indicator ───────────────────────────────────────
// Every indicator in the registry ships as a ready-to-trade strategy: a trigger
// leg that fires the entry and a nested confirmation group that filters it, with
// the indicator's canonical parameters already set. Nothing needs editing — load
// one and press Start. The trigger/confirmation split is deliberate: a single
// leg fires far too often on a fair tape, so each setup requires the indicator's
// own event *and* a second, independent reading to agree.
const ind = (name, params, output) => ({
  kind: 'indicator', name, params: params || defaultParamsFor(name), ...(output ? { output } : {}),
});
// A lagged indicator read: the value as of `offset` bars ago. Needed where a
// channel's current value already contains the bar being tested (a close can
// never exceed the current bar's own high, so a Donchian breakout must compare
// against the *prior* channel).
const lag = (operand, offset) => ({ ...operand, offset });
const price = (field = 'close') => ({ kind: 'price', field });
const konst = value => ({ kind: 'const', value });
const cond = (left, op, right) => (right == null ? { left, op } : { left, op, right });
const AND = (...conditions) => ({ logic: 'AND', conditions });
// A regime gate: only trade the oscillator when the tape is actually trending,
// not chopping. ADX > 20 is the conventional "a trend exists" line and it cuts
// the entry count on a random walk to a handful per session.
const trending = cond(ind('adx', null, 'adx'), 'gt', konst(20));
// The shared trend trigger the "character" measures gate: price crossing its own
// 21-EMA is the entry, the measure decides whether the regime favours it.
const MA_CROSS_LONG = cond(price(), 'crossOver', ind('ema', { period: 21 }));
const MA_CROSS_SHORT = cond(price(), 'crossUnder', ind('ema', { period: 21 }));

// name → { long, short }. The rule shape follows the indicator's nature: a
// moving average is crossed by price, a band is broken, an oscillator reverts
// from its extreme, a zero-line series crosses zero, a "character" measure
// (Hurst, entropy, skew) gates a directional trigger rather than giving one
// itself. Thresholds are set from each series' own distribution so a setup fires
// a handful of times per session — not never, and not on every bar.
const SETUPS = {
  sma: { long: cond(price(), 'crossOver', ind('sma')), short: cond(price(), 'crossUnder', ind('sma')) },
  ema: { long: cond(price(), 'crossOver', ind('ema')), short: cond(price(), 'crossUnder', ind('ema')) },
  wma: { long: cond(price(), 'crossOver', ind('wma')), short: cond(price(), 'crossUnder', ind('wma')) },
  dema: { long: cond(price(), 'crossOver', ind('dema')), short: cond(price(), 'crossUnder', ind('dema')) },
  tema: { long: cond(price(), 'crossOver', ind('tema')), short: cond(price(), 'crossUnder', ind('tema')) },
  hma: { long: cond(price(), 'crossOver', ind('hma')), short: cond(price(), 'crossUnder', ind('hma')) },
  vwap: { long: cond(price(), 'crossOver', ind('vwap')), short: cond(price(), 'crossUnder', ind('vwap')) },
  kalman: { long: cond(price(), 'crossOver', ind('kalman')), short: cond(price(), 'crossUnder', ind('kalman')) },

  bb: {
    long: AND(cond(price(), 'crossOver', ind('bb', null, 'upper')), trending),
    short: AND(cond(price(), 'crossUnder', ind('bb', null, 'lower')), trending),
  },
  keltner: {
    long: AND(cond(price(), 'crossOver', ind('keltner', null, 'upper')), trending),
    short: AND(cond(price(), 'crossUnder', ind('keltner', null, 'lower')), trending),
  },
  // A close can never exceed the current bar's own high, so a Donchian breakout
  // must compare against the *prior* channel (offset 1), not the current one.
  donchian: {
    long: AND(cond(price(), 'crossOver', lag(ind('donchian', null, 'upper'), 1)), trending),
    short: AND(cond(price(), 'crossUnder', lag(ind('donchian', null, 'lower'), 1)), trending),
  },
  superTrend: {
    long: cond(ind('superTrend', null, 'dir'), 'crossOver', konst(0)),
    short: cond(ind('superTrend', null, 'dir'), 'crossUnder', konst(0)),
  },
  psar: { long: cond(price(), 'crossOver', ind('psar')), short: cond(price(), 'crossUnder', ind('psar')) },
  ichimoku: {
    long: cond(ind('ichimoku', null, 'tenkan'), 'crossOver', ind('ichimoku', null, 'kijun')),
    short: cond(ind('ichimoku', null, 'tenkan'), 'crossUnder', ind('ichimoku', null, 'kijun')),
  },
  alligator: {
    long: AND(cond(ind('alligator', null, 'lips'), 'crossOver', ind('alligator', null, 'teeth')), cond(ind('alligator', null, 'teeth'), 'gt', ind('alligator', null, 'jaw'))),
    short: AND(cond(ind('alligator', null, 'lips'), 'crossUnder', ind('alligator', null, 'teeth')), cond(ind('alligator', null, 'teeth'), 'lt', ind('alligator', null, 'jaw'))),
  },
  adx: {
    long: AND(cond(ind('adx', null, 'pdi'), 'crossOver', ind('adx', null, 'ndi')), trending),
    short: AND(cond(ind('adx', null, 'ndi'), 'crossOver', ind('adx', null, 'pdi')), trending),
  },
  aroon: {
    long: cond(ind('aroon', null, 'up'), 'crossOver', ind('aroon', null, 'down')),
    short: cond(ind('aroon', null, 'down'), 'crossOver', ind('aroon', null, 'up')),
  },
  vortex: {
    long: cond(ind('vortex', null, 'plus'), 'crossOver', ind('vortex', null, 'minus')),
    short: cond(ind('vortex', null, 'minus'), 'crossOver', ind('vortex', null, 'plus')),
  },
  atr: {
    long: AND(cond(ind('atr'), 'rising'), MA_CROSS_LONG),
    short: AND(cond(ind('atr'), 'rising'), MA_CROSS_SHORT),
  },

  // Oscillators: the entry is the recovery cross out of the extreme, gated by an
  // actual trend. (Sitting at the extreme plus a rising EMA can never both be
  // true — an oversold reading *is* the down leg — so the trigger is the turn.)
  rsi: { long: AND(cond(ind('rsi'), 'crossOver', konst(35)), trending), short: AND(cond(ind('rsi'), 'crossUnder', konst(65)), trending) },
  stoch: { long: AND(cond(ind('stoch', null, 'k'), 'crossOver', konst(25)), trending), short: AND(cond(ind('stoch', null, 'k'), 'crossUnder', konst(75)), trending) },
  stochRsi: { long: AND(cond(ind('stochRsi'), 'crossOver', konst(25)), trending), short: AND(cond(ind('stochRsi'), 'crossUnder', konst(75)), trending) },
  williamsR: { long: AND(cond(ind('williamsR'), 'crossOver', konst(-75)), trending), short: AND(cond(ind('williamsR'), 'crossUnder', konst(-25)), trending) },
  cci: { long: AND(cond(ind('cci'), 'crossOver', konst(-90)), trending), short: AND(cond(ind('cci'), 'crossUnder', konst(90)), trending) },
  mfi: { long: AND(cond(ind('mfi'), 'crossOver', konst(35)), trending), short: AND(cond(ind('mfi'), 'crossUnder', konst(60)), trending) },
  fisher: { long: AND(cond(ind('fisher'), 'crossOver', konst(-0.75)), trending), short: AND(cond(ind('fisher'), 'crossUnder', konst(0.75)), trending) },
  ultimate: { long: AND(cond(ind('ultimate'), 'crossOver', konst(40)), trending), short: AND(cond(ind('ultimate'), 'crossUnder', konst(60)), trending) },

  macd: { long: cond(ind('macd', null, 'macd'), 'crossOver', ind('macd', null, 'signal')), short: cond(ind('macd', null, 'macd'), 'crossUnder', ind('macd', null, 'signal')) },
  trix: { long: cond(ind('trix'), 'crossOver', konst(0)), short: cond(ind('trix'), 'crossUnder', konst(0)) },
  roc: { long: cond(ind('roc'), 'crossOver', konst(0)), short: cond(ind('roc'), 'crossUnder', konst(0)) },
  momentum: { long: cond(ind('momentum'), 'crossOver', konst(0)), short: cond(ind('momentum'), 'crossUnder', konst(0)) },
  dpo: { long: cond(ind('dpo'), 'crossOver', konst(0)), short: cond(ind('dpo'), 'crossUnder', konst(0)) },
  awesome: { long: cond(ind('awesome'), 'crossOver', konst(0)), short: cond(ind('awesome'), 'crossUnder', konst(0)) },
  cmf: { long: cond(ind('cmf'), 'crossOver', konst(0)), short: cond(ind('cmf'), 'crossUnder', konst(0)) },
  klinger: { long: cond(ind('klinger', null, 'kvo'), 'crossOver', ind('klinger', null, 'signal')), short: cond(ind('klinger', null, 'kvo'), 'crossUnder', ind('klinger', null, 'signal')) },
  forceIndex: { long: cond(ind('forceIndex'), 'crossOver', konst(0)), short: cond(ind('forceIndex'), 'crossUnder', konst(0)) },
  eom: { long: cond(ind('eom'), 'crossOver', konst(0)), short: cond(ind('eom'), 'crossUnder', konst(0)) },
  cusum: { long: cond(ind('cusum'), 'crossOver', konst(0)), short: cond(ind('cusum'), 'crossUnder', konst(0)) },

  obv: { long: AND(MA_CROSS_LONG, cond(ind('obv'), 'rising')), short: AND(MA_CROSS_SHORT, cond(ind('obv'), 'falling')) },
  volume: { long: AND(cond(ind('volume'), 'rising'), MA_CROSS_LONG), short: AND(cond(ind('volume'), 'rising'), MA_CROSS_SHORT) },

  // "Character" measures: the indicator says the tape is in the regime the
  // trigger wants, so the trigger is the entry and the measure is the gate.
  zscore: { long: AND(cond(ind('zscore'), 'crossOver', konst(-1.5)), trending), short: AND(cond(ind('zscore'), 'crossUnder', konst(1.5)), trending) },
  efficiencyRatio: { long: AND(cond(ind('efficiencyRatio'), 'gt', konst(0.25)), MA_CROSS_LONG), short: AND(cond(ind('efficiencyRatio'), 'gt', konst(0.25)), MA_CROSS_SHORT) },
  choppiness: { long: AND(cond(ind('choppiness'), 'lt', konst(45)), MA_CROSS_LONG), short: AND(cond(ind('choppiness'), 'lt', konst(45)), MA_CROSS_SHORT) },
  hurst: { long: AND(cond(ind('hurst'), 'gt', konst(0.55)), MA_CROSS_LONG), short: AND(cond(ind('hurst'), 'gt', konst(0.55)), MA_CROSS_SHORT) },
  fractalDimension: { long: AND(cond(ind('fractalDimension'), 'lt', konst(1.4)), MA_CROSS_LONG), short: AND(cond(ind('fractalDimension'), 'lt', konst(1.4)), MA_CROSS_SHORT) },
  entropy: { long: AND(cond(ind('entropy'), 'lt', konst(0.95)), MA_CROSS_LONG), short: AND(cond(ind('entropy'), 'lt', konst(0.95)), MA_CROSS_SHORT) },
  skew: { long: AND(cond(ind('skew'), 'gt', konst(0)), MA_CROSS_LONG), short: AND(cond(ind('skew'), 'lt', konst(0)), MA_CROSS_SHORT) },
  kurtosis: { long: AND(cond(ind('kurtosis'), 'gt', konst(0)), MA_CROSS_LONG), short: AND(cond(ind('kurtosis'), 'gt', konst(0)), MA_CROSS_SHORT) },
};

// Build one complete strategy for an indicator id. A setup leg is either a bare
// condition or an AND group; both are normalised to a group so the builder tree
// is uniform. Returns null for the raw price pseudo-entry (no rule of its own).
export function indicatorStrategy(name) {
  const setup = SETUPS[name];
  const def = INDICATORS[name];
  if (!setup || !def) return null;
  const asGroup = node => (Array.isArray(node?.conditions) ? node : { logic: 'AND', conditions: [node] });
  return {
    id: `setup:${name}`,
    name: `${def.label} setup`,
    timeframe: '5s',
    long: asGroup(setup.long),
    short: asGroup(setup.short),
    risk: baseRisk(),
    action: { type: 'rise_fall', contract: 'CALL', duration: 10, durationUnit: 't' },
  };
}

// One factory per indicator, in registry order (price excluded). Factories, not
// objects, so every load hands the builder a fresh tree it can freely mutate.
export const INDICATOR_TEMPLATES = Object.keys(INDICATORS)
  .filter(name => name !== 'price')
  .map(name => () => indicatorStrategy(name));

// The builder's template menu, flat, each entry carrying its group and label so
// the dropdown renders grouped options with a stable index.
const STARTER_LABELS = ['EMA cross + trend filter', 'RSI reversal', 'Bollinger breakout', 'SuperTrend follow'];
export const TEMPLATE_MENU = [
  ...STRATEGY_TEMPLATES.map((make, i) => ({ group: 'Starters', label: STARTER_LABELS[i], make })),
  ...Object.keys(INDICATORS).filter(n => n !== 'price').map(name => ({
    group: 'Indicator setups', label: `${INDICATORS[name].label} setup`, make: () => indicatorStrategy(name),
  })),
];

// Every template as a flat factory list — the starters, then the indicator
// setups. Used by the tests and by any caller that wants them all.
export const ALL_TEMPLATES = TEMPLATE_MENU.map(e => e.make);

