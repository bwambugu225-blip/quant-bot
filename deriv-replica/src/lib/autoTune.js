// Auto-tuner.
//
// Builds a rule template for every indicator in the registry, using that
// indicator's own tuned defaults, then backtests the whole set (plus a small
// parameter grid around the best few) over the imported tape and returns them
// ranked. `Start bot` calls this and trades the winner instead of whatever
// template happened to be loaded.
//
// Honesty rule: on Deriv's fair random-walk indices no rule has a real edge, so
// the tuner requires a minimum number of trades and a positive expectancy before
// it will crown a winner. If nothing clears the bar it says so and the caller
// keeps the loaded strategy rather than pretending a noisy backtest is a signal.
import { INDICATORS, defaultParamsFor } from './strategyBuilder.js';
import { runBacktest } from './backtest.js';
import { DEFAULT_STAKE } from './format.js';

// Default trading cadence: 10 ticks, expressed as fixed-tick-count bars so the
// signal is a statement about 10 completed ticks, not about the clock.
export const DEFAULT_BAR_SIZE = 10;

const risk = () => ({
  stake: DEFAULT_STAKE, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0,
  martingale: false, martMult: 2, martSteps: 3, sizing: 'fixed',
});

const ind = (name, params, output) => ({
  kind: 'indicator', name, params: params || defaultParamsFor(name), ...(output ? { output } : {}),
});
const price = (field = 'close') => ({ kind: 'price', field });
const konst = value => ({ kind: 'const', value });
const AND = (...conditions) => ({ logic: 'AND', conditions });
const OR = (...conditions) => ({ logic: 'OR', conditions });

const cond = (left, op, right) => (right == null ? { left, op } : { left, op, right });

// ── indicator kind map ─────────────────────────────────────────────────────
// Drives which rule shape (and parameter grid) each indicator gets.
const KIND = {
  sma: 'ma', ema: 'ma', wma: 'ma', dema: 'ma', tema: 'ma', hma: 'ma', kalman: 'ma', vwap: 'ma',
  alligator: 'alligator', ichimoku: 'ichimoku',
  bb: 'band', keltner: 'band', donchian: 'band',
  superTrend: 'dir', psar: 'psar', adx: 'adx', aroon: 'aroon', vortex: 'vortex', atr: 'atrBreak',
  rsi: 'osc', stoch: 'osc', stochRsi: 'osc', williamsR: 'willr', cci: 'osc', mfi: 'osc', fisher: 'osc', ultimate: 'osc',
  macd: 'cross0', roc: 'cross0', momentum: 'cross0', trix: 'cross0', dpo: 'cross0', awesome: 'cross0',
  cmf: 'cross0', klinger: 'cross0', forceIndex: 'cross0', eom: 'cross0', cusum: 'cross0',
  obv: 'slope', volume: 'slope',
  zscore: 'zscore', efficiencyRatio: 'er', choppiness: 'chop',
  hurst: 'hurst', fractalDimension: 'fd', entropy: 'entropy', skew: 'skew', kurtosis: 'kurt',
};

// Parameter grids per kind. Small on purpose — enough to find a better setting
// than the default without turning the tuner into a data-mining exercise.
const GRID = {
  ma: [10, 20, 50],
  osc: [7, 14, 21],
  willr: [14],
  band: [20],
  zscore: [20, 30],
  slope: [0],
  alligator: [0],
  ichimoku: [0],
  dir: [0], psar: [0], adx: [0], aroon: [0], vortex: [0], atrBreak: [14],
  cross0: [0],
  er: [20], chop: [14], hurst: [64], fd: [32], entropy: [32], skew: [20], kurtosis: [20],
};

// A grid over the indicator's first (primary) param.
function variants(name) {
  const kind = KIND[name] || 'generic';
  const grid = GRID[kind] || [0];
  const ind0 = INDICATORS[name];
  const primary = ind0?.params?.[0];
  if (!primary || grid.length <= 1 || grid[0] === 0) return [defaultParamsFor(name)];
  return grid.map(v => ({ ...defaultParamsFor(name), [primary.key]: v }));
}

// The long/short rule pair for one indicator at one parameter set.
function rulePair(name, params) {
  const kind = KIND[name] || 'generic';
  const v = (output) => ind(name, params, output);
  switch (kind) {
    case 'ma':
      return {
        long: AND(cond(price(), 'crossOver', v())),
        short: AND(cond(price(), 'crossUnder', v())),
      };
    case 'band':
      return {
        long: AND(cond(price(), 'crossOver', v('upper'))),
        short: AND(cond(price(), 'crossUnder', v('lower'))),
      };
    case 'dir':
      return {
        long: AND(cond(v('dir'), 'gt', konst(0))),
        short: AND(cond(v('dir'), 'lt', konst(0))),
      };
    case 'psar':
      return {
        long: AND(cond(price(), 'gt', v())),
        short: AND(cond(price(), 'lt', v())),
      };
    case 'adx':
      return {
        long: AND(cond(v('pdi'), 'gt', v('ndi')), cond(v('adx'), 'gt', konst(20))),
        short: AND(cond(v('ndi'), 'gt', v('pdi')), cond(v('adx'), 'gt', konst(20))),
      };
    case 'aroon':
      return {
        long: AND(cond(v('up'), 'gt', v('down')), cond(v('up'), 'gt', konst(70))),
        short: AND(cond(v('down'), 'gt', v('up')), cond(v('down'), 'gt', konst(70))),
      };
    case 'vortex':
      return {
        long: AND(cond(v('plus'), 'gt', v('minus'))),
        short: AND(cond(v('minus'), 'gt', v('plus'))),
      };
    case 'atrBreak':
      // Volatility expansion in the direction of the bar: ATR rising and price
      // on the strong side of its own EMA.
      return {
        long: AND(cond(v(), 'rising'), cond(price(), 'gt', ind('ema', { period: 21 }))),
        short: AND(cond(v(), 'rising'), cond(price(), 'lt', ind('ema', { period: 21 }))),
      };
    case 'alligator':
      return {
        long: AND(cond(v('lips'), 'gt', v('teeth')), cond(v('teeth'), 'gt', v('jaw'))),
        short: AND(cond(v('lips'), 'lt', v('teeth')), cond(v('teeth'), 'lt', v('jaw'))),
      };
    case 'ichimoku':
      return {
        long: AND(cond(v('tenkan'), 'gt', v('kijun')), cond(price(), 'gt', v('senkouA'))),
        short: AND(cond(v('tenkan'), 'lt', v('kijun')), cond(price(), 'lt', v('senkouB'))),
      };
    case 'osc':
      return {
        long: AND(cond(v(), 'lt', konst(30))),
        short: AND(cond(v(), 'gt', konst(70))),
      };
    case 'willr':
      return {
        long: AND(cond(v(), 'lt', konst(-80))),
        short: AND(cond(v(), 'gt', konst(-20))),
      };
    case 'cross0':
      return {
        long: AND(cond(v(), 'crossOver', konst(0))),
        short: AND(cond(v(), 'crossUnder', konst(0))),
      };
    case 'slope':
      return {
        long: AND(cond(v(), 'rising')),
        short: AND(cond(v(), 'falling')),
      };
    case 'zscore':
      return {
        long: AND(cond(v(), 'lt', konst(-2))),
        short: AND(cond(v(), 'gt', konst(2))),
      };
    case 'er':
      return {
        long: AND(cond(v(), 'gt', konst(0.3)), cond(price(), 'rising')),
        short: AND(cond(v(), 'gt', konst(0.3)), cond(price(), 'falling')),
      };
    case 'chop':
      return {
        long: AND(cond(v(), 'lt', konst(38)), cond(price(), 'rising')),
        short: AND(cond(v(), 'lt', konst(38)), cond(price(), 'falling')),
      };
    case 'hurst':
      return {
        long: AND(cond(v(), 'gt', konst(0.55)), cond(ind('ema', { period: 21 }), 'rising')),
        short: AND(cond(v(), 'gt', konst(0.55)), cond(ind('ema', { period: 21 }), 'falling')),
      };
    case 'fd':
      return {
        long: AND(cond(v(), 'lt', konst(1.45)), cond(price(), 'rising')),
        short: AND(cond(v(), 'lt', konst(1.45)), cond(price(), 'falling')),
      };
    case 'entropy':
      return {
        long: AND(cond(v(), 'lt', konst(2.2)), cond(ind('ema', { period: 21 }), 'rising')),
        short: AND(cond(v(), 'lt', konst(2.2)), cond(ind('ema', { period: 21 }), 'falling')),
      };
    case 'skew':
      return {
        long: AND(cond(v(), 'gt', konst(0.5))),
        short: AND(cond(v(), 'lt', konst(-0.5))),
      };
    case 'kurt':
      return {
        long: AND(cond(v(), 'gt', konst(3)), cond(price(), 'rising')),
        short: AND(cond(v(), 'gt', konst(3)), cond(price(), 'falling')),
      };
    default:
      return null;
  }
}

// Every indicator's candidate strategies at its tuned params and grid variants.
// `price` is excluded: it is the raw price-field pseudo-entry, not an indicator.
export function indicatorTemplates(barSize = DEFAULT_BAR_SIZE) {
  const out = [];
  for (const name of Object.keys(INDICATORS)) {
    if (name === 'price') continue;
    for (const params of variants(name)) {
      const pair = rulePair(name, params);
      if (!pair) continue;
      out.push({
        id: `tune:${name}:${JSON.stringify(params)}`,
        name: `${INDICATORS[name].label} ${JSON.stringify(params)}`,
        indicator: name,
        barSize,
        timeframe: '5s',
        long: pair.long,
        short: pair.short,
        risk: risk(),
        action: { contract: 'CALL', duration: barSize, durationUnit: 't' },
      });
    }
  }
  return out;
}

// ── scoring ────────────────────────────────────────────────────────────────
export function scoreBacktest(r, { minTrades = 5 } = {}) {
  if (!r || r.error || (r.count || 0) < minTrades) return { score: -Infinity, edge: 0 };
  const stake = r.trades[0]?.stake || DEFAULT_STAKE;
  const edge = r.expectancy / Math.max(0.01, stake);        // per-trade return on stake
  const pf = Number.isFinite(r.profitFactor) ? r.profitFactor : 3;
  const ddPenalty = r.maxDrawdown / Math.max(1, r.startEquity);
  const score = edge * 100 + (pf - 1) * 5 - ddPenalty * 25 + Math.min(r.count, 60) * 0.05;
  return { score, edge };
}

// Rank a set of strategies over a candle series. `candlesFor(strategy)` lets
// the caller supply the right bar source (timeframe candles or tick bars).
export function rankStrategies(strategies, candlesFor, opts = {}) {
  const minTrades = opts.minTrades ?? 5;
  return strategies
    .map(s => {
      const bars = candlesFor(s);
      if (!bars || bars.length < 30) return null;
      const r = runBacktest(s, bars, { barTicks: s.barSize || opts.barTicks, ...opts.backtest });
      const { score, edge } = scoreBacktest(r, { minTrades });
      return { strategy: s, backtest: r, score, edge };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

// The full auto-tune: build every template, rank them, then report the winner.
// A candidate is only crowned if it actually made money over the sample — a
// positive expectancy and a positive score. On a fair tape nothing qualifies and
// `best` is null, which is the honest answer.
export function autoTune(candlesFor, opts = {}) {
  const barSize = opts.barSize ?? DEFAULT_BAR_SIZE;
  const candidates = indicatorTemplates(barSize);
  const ranked = rankStrategies(candidates, candlesFor, opts);
  const top = ranked[0];
  const best = top && top.score > 0 && top.edge > 0 ? top : null;
  return {
    best,
    ranked: ranked.slice(0, 12),
    evaluated: candidates.length,
  };
}
