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
//     action: { contract: 'CALL', duration: 5, durationUnit: 't' }
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
    risk: {
      stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0,
      martingale: false, martMult: 2, martSteps: 3, sizing: 'fixed',
    },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  };
}

export const STRATEGY_TEMPLATES = [
  defaultStrategy,
  () => ({
    id: 'rsi-reversal', name: 'RSI reversal', timeframe: '5s',
    long: { logic: 'AND', conditions: [
      { left: { kind: 'indicator', name: 'rsi', params: { period: 14 } }, op: 'lt', right: { kind: 'const', value: 30 } },
      { left: { kind: 'price' }, op: 'gt', right: { kind: 'indicator', name: 'sma', params: { period: 20 } } },
    ] },
    short: { logic: 'AND', conditions: [
      { left: { kind: 'indicator', name: 'rsi', params: { period: 14 } }, op: 'gt', right: { kind: 'const', value: 70 } },
      { left: { kind: 'price' }, op: 'lt', right: { kind: 'indicator', name: 'sma', params: { period: 20 } } },
    ] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false, martMult: 2, martSteps: 3, sizing: 'fixed' },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
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
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false, martMult: 2, martSteps: 3, sizing: 'fixed' },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  }),
  () => ({
    id: 'supertrend', name: 'SuperTrend follow', timeframe: '5s',
    long: { logic: 'AND', conditions: [
      { left: { kind: 'indicator', name: 'superTrend', output: 'dir', params: { period: 10, mult: 3 } }, op: 'gt', right: { kind: 'const', value: 0 } },
      { left: { kind: 'indicator', name: 'ema', params: { period: 50 } }, op: 'rising' },
    ] },
    short: { logic: 'AND', conditions: [
      { left: { kind: 'indicator', name: 'superTrend', output: 'dir', params: { period: 10, mult: 3 } }, op: 'lt', right: { kind: 'const', value: 0 } },
      { left: { kind: 'indicator', name: 'ema', params: { period: 50 } }, op: 'falling' },
    ] },
    risk: { stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0, martingale: false, martMult: 2, martSteps: 3, sizing: 'fixed' },
    action: { contract: 'CALL', duration: 5, durationUnit: 't' },
  }),
];
