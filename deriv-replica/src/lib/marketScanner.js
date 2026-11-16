// Multi-market scanner.
//
// Scores every eligible market for the strategy the desk is running, so the
// engine can place the trade on whichever market is strongest at that instant
// instead of idling on one hand-picked symbol. The score is the same
// expectancy-per-stake figure the auto-tuner ranks on, so "best market" and
// "best strategy" are measured the same way.
//
// Honesty rule: on Deriv's fair random-walk indices no market carries a real
// edge, so a high score is a statement about the recent sample on that market,
// not a promise about the next contract. The scanner orders candidates; the
// strategy's own entry rule still decides whether anything fires at all.
import { runBacktest } from './backtest.js';
import { scoreBacktest } from './autoTune.js';

// The scan is a background ranking, never a trade trigger on its own. It runs
// on this cadence so the hot tick path stays cheap.
export const SCAN_INTERVAL_MS = 900;

// The fewest bars a market needs before it is worth scoring.
const MIN_BARS = 30;

export function scoreMarket(strategy, bars, opts = {}) {
  if (!bars || bars.length < MIN_BARS) return { score: -Infinity, edge: 0, backtest: null };
  const r = runBacktest(strategy, bars, {
    barTicks: strategy.barSize || opts.barTicks,
    ...opts.backtest,
  });
  const { score, edge } = scoreBacktest(r, { minTrades: opts.minTrades ?? 3 });
  return { score, edge, backtest: r };
}

// Rank markets by how well the strategy would have traded each one's tape.
// `barsFor(sym)` returns the bar series for that market (timeframe candles or
// tick bars, matching what the live engine would read).
export function scanMarkets(strategy, symbols, barsFor, opts = {}) {
  return symbols
    .map(sym => {
      const bars = barsFor(sym);
      const { score, edge, backtest } = scoreMarket(strategy, bars, opts);
      return {
        sym,
        score,
        edge,
        count: backtest?.count ?? 0,
        winRate: backtest?.winRate ?? 0,
        pnl: backtest?.pnl ?? 0,
        bars: bars ? bars.length : 0,
      };
    })
    .filter(m => Number.isFinite(m.score))
    .sort((a, b) => b.score - a.score);
}
