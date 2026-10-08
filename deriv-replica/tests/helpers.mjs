// Shared fixtures for the engine/strategy suite.
//
// Tests must exercise the real code paths, so nothing here is mocked for its
// own sake: the generators produce deterministic tick streams, and the fake
// client is only a stand-in for the WebSocket boundary (send/buy), which cannot
// exist in CI.
import { Engine } from '../src/lib/engine.js';
import { SYMBOLS, isDigitSymbol } from '../src/lib/marketStore.js';
import { AUTO_CONTRACTS, findAutoContract } from '../src/lib/autoStrategies.js';

// Deterministic PRNG so a failure is always reproducible.
export function lcg(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

// Digit stream where `rate` of the digits satisfy `pred`, and the rest do not.
// Digits are drawn per-pool so the per-digit distribution stays sane for the
// match/diff contracts as well as the over/under ones.
export function digitStream(pred, rate, n, seed) {
  const r = lcg(seed);
  const all = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const yes = all.filter(pred);
  const no = all.filter(d => !pred(d));
  const out = [];
  for (let i = 0; i < n; i++) {
    const pool = r() < rate ? yes : no;
    out.push(pool[Math.floor(r() * pool.length)]);
  }
  return out;
}

export const PREDS = {
  over: b => d => d > b,
  under: b => d => d < b,
  match: b => d => d === b,
  diff: b => d => d !== b,
  even: () => d => d % 2 === 0,
  odd: () => d => d % 2 === 1,
};

export function predFor(entry) {
  if (entry.kind === 'even') return PREDS.even();
  if (entry.kind === 'odd') return PREDS.odd();
  if (entry.kind === 'over') return PREDS.over(entry.barrier);
  if (entry.kind === 'under') return PREDS.under(entry.barrier);
  if (entry.kind === 'match') return PREDS.match(entry.barrier);
  return PREDS.diff(entry.barrier);
}

// ── directional candle regimes ───────────────────────────────────────────
export function trend(dir, n = 200, seed = 3) {
  const r = lcg(seed); const out = []; let px = 1000;
  for (let i = 0; i < n; i++) {
    px += dir * 0.0011 * px + (r() - 0.5) * 0.0003 * px;
    const pb = i >= n - 4 ? -dir * 0.0008 * px : 0;
    out.push({ open: px, high: px * 1.0002, low: px * 0.9998, close: px + pb, ticks: 5 });
  }
  return out;
}

export function vol(expand, n = 140, seed = 5) {
  const r = lcg(seed); const out = []; let px = 1000;
  for (let i = 0; i < n; i++) {
    const w = i > n - 16 ? (expand ? 0.006 : 0.00012) : 0.001;
    px += (r() - 0.5) * 2 * w * px;
    out.push({ open: px, high: px * (1 + w), low: px * (1 - w), close: px, ticks: 5 });
  }
  return out;
}

export function quiet(n = 140, seed = 4) {
  const r = lcg(seed); const out = []; let px = 1000;
  for (let i = 0; i < n; i++) {
    px += (r() - 0.5) * 0.02;
    out.push({ open: px, high: px + 0.015, low: px - 0.015, close: px, ticks: 5 });
  }
  return out;
}

export function pullback(dir, n = 200, seed = 9) {
  const r = lcg(seed); const out = []; let px = 1000;
  for (let i = 0; i < n; i++) {
    if (i < n - 6) px += dir * 0.0008 * px + (r() - 0.5) * 0.0003 * px;
    else px -= dir * 0.0008 * px;
    out.push({ open: px, high: px * 1.0002, low: px * 0.9998, close: px, ticks: 5 });
  }
  return out;
}

// Correct market context for a contract, so every contract is tested in the
// regime it is meant to trade rather than only in the easy direction. For digit
// contracts the stream rate is derived from the contract's own break-even, so a
// high-baseline contract (e.g. "Over 0") gets a correspondingly stronger tape.
export function ctxFor(entry, seed = 1, rate) {
  if (entry.digitFamily) {
    // Only Ups / Only Downs need a tape whose values run in one direction, so
    // consecutive digits actually form a run. All other digit contracts are
    // tested on a stream biased toward their own hit predicate.
    if (entry.key === 'RUNHIGH' || entry.key === 'RUNLOW') {
      return { digits: runTape(entry.key === 'RUNHIGH', seed), candles: [] };
    }
    const base = entry.tune?.baseline ?? 0.85;
    const r = rate ?? Math.min(0.99, base + 0.15);
    return { digits: digitStream(predFor(entry), r, 900, seed * 31 + 7), candles: [] };
  }
  switch (entry.key) {
    case 'ACCU': return { digits: [], candles: quiet(140, seed) };
    case 'ONETOUCH': return { digits: [], candles: vol(true, 140, seed) };
    case 'NOTOUCH': return { digits: [], candles: vol(false, 140, seed) };
    // Path/endpoint range contracts: a narrow, steady market holds the band.
    case 'RANGE': return { digits: [], candles: quiet(200, seed) };
    case 'EXPIRYRANGE': return { digits: [], candles: quiet(200, seed) };
    // Their mirrors need an expanding market that breaches the band.
    case 'UPORDOWN': return { digits: [], candles: vol(true, 200, seed) };
    case 'EXPIRYMISS': return { digits: [], candles: vol(true, 200, seed) };
    // Asian fade: a strong burst away from the mean so the fade has room.
    case 'ASIANU': return { digits: [], candles: [], prices: asianSpike(-1, seed) };
    case 'ASIAND': return { digits: [], candles: [], prices: asianSpike(1, seed) };
    // High/Low tick: a persisting drift puts the extreme at one end of the window.
    case 'TICKHIGH': case 'TICKLOW': return { digits: [], candles: [], prices: driftTape(seed) };
    // Lookbacks pay on range expansion.
    case 'LBFLOATCALL': case 'LBFLOATPUT': case 'LBHIGHLOW':
      return { digits: [], candles: vol(true, 200, seed) };
    case 'MULTUP': case 'MULTDOWN':
      return { digits: [], candles: pullback(entry.side === 'down' ? -1 : 1, 200, seed) };
    default:
      return { digits: [], candles: trend(entry.side === 'down' ? -1 : 1, 200, seed) };
  }
}

// A price tape that rises then drops hard (dir=+1) or falls then spikes
// (dir=-1), so the last tick sits far from the running mean.
export function asianSpike(dir, seed = 1) {
  const r = lcg(seed); const out = []; let px = 1000;
  for (let i = 0; i < 200; i++) {
    px += (dir > 0 ? 1 : -1) * 0.02 + (r() - 0.5) * 0.05;
    if (i > 180) px += (dir > 0 ? 1 : -1) * 2.5;   // sharp displacement at the end
    out.push(px);
  }
  return out;
}

// A price tape with positive autocorrelation: each move tends to continue the
// previous one, so the extreme lands late (High) / early (Low) in a 5-tick
// window.
export function driftTape(seed = 1) {
  const r = lcg(seed); const out = []; let px = 1000; let last = 0;
  for (let i = 0; i < 200; i++) {
    const step = (last > 0 ? 0.6 : last < 0 ? -0.6 : 0) + (r() - 0.5) * 0.4;
    last = step;
    px += step;
    out.push(px);
  }
  return out;
}

// A digit tape with a strong directional drift, so consecutive digits form
// long runs. `up` produces strictly increasing digits, `down` decreasing ones.
export function runTape(up, seed = 1) {
  const r = lcg(seed); const out = []; let d = up ? 0 : 9;
  for (let i = 0; i < 900; i++) {
    // Mostly step in the run direction; rarely step back, as a real run breaks.
    const step = r() < 0.9 ? (up ? 1 : -1) : (up ? -1 : 1);
    d = Math.max(0, Math.min(9, d + step));
    if (d === 0 || d === 9) d = up ? 1 : 8;   // stay mid-band so comparisons vary
    out.push(d);
  }
  return out;
}

// ── fake WebSocket client ────────────────────────────────────────────────
// Only the socket boundary is faked. Everything above it (engine routing,
// strategy, proposal construction, buy) is the real code under test.
export class FakeClient {
  constructor() {
    this.auth = true;
    this.balance = 1000;
    this.accountId = 'VRTC1';
    this.accountType = 'demo';
    this.ws = { readyState: 1 };
    this.sent = [];
    this.buys = [];
    this._listeners = {};
  }
  on(evt, fn) { (this._listeners[evt] = this._listeners[evt] || []).push(fn); return this; }
  emit(evt, ...a) { (this._listeners[evt] || []).forEach(fn => fn(...a)); }
  send(obj) { this.sent.push(obj); return true; }
  buy(id, price) { this.buys.push({ id, price }); return true; }
  proposals() { return this.sent.filter(o => o.proposal); }
}

// Engine wired to a fake client, with digit history seeded for every eligible
// market so the scanner has a universe to rank.
export function makeEngine({ contractKey = 'DIGITOVER:3', digits = 300, leader = 'R_75', leaderRate = 0.88 } = {}) {
  const client = new FakeClient();
  const engine = new Engine();
  engine.attach(client);
  engine.autoContractKey = contractKey;

  const entry = findAutoContract(contractKey) || AUTO_CONTRACTS.CALL;
  if (entry.digitFamily) {
    const pred = predFor(entry);
    for (const s of SYMBOLS.filter(x => isDigitSymbol(x.sym))) {
      const rate = s.sym === leader ? leaderRate : 0.5;
      engine.store.digHist[s.sym] = digitStream(pred, rate, digits, 500 + s.sym.length * 7);
    }
  } else {
    // Directional fixture: give every market the regime this contract wants.
    for (const s of SYMBOLS) {
      const ctx = ctxFor(entry, 3);
      engine.store.candles[s.sym] = ctx.candles;
      engine.store.digHist[s.sym] = digitStream(d => d >= 0, 0.5, digits, 900 + s.sym.length);
    }
  }
  return { engine, client };
}

// Feed one tick into the engine's real message path.
export function tick(engine, sym, price, epoch = Math.floor(Date.now() / 1000)) {
  engine._onTick({ tick: { symbol: sym, quote: price, epoch } });
}