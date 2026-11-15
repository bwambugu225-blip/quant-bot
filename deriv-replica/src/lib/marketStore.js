// Market data store.
//
// Imports a 1000-tick history per symbol from Deriv's `ticks_history` stream and
// aggregates it into time-based candles across every supported timeframe:
// 5s / 10s / 15s / 30s, then 1m through 15m. Live `tick` messages extend the
// same buffers, so the last candle of each timeframe updates in place and a new
// one opens on the timeframe boundary.
import { max, min } from './indicators.js';
import { SYMBOLS, pipSize, digitOf } from './symbols.js';

export { SYMBOLS };

// Seconds per timeframe. Order is the display order in the UI.
export const TIMEFRAMES = [
  { id: '5s', sec: 5, label: '5s' },
  { id: '10s', sec: 10, label: '10s' },
  { id: '15s', sec: 15, label: '15s' },
  { id: '30s', sec: 30, label: '30s' },
  { id: '1m', sec: 60, label: '1m' },
  { id: '2m', sec: 120, label: '2m' },
  { id: '3m', sec: 180, label: '3m' },
  { id: '4m', sec: 240, label: '4m' },
  { id: '5m', sec: 300, label: '5m' },
  { id: '6m', sec: 360, label: '6m' },
  { id: '7m', sec: 420, label: '7m' },
  { id: '8m', sec: 480, label: '8m' },
  { id: '9m', sec: 540, label: '9m' },
  { id: '10m', sec: 600, label: '10m' },
  { id: '11m', sec: 660, label: '11m' },
  { id: '12m', sec: 720, label: '12m' },
  { id: '13m', sec: 780, label: '13m' },
  { id: '14m', sec: 840, label: '14m' },
  { id: '15m', sec: 900, label: '15m' },
];

export const TF_IDS = TIMEFRAMES.map(t => t.id);
export const TF_SEC = Object.fromEntries(TIMEFRAMES.map(t => [t.id, t.sec]));

export const IMPORT_TICKS = 1000;
const MAX_CANDLES = 600;
const MAX_TICKS = 5000;

// Bucket raw ticks into time-based candles. A tick belongs to the bucket whose
// start is its epoch floored to the timeframe length; the candle's timestamp is
// that bucket start, so aggregation is stable regardless of tick density.
export function bucketTicks(times, prices, sec) {
  const len = Math.min(times.length, prices.length);
  const candles = [];
  let cur = null;
  for (let i = 0; i < len; i++) {
    const t = Math.floor(+times[i]);
    const p = +prices[i];
    if (!Number.isFinite(t) || !Number.isFinite(p)) continue;
    const start = t - (t % sec);
    if (!cur || start !== cur.epoch) {
      if (cur) candles.push(cur);
      cur = { epoch: start, open: p, high: p, low: p, close: p, ticks: 1, volume: 1 };
    } else {
      cur.high = Math.max(cur.high, p);
      cur.low = Math.min(cur.low, p);
      cur.close = p;
      cur.ticks++;
      cur.volume = cur.ticks;
    }
  }
  if (cur) candles.push(cur);
  return candles;
}

export class MarketStore {
  constructor() {
    this.symbols = {};
    // { sym: { times:[], prices:[], candles:{ tf: [] }, live:[], digits:[] } }
    this.selectedTf = '5s';
    this.listeners = {};
  }

  on(evt, fn) { (this.listeners[evt] = this.listeners[evt] || []).push(fn); return this; }
  emit(evt, ...a) { (this.listeners[evt] || []).forEach(fn => { try { fn(...a); } catch (e) { console.error(e); } }); }

  _sym(sym) {
    if (!this.symbols[sym]) {
      this.symbols[sym] = {
        times: [], prices: [], candles: {}, live: [], digits: [], last: null, lastEpoch: null,
      };
      TIMEFRAMES.forEach(t => { this.symbols[sym].candles[t.id] = []; });
    }
    return this.symbols[sym];
  }

  setTimeframe(tf) {
    if (TF_SEC[tf]) this.selectedTf = tf;
    this.emit('timeframe', this.selectedTf);
  }

  // Seed a symbol from a `ticks_history` response (1000 ticks) or replace an
  // existing buffer with a fresher window. Rebuilds every timeframe's candles.
  onHistory(sym, times, prices) {
    if (!sym || !times?.length || !prices?.length) return;
    const s = this._sym(sym);
    const n = Math.min(times.length, prices.length);
    s.times = times.slice(0, n).map(Number);
    s.prices = prices.slice(0, n).map(Number);
    if (s.times.length > MAX_TICKS) {
      s.times = s.times.slice(-MAX_TICKS);
      s.prices = s.prices.slice(-MAX_TICKS);
    }
    s.digits = s.prices.map(p => digitOf(p, sym));
    s.last = s.prices[s.prices.length - 1] ?? null;
    s.lastEpoch = s.times[s.times.length - 1] ?? null;
    s.live = s.prices.slice(-200);
    TIMEFRAMES.forEach(t => {
      s.candles[t.id] = bucketTicks(s.times, s.prices, t.sec).slice(-MAX_CANDLES);
    });
    this.emit('history', sym);
  }

  // Fold a live tick into every timeframe. Returns the symbol's latest price.
  onTick(sym, price, epoch) {
    const s = this._sym(sym);
    const t = Math.floor(+epoch);
    const p = +price;
    if (!Number.isFinite(t) || !Number.isFinite(p)) return null;
    s.times.push(t);
    s.prices.push(p);
    if (s.times.length > MAX_TICKS) { s.times.shift(); s.prices.shift(); }
    s.digits.push(digitOf(p, sym));
    if (s.digits.length > MAX_TICKS) s.digits.shift();
    s.last = p;
    s.lastEpoch = t;
    s.live.push(p);
    if (s.live.length > 200) s.live.shift();

    TIMEFRAMES.forEach(tf => {
      const arr = s.candles[tf.id];
      const start = t - (t % tf.sec);
      const last = arr[arr.length - 1];
      if (last && last.epoch === start) {
        last.high = Math.max(last.high, p);
        last.low = Math.min(last.low, p);
        last.close = p;
        last.ticks++;
        last.volume = last.ticks;
      } else {
        arr.push({ epoch: start, open: p, high: p, low: p, close: p, ticks: 1, volume: 1 });
        if (arr.length > MAX_CANDLES) arr.shift();
      }
    });
    return p;
  }

  candles(sym, tf) {
    const s = this.symbols[sym];
    if (!s) return [];
    return s.candles[tf || this.selectedTf] || [];
  }

  ticks(sym) {
    const s = this.symbols[sym];
    return s ? { times: s.times.slice(), prices: s.prices.slice() } : { times: [], prices: [] };
  }

  digits(sym) {
    const s = this.symbols[sym];
    return s ? s.digits.slice() : [];
  }

  lastPrice(sym) {
    const s = this.symbols[sym];
    return s ? s.last : null;
  }

  lastDigit(sym) {
    const s = this.symbols[sym];
    return s && s.digits.length ? s.digits[s.digits.length - 1] : null;
  }

  livePrices(sym) {
    const s = this.symbols[sym];
    return s ? s.live.slice() : [];
  }

  // Number of ticks imported for a symbol — the UI shows this so "1000 ticks"
  // is a measurement, not a claim.
  tickCount(sym) {
    const s = this.symbols[sym];
    return s ? s.times.length : 0;
  }
}
