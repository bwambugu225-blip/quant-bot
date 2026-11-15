// Backtester.
//
// Runs a compiled strategy across a historical candle series and simulates the
// outcome of each entry using the entry and exit closes. It is intentionally
// the same strategy object the live engine trades, evaluated through the same
// `compileStrategy`, so what the builder measures is what the bot runs.
//
// Model: a directional (CALL/PUT) contract. Entry is the close of the signal
// candle; the exit is the close `holdCandles` later, where `holdCandles` is the
// contract duration expressed in candles of the chosen timeframe. A win pays
// `stake * payoutRatio`, a loss costs the stake. This is a close-to-close proxy
// for a tick contract — honest about being an approximation, and useful for
// comparing strategies on the same tape.
import { compileStrategy } from './strategyBuilder.js';
import { TF_SEC } from './marketStore.js';

// How many candles of `tf` a duration of `value`/`unit` spans. Tick units are
// treated as one candle per tick (the tightest available proxy).
export function holdCandles(tf, value, unit) {
  const sec = TF_SEC[tf] || 60;
  if (unit === 't') return Math.max(1, Math.round(value));
  if (unit === 's') return Math.max(1, Math.round(value / sec));
  if (unit === 'm') return Math.max(1, Math.round((value * 60) / sec));
  if (unit === 'h') return Math.max(1, Math.round((value * 3600) / sec));
  if (unit === 'd') return Math.max(1, Math.round((value * 86400) / sec));
  return Math.max(1, Math.round(value));
}

export function runBacktest(strategy, candles, opts = {}) {
  const payoutRatio = opts.payoutRatio ?? 0.95;
  const startEquity = opts.startEquity ?? 1000;
  const risk = { ...strategy.risk };
  const hold = holdCandles(strategy.timeframe || opts.timeframe || '1m', strategy.action?.duration ?? 5, strategy.action?.durationUnit || 't');

  const compiled = compileStrategy(strategy, candles);
  const trades = [];
  let equity = startEquity;
  let peak = equity;
  let maxDD = 0;
  let martSteps = 0;
  let consLoss = 0;
  let stopped = false;
  let i = Math.max(2, opts.warmup ?? 2);

  while (i < candles.length - hold && !stopped) {
    const { long, short } = compiled.at(i);
    if (!long && !short) { i++; continue; }
    const side = long && !short ? 'up' : short && !long ? 'down' : null;
    if (!side) { i++; continue; }

    // Stake ladder (martingale), capped the same way the live engine caps it.
    let stake = risk.stake;
    if (risk.martingale && martSteps > 0) {
      const steps = Math.min(martSteps, Math.max(1, risk.martSteps || 6));
      stake = +(risk.stake * Math.pow(Math.max(1.1, Math.min(5, risk.martMult || 2)), steps)).toFixed(2);
    }

    const entry = candles[i].close;
    const exit = candles[i + hold].close;
    const won = side === 'up' ? exit > entry : exit < entry;
    const profit = won ? +(stake * payoutRatio).toFixed(2) : -stake;
    equity = +(equity + profit).toFixed(2);
    peak = Math.max(peak, equity);
    maxDD = Math.max(maxDD, peak - equity);

    trades.push({
      i, time: candles[i].epoch, side, entry, exit, stake, profit, won, equity,
      hold, reason: 'signal',
    });

    if (won) { martSteps = 0; consLoss = 0; }
    else { consLoss++; if (risk.martingale) martSteps++; }

    if (risk.takeProfit > 0 && equity - startEquity >= risk.takeProfit) stopped = true;
    if (risk.stopLoss > 0 && startEquity - equity >= risk.stopLoss) stopped = true;
    if (risk.maxTrades > 0 && trades.length >= risk.maxTrades) stopped = true;
    if (risk.maxLosses > 0 && consLoss >= risk.maxLosses) stopped = true;

    // Avoid stacking overlapping positions on the same window.
    i += hold;
  }

  const wins = trades.filter(t => t.won).length;
  const losses = trades.length - wins;
  const grossWin = trades.filter(t => t.won).reduce((a, t) => a + t.profit, 0);
  const grossLoss = Math.abs(trades.filter(t => !t.won).reduce((a, t) => a + t.profit, 0));
  const returns = trades.map(t => t.profit / startEquity);
  const meanRet = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const sd = returns.length > 1
    ? Math.sqrt(returns.reduce((a, r) => a + (r - meanRet) ** 2, 0) / returns.length)
    : 0;

  return {
    trades,
    count: trades.length,
    wins, losses,
    winRate: trades.length ? wins / trades.length : 0,
    pnl: +(equity - startEquity).toFixed(2),
    equity,
    startEquity,
    maxDrawdown: +maxDD.toFixed(2),
    profitFactor: grossLoss ? +(grossWin / grossLoss).toFixed(2) : (grossWin ? Infinity : 0),
    expectancy: trades.length ? +(trades.reduce((a, t) => a + t.profit, 0) / trades.length).toFixed(4) : 0,
    sharpe: sd ? +((meanRet / sd) * Math.sqrt(trades.length)).toFixed(2) : 0,
    hold,
    stopped,
  };
}
