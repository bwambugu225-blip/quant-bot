// Market data store.
//
// Imports a 1000-tick history per symbol from Deriv's `ticks_history` stream and
// aggregates it into time-based candles across every supported timeframe:
// 5s / 10s / 15s / 30s, then 1m through 15m. Live `tick` messages extend the
// same buffers, so the last candle of each timeframe updates in place and a new
// one opens on the timeframe boundary.
import { SYMBOLS, digitOf, tickSeconds } from './symbols.js';
import { tickMoves, moveUnit, tickVolume, tickVolumes } from './volume.js';

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

// Fixed-tick-count bars. Instead of a clock, the bucket closes after `size`
// ticks, so a bar's width measures market activity rather than elapsed time.
// Comparing a setup on time bars against the same setup on tick bars shows
// whether it is driven by the clock or by how much the tape actually moved.
//
// Every bar holds the same number of ticks, so its `volume` is the sum of those
// ticks' calculated volume — it varies with how much the tape moved, which is
// exactly the difference between a busy and a quiet bar that a tick count alone
// cannot express.
export const TICK_BAR_SIZES = [10, 25, 50, 100, 200];

export function bucketTicksByCount(times, prices, size, sym) {
  const n = Math.min(times.length, prices.length);
  const candles = [];
  const vols = tickVolumes(prices.slice(0, n), times.slice(0, n), sym);
  let cur = null;
  let count = 0;
  for (let i = 0; i < n; i++) {
    const t = Math.floor(+times[i]);
    const p = +prices[i];
    if (!Number.isFinite(t) || !Number.isFinite(p)) continue;
    const v = vols[i] ?? 0;
    if (!cur || count === 0) {
      if (cur) candles.push(cur);
      cur = { epoch: t, open: p, high: p, low: p, close: p, ticks: 1, volume: v };
      count = size - 1;
    } else {
      cur.high = Math.max(cur.high, p);
      cur.low = Math.min(cur.low, p);
      cur.close = p;
      cur.ticks++;
      cur.volume += v;
      count--;
    }
  }
  if (cur) candles.push(cur);
  return candles;
}

// Bucket raw ticks into time-based candles. A tick belongs to the bucket whose
// start is its epoch floored to the timeframe length; the candle's timestamp is
// that bucket start, so aggregation is stable regardless of tick density.
//
// `volume` is calculated volume (see volume.js), not a tick count: a candle's
// volume is the sum of its ticks' move-weighted activity, so a bar built from
// small moves carries less than one built from the same number of large moves.
// `ticks` stays the raw count so the two are always separately visible.
export function bucketTicks(times, prices, sec, sym) {
  const len = Math.min(times.length, prices.length);
  const candles = [];
  const vols = tickVolumes(prices.slice(0, len), times.slice(0, len), sym);
  let cur = null;
  for (let i = 0; i < len; i++) {
    const t = Math.floor(+times[i]);
    const p = +prices[i];
    if (!Number.isFinite(t) || !Number.isFinite(p)) continue;
    const v = vols[i] ?? 0;
    const start = t - (t % sec);
    if (!cur || start !== cur.epoch) {
      if (cur) candles.push(cur);
      cur = { epoch: start, open: p, high: p, low: p, close: p, ticks: 1, volume: v };
    } else {
      cur.high = Math.max(cur.high, p);
      cur.low = Math.min(cur.low, p);
      cur.close = p;
      cur.ticks++;
      cur.volume += v;
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
        times: [], prices: [], candles: {}, tickbars: {}, live: [], digits: [], last: null, lastEpoch: null,
        unit: null, unitAt: 0,
      };
      TIMEFRAMES.forEach(t => { this.symbols[sym].candles[t.id] = []; });
      TICK_BAR_SIZES.forEach(n => { this.symbols[sym].tickbars[n] = []; });
    }
    return this.symbols[sym];
  }

  // Re-measure the symbol's typical move from its recent tape. Cheap enough to
  // run on the live path, but not every tick — the median of a few hundred moves
  // barely changes tick to tick, so it is refreshed on a count and on each
  // history seed.
  _refreshUnit(s, sym) {
    const tail = s.prices.slice(-500);
    s.unit = moveUnit(tickMoves(tail), sym);
    s.unitAt = s.prices.length;
  }

  // Calculated volume for the newest tick, given the previous price and time.
  _liveVolume(s, sym, p, t) {
    const cadence = tickSeconds(sym);
    if (s.last == null || s.unit == null) return { volume: 0, activity: 1 };
    const dt = s.lastEpoch != null ? t - s.lastEpoch : cadence;
    const move = Math.abs(p - s.last);
    return { volume: tickVolume(move, dt, s.unit, cadence), activity: Math.max(1, dt / cadence) };
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
    this._refreshUnit(s, sym);
    TIMEFRAMES.forEach(t => {
      s.candles[t.id] = bucketTicks(s.times, s.prices, t.sec, sym).slice(-MAX_CANDLES);
    });
    TICK_BAR_SIZES.forEach(n => {
      s.tickbars[n] = bucketTicksByCount(s.times, s.prices, n, sym).slice(-MAX_CANDLES);
    });
    this.emit('history', sym);
  }

  // Fold a live tick into every timeframe. Returns the symbol's latest price.
  onTick(sym, price, epoch) {
    const s = this._sym(sym);
    const t = Math.floor(+epoch);
    const p = +price;
    if (!Number.isFinite(t) || !Number.isFinite(p)) return null;
    // Measure the tick before `s.last` moves on. The unit is refreshed
    // periodically so a shift in volatility is tracked without a median per tick.
    if (s.unit == null || s.prices.length - s.unitAt >= 250) this._refreshUnit(s, sym);
    const { volume, activity } = this._liveVolume(s, sym, p, t);
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
        last.volume += volume;
        last.activity += activity;
      } else {
        arr.push({ epoch: start, open: p, high: p, low: p, close: p, ticks: 1, volume, activity });
        if (arr.length > MAX_CANDLES) arr.shift();
      }
    });
    TICK_BAR_SIZES.forEach(n => {
      const arr = s.tickbars[n];
      const last = arr[arr.length - 1];
      if (last && last.ticks < n) {
        last.high = Math.max(last.high, p);
        last.low = Math.min(last.low, p);
        last.close = p;
        last.ticks++;
        last.volume += volume;
        last.activity += activity;
      } else {
        arr.push({ epoch: t, open: p, high: p, low: p, close: p, ticks: 1, volume, activity });
        if (arr.length > MAX_CANDLES) arr.shift();
      }
    });
    return p;
  }

  // Returns a fresh array each call so React sees a new reference when a tick
  // has folded into the buffer. The in-progress (last) candle is cloned too,
  // because onTick mutates it in place — without the clone React would keep
  // rendering the frozen object it first saw.
  candles(sym, tf) {
    const s = this.symbols[sym];
    if (!s) return [];
    const arr = s.candles[tf || this.selectedTf] || [];
    const out = arr.slice();
    if (out.length) out[out.length - 1] = { ...out[out.length - 1] };
    return out;
  }

  // Fixed-tick-count bars for a symbol, cloned like `candles`.
  tickBars(sym, size) {
    const s = this.symbols[sym];
    if (!s) return [];
    const arr = s.tickbars[size] || [];
    const out = arr.slice();
    if (out.length) out[out.length - 1] = { ...out[out.length - 1] };
    return out;
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

  // First price of the imported window — the reference for a session change.
  openPrice(sym) {
    const s = this.symbols[sym];
    return s && s.prices.length ? s.prices[0] : null;
  }

  lastDigit(sym) {
    const s = this.symbols[sym];
    return s && s.digits.length ? s.digits[s.digits.length - 1] : null;
  }

  livePrices(sym) {
    const s = this.symbols[sym];
    return s ? s.live.slice() : [];
  }

  // The symbol's current typical move (the volume model's scale), in price
  // units. Exposed so the analytics column can show what "one unit of volume"
  // means for the selected market rather than an unexplained number.
  moveUnit(sym) {
    const s = this.symbols[sym];
    return s ? s.unit : null;
  }

  // Number of ticks imported for a symbol — the UI shows this so "1000 ticks"
  // is a measurement, not a claim.
  tickCount(sym) {
    const s = this.symbols[sym];
    return s ? s.times.length : 0;
  }
}
