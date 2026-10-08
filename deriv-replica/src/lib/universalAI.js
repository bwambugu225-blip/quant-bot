// Universal AI — one evaluator over every market, every contract, every
// duration.
//
// The single-contract scanner answers "which market is best for the contract I
// picked?". This answers the broader question the trader actually asks: "of
// everything on offer right now, across all indices and all contract types, is
// there any bet whose measured win probability clears my bar?" The engine only
// places a trade when the answer is yes and the winning reading is at or above
// the minimum confidence the user set.
//
// Two honest constraints shape the design:
//   * Only contracts whose own statistics can support a high win rate can ever
//     reach a high confidence. A "Matches" bet pays ~9:1 because it wins ~10%
//     of the time; no amount of data turns that into an 80% call. The evaluator
//     therefore reports what the tape supports and nothing more — it does not
//     inflate a reading to clear the bar.
//   * Deriv's volatility indices are fair random walks, so an 80% confidence is
//     a statement about the *measured recent sample*, not a promise about the
//     next contract. The z-gate in each strategy keeps that statement anchored
//     to sample size.
import { AUTO_CONTRACTS, accuracyParams, findAutoContract } from './autoStrategies.js';
import { isDigitSymbol } from './marketStore.js';

// The bar the user asked for: a trade is taken only when the winning signal's
// confidence is at least this. It is a UI-adjustable parameter, defaulted here.
export const UNIVERSAL_MIN_CONF = 80;

// Durations the "auto duration" search tries, per unit. Deliberately short:
// the hold time is part of the question being asked, and a signal that only
// clears the bar at an exotic duration is usually noise.
const DURATION_LADDER = {
  t: [1, 2, 3, 5, 8, 13],
  s: [1, 2, 3, 5, 10],
  m: [1, 2, 3, 5],
  h: [1, 2, 3],
  d: [1, 2],
};

// The (duration, unit) pairs worth trying for one contract. Contracts with no
// duration input (Accumulators, Multipliers) get a single null entry and fall
// back to their own defaults downstream.
export function durationLadder(entry) {
  if (!(entry.inputs || []).includes('duration')) return [{ dur: null, unit: null }];
  const unit = entry.defaults?.unit || 't';
  return (DURATION_LADDER[unit] || [1, 2, 3]).map(d => ({ dur: d, unit }));
}

// Every contract the evaluator may consider. The registry is the single source
// of truth, so adding a contract there makes it reachable here automatically.
export function universalContracts() {
  return Object.values(AUTO_CONTRACTS);
}

function runSignal(entry, ctx) {
  try { return entry.signal(ctx); } catch { return null; }
}

// Signal parameters for a candidate: the strategy's own statistical gates stay
// on (so a reading must clear its z/edge bar), but the *confidence* floor is
// lifted out of the strategy and applied by the caller. That separation is what
// lets the threshold mean one thing — "at least 80%" — everywhere.
function candidateParams(entry, accuracy, dur, unit) {
  return {
    ...accuracyParams(accuracy || 'max'),
    ...entry.defaults,
    duration: dur,
    unit,
    minConf: 0,
    window: 0,
    zMin: 0,
  };
}

// Evaluate the whole universe once. Returns every qualifying candidate, best
// first. Synchronous and bounded: each candidate reuses the store's already
// built candle/digit arrays, so there is no per-candidate I/O.
export function evaluateUniversal({ store, symbols, params = {}, minConf = UNIVERSAL_MIN_CONF, limit = 24 }) {
  const entries = universalContracts();
  const out = [];

  for (const entry of entries) {
    const syms = entry.digitFamily ? symbols.filter(isDigitSymbol) : symbols;
    if (!syms.length) continue;
    const durations = durationLadder(entry);

    for (const sym of syms) {
      const candles = store.candles[sym] || [];
      const digits = entry.digitFamily ? (store.digHist[sym] || []) : [];
      const prices = store.livePrices ? store.livePrices(sym) : (store.liveBuf?.[sym] || []);
      // Every strategy needs a populated window; 80 is the floor the scanner
      // already uses, and it is below the narrowest digit window (60 ticks).
      const ready = entry.digitFamily ? digits.length >= 80
        : entry.inputs?.includes('selectedTick') ? prices.length >= 80
          : candles.length >= 80;
      if (!ready) continue;

      for (const { dur, unit } of durations) {
        const p = candidateParams(entry, params.accuracy, dur, unit);
        const sig = runSignal(entry, {
          candles, digits,
          prices: store.livePrices ? store.livePrices(sym) : (store.liveBuf?.[sym] || []),
          params: p,
        });
        if (!sig || sig.conf == null || sig.conf < minConf) continue;
        out.push({
          sym, entry, sig,
          key: entry.key,
          label: entry.label,
          family: entry.family,
          duration: dur, unit,
          conf: sig.conf,
          z: sig.z ?? 0,
          durLabel: dur != null ? `${dur}${unit}` : (entry.defaults?.duration != null ? `${entry.defaults.duration}${entry.defaults.unit || ''}` : '—'),
        });
      }
    }
  }

  out.sort((a, b) => b.conf - a.conf || b.z - a.z || a.sym.localeCompare(b.sym));
  return out.slice(0, limit);
}

// Re-confirm one candidate against the live tape. The background pass produced
// the ranking; this is what the tick handler calls, so the trade decision is
// made on the tick that printed rather than on a stale list.
export function confirmCandidate(candidate, store, accuracy, minConf = UNIVERSAL_MIN_CONF) {
  const { entry, sym } = candidate;
  const candles = store.candles[sym] || [];
  const digits = entry.digitFamily ? (store.digHist[sym] || []) : [];
  const p = candidateParams(entry, accuracy, candidate.duration, candidate.unit);
  const sig = runSignal(entry, {
    candles, digits,
    prices: store.livePrices ? store.livePrices(sym) : (store.liveBuf?.[sym] || []),
    params: p,
  });
  if (!sig || sig.conf == null || sig.conf < minConf) return null;
  return sig;
}

export { findAutoContract };
