// Shared fixtures. The generators produce deterministic tapes so a failure is
// always reproducible; the fake client stands in only for the WebSocket
// boundary (send/buy), which cannot exist in CI. Engine routing, the store,
// indicators, the strategy builder and the backtester are the real code.
import { Engine } from '../src/lib/engine.js';

// Deterministic PRNG.
export function lcg(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

// A tick tape: { times: [], prices: [] } with `n` ticks, one per second.
export function tickTape(n = 1000, seed = 1, drift = 0, vol = 0.0008) {
  const r = lcg(seed);
  const times = [];
  const prices = [];
  let px = 1000;
  const t0 = 1_700_000_000;
  for (let i = 0; i < n; i++) {
    px += drift * px + (r() - 0.5) * 2 * vol * px;
    times.push(t0 + i);
    prices.push(+px.toFixed(5));
  }
  return { times, prices };
}

// A digit stream where `rate` of the digits satisfy `pred`.
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

// A directional candle series with an optional trend.
export function candles(n = 200, seed = 3, drift = 0, vol = 0.0011) {
  const r = lcg(seed);
  const out = [];
  let px = 1000;
  for (let i = 0; i < n; i++) {
    px += drift * px + (r() - 0.5) * 2 * vol * px;
    const o = px, c = px + (r() - 0.5) * vol * px;
    out.push({ epoch: 1_700_000_000 + i * 60, open: o, high: Math.max(o, c) * 1.0002, low: Math.min(o, c) * 0.9998, close: c, ticks: 5, volume: 5 });
  }
  return out;
}

// Fake DerivClient: only `send`/`buy` are stubbed. `send` records proposals and
// replies as the engine's proposal router expects when `autoRespond` is on.
export class FakeClient {
  constructor() {
    this.handlers = {};
    this.sent = [];
    this.auth = true;
    this.accountId = 'VRTC1';
    this.accountType = 'demo';
    this.balance = 1000;
    this.bought = [];
    this.autoRespond = false;
  }

  on(evt, fn) { (this.handlers[evt] = this.handlers[evt] || []).push(fn); return this; }
  emit(evt, ...a) { (this.handlers[evt] || []).forEach(fn => fn(...a)); }

  send(obj) {
    this.sent.push(obj);
    if (this.autoRespond && obj.proposal) {
      Promise.resolve().then(() => {
        this.emit('message', { msg_type: 'proposal', proposal: { id: 'P1', ask_price: obj.amount } });
      });
    }
    return true;
  }

  buy(id, price) { this.bought.push({ id, price }); return true; }
  requestContractsFor(symbol, cb) { Promise.resolve().then(() => cb({ contracts_for: { available: [] } })); return 1; }
  requestPayout(fields, cb) { cb({ payout: 1.95, askPrice: 1 }); return 1; }
  requestHistory() { return 1; }
  forgetHistory() {}
  connectMarket() {}
  close() { this.auth = false; }
}

export function makeEngine() {
  const engine = new Engine();
  const client = new FakeClient();
  engine.attach(client);
  return { engine, client };
}

// Push a tape into the engine as a history response.
export function loadTape(engine, sym, tape) {
  engine._onHistory({ echo_req: { ticks_history: sym }, history: { times: tape.times, prices: tape.prices } });
}

// Feed a live tick to the engine.
export function tick(engine, sym, price, epoch) {
  engine._onTick({ tick: { symbol: sym, quote: price, epoch } });
}
