// Multi-market scanner.
//
// The engine asks one question on every tick: "is there a bet worth taking,
// anywhere, right now?" The scanner answers it for all markets at once instead
// of only the one the user happens to be watching, so the strategy decides when
// and where to trade rather than waiting on a hand-picked market.
//
// It costs nothing per tick. Scores are recomputed on a fixed cadence
// (SCAN_INTERVAL_MS) in the background, not inside the tick handler, so the
// trade path itself stays as short as possible.
import { findAutoContract, accuracyParams, durationProfile } from './autoStrategies.js';

export const SCAN_INTERVAL_MS = 800;

// Best edge seen in the most recent pass, plus a rolling view for the UI.
export class MarketScanner {
  constructor({ getStore, getContractKey, getAccuracy, getCandidates }) {
    this.getStore = getStore;
    this.getContractKey = getContractKey;
    this.getAccuracy = getAccuracy;
    this.getCandidates = getCandidates;

    this.rows = new Map();     // sym -> { sym, score, conf, edge, ready, at }
    this.lastScan = 0;
    this.scans = 0;
  }

  // Even a fully cooled engine uses a capped accuracy so the ranking stays
  // comparable between markets; the trade itself still uses the user's own
  // gates, so this never loosens selectivity.
  _params(entry) {
    const err = accuracyParams('balanced');
    return {
      ...this.getAccuracy(),
      minConf: Math.min(this.getAccuracy().minConf ?? 60, 60),
      minEdge: Math.min(this.getAccuracy().minEdge ?? 0, err.minEdge),
      zMult: 1,
    };
  }

  // Recompute every market's score for the selected contract. Returns the
  // single best (or null when no market has enough history yet).
  scan() {
    const key = this.getContractKey();
    const entry = findAutoContract(key);
    if (!entry) return null;
    const store = this.getStore();
    const syms = this.getCandidates();
    const params = this._params(entry);
    const now = Date.now();

    let best = null;
    for (const sym of syms) {
      const ctx = {
        candles: store.candles[sym] || [],
        digits: store.digHist[sym] || [],
        params,
      };
      let sig = null;
      try { sig = entry.signal(ctx); } catch { sig = null; }
      const ready = entry.digitFamily
        ? (store.digHist[sym]?.length || 0) >= 80
        : (store.candles[sym]?.length || 0) >= 80;

      const score = this._score(sig, ready, ctx, entry, params);

      const row = { sym, score, conf: sig?.conf ?? null, ready, at: now };
      this.rows.set(sym, row);
      if (score > -Infinity && (!best || score > best.score)) best = row;
    }

    this.lastScan = now;
    this.scans++;
    return best;
  }

  // Rank a market for the current contract + duration. A qualifying signal is
  // lifted by how far the reading sits above its own margin, so the leader is
  // the strongest edge and not merely the first one over the line.
  _score(sig, ready, ctx, entry, params) {
    const base = entry.tune?.baseline ?? 0.5;
    const margin = (params.minConf || 60) + (params.minEdge ?? 0) * 100;
    const durMul = durationProfile(params).windowScale;
    if (sig && sig.conf != null) {
      return sig.conf + (sig.z || 0) * 2 + Math.max(0, sig.conf - margin) + durMul * 2;
    }
    if (!ready) return -Infinity;
    // No qualifying signal yet: rank by raw distance from break-even so the
    // UI still shows a leader and a switch target can be identified.
    const p = this._rawRate(ctx, entry, params);
    if (p == null) return -Infinity;
    return p * 100 + Math.max(0, p - base) * 200;
  }

  // Window hit-rate for the contract on one market, used for ranking before a
  // signal appears.
  _rawRate(ctx, entry, params = {}) {
    const W = Math.round((entry.tune?.W || 100) * durationProfile(params).windowScale);
    const usesDigits = entry.digitFamily;
    const w = usesDigits ? ctx.digits.slice(-W) : ctx.candles.slice(-W);
    if (w.length < Math.min(40, W)) return null;
    if (usesDigits) {
      const f = Array(10).fill(0);
      for (const d of w) f[d]++;
      const hit = d => (
        entry.kind === 'over' ? d > entry.barrier
          : entry.kind === 'under' ? d < entry.barrier
            : entry.kind === 'match' ? d === entry.barrier
              : entry.kind === 'diff' ? d !== entry.barrier
                : entry.kind === 'even' ? d % 2 === 0
                  : d % 2 === 1
      );
      let c = 0;
      for (let d = 0; d < 10; d++) if (hit(d)) c += f[d];
      return c / w.length;
    }
    return null;
  }

  top(n = 6) {
    return [...this.rows.values()]
      .filter(r => r.score > -Infinity)
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }

  reset() { this.rows.clear(); this.lastScan = 0; this.scans = 0; }
}