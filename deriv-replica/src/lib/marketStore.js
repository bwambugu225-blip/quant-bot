// Market data store — ported from bot.html's tick/candle engine.
//
// Maintains per-symbol tick history, live buffers, per-timeframe candles and
// digit history, built from the same `ticks_history` + `tick` streams used by
// the original.
import { max, min } from './indicators.js';

export const SYMBOLS = [
  { sym: 'R_10', name: 'Volatility 10 Index', vol: 10, cat: 'VOL' },
  { sym: 'R_25', name: 'Volatility 25 Index', vol: 25, cat: 'VOL' },
  { sym: 'R_50', name: 'Volatility 50 Index', vol: 50, cat: 'VOL' },
  { sym: 'R_75', name: 'Volatility 75 Index', vol: 75, cat: 'VOL' },
  { sym: 'R_100', name: 'Volatility 100 Index', vol: 100, cat: 'VOL' },
  { sym: '1HZ10V', name: 'Volatility 10 (1s) Index', vol: 10, cat: 'VOL1S' },
  { sym: '1HZ25V', name: 'Volatility 25 (1s) Index', vol: 25, cat: 'VOL1S' },
  { sym: '1HZ50V', name: 'Volatility 50 (1s) Index', vol: 50, cat: 'VOL1S' },
  { sym: '1HZ75V', name: 'Volatility 75 (1s) Index', vol: 75, cat: 'VOL1S' },
  { sym: '1HZ100V', name: 'Volatility 100 (1s) Index', vol: 100, cat: 'VOL1S' },
  { sym: 'stpRNG', name: 'Step Index', vol: 10, cat: 'STEP' },
  { sym: 'RDBULL', name: 'Bull Market Index', vol: 50, cat: 'TREND' },
  { sym: 'RDBEAR', name: 'Bear Market Index', vol: 50, cat: 'TREND' },
];

export const TF_LIST = ['5s', '15s', '30s', '1m'];
export const TF = {
  '5s': { tickSize: 5, tradeTicks: 5, label: '5s' },
  '15s': { tickSize: 15, tradeTicks: 12, label: '15s' },
  '30s': { tickSize: 30, tradeTicks: 25, label: '30s' },
  '1m': { tickSize: 60, tradeTicks: 50, label: '1m' },
};

export function isDigitSymbol(sym) {
  const info = SYMBOLS.find(x => x.sym === sym);
  if (!info) return true;
  return info.cat === 'VOL' || info.cat === 'VOL1S';
}

// Authoritative pip size per symbol, from the Deriv `active_symbols` feed.
// This matters for digits: the API sends raw JSON numbers, so a real price of
// 1296.20 arrives as 1296.2. Reading the last character then returns 2 instead
// of the correct last digit 0. We therefore fix the number of decimals to the
// symbol's pip size before extracting the digit.
export const PIP_SIZE = {
  R_10: 3, R_25: 3, R_50: 4, R_75: 4, R_100: 2,
  '1HZ10V': 2, '1HZ25V': 2, '1HZ50V': 2, '1HZ75V': 2, '1HZ100V': 2,
  stpRNG: 1, stpRNG2: 1, stpRNG3: 1, stpRNG4: 1, stpRNG5: 1,
  RDBULL: 4, RDBEAR: 4,
};

export function pipSize(sym) {
  return PIP_SIZE[sym] ?? 2;
}

// Decimal places of the displayed price = pip size for these instruments.
export function decimalsFor(sym) {
  return pipSize(sym);
}

// Deriv digit = last digit of the *displayed* price at the symbol's pip
// precision (decimal point ignored).
export function digitOf(price, sym) {
  const digits = pipSize(sym);
  const v = Number(price);
  if (!Number.isFinite(v)) return 0;
  const s = Math.abs(v).toFixed(digits).replace('.', '');
  return s ? parseInt(s.slice(-1), 10) : 0;
}

export function bucketTicks(times, prices, tickSize) {
  const len = Math.min(times.length, prices.length);
  const candles = [];
  let bucket = [];
  for (let i = 0; i < len; i++) {
    const epochSec = +times[i];
    const price = +prices[i];
    if (!Number.isFinite(epochSec) || !Number.isFinite(price)) continue;
    bucket.push({ epoch: epochSec, price });
    if (bucket.length >= tickSize) {
      const ps = bucket.map(b => b.price);
      candles.push({
        epoch: bucket[bucket.length - 1].epoch,
        open: bucket[0].price,
        high: max(ps),
        low: min(ps),
        close: bucket[bucket.length - 1].price,
        ticks: bucket.length,
      });
      bucket = [];
    }
  }
  return candles;
}

export class MarketStore {
  constructor() {
    this.candles = {};       // selected TF, per symbol
    this.prices = {};
    this.tickBuf = {};
    this.tickSubs = {};      // subscription id -> symbol
    this.digHist = {};       // per symbol digit history
    this.liveBuf = {};       // per symbol rolling price buffer
    this.lastPrice = {};
    this.tickPrices = {};
    this._byTf = {};
    TF_LIST.forEach(tk => { this._byTf[tk] = { candles: {}, prices: {}, tickBuf: {} }; });
    this.history = {};       // full tick history { times, prices } per symbol
  }

  setSelectedTf(tf) {
    this.selectedTf = tf;
    const cfg = this._byTf[tf];
    this.candles = cfg.candles;
    this.prices = cfg.prices;
    this.tickBuf = cfg.tickBuf;
  }

  onHistory(sym, times, prices) {
    if (!sym || !times?.length || !prices?.length) return;
    this.history[sym] = { times, prices };
    for (let i = 0; i < Math.min(times.length, prices.length); i++) {
      const p = +prices[i];
      if (Number.isFinite(p)) this.pushDigit(sym, p);
    }
    TF_LIST.forEach(tk => {
      const cfg = this._byTf[tk];
      const candles = bucketTicks(times, prices, TF[tk].tickSize).slice(-200);
      cfg.candles[sym] = candles;
      cfg.prices[sym] = candles.map(c => c.close);
      cfg.tickBuf[sym] = [];
    });
    // keep selected-TF references pointed at the freshly built arrays
    this.setSelectedTf(this.selectedTf || '5s');
  }

  onTick(sym, price, epoch) {
    this.pushDigit(sym, price);
    const lb = (this.liveBuf[sym] = this.liveBuf[sym] || []);
    lb.push(price); if (lb.length > 120) lb.shift();
    this.lastPrice[sym] = price;

    let closed = null;
    for (const tk of TF_LIST) {
      const isSel = tk === (this.selectedTf || '5s');
      const cfg = this._byTf[tk];
      const candleArr = isSel ? this.candles : cfg.candles;
      const bufArr = isSel ? this.tickBuf : cfg.tickBuf;
      let buf = bufArr[sym];
      if (!buf) bufArr[sym] = buf = [];
      buf.push(price);
      if (buf.length >= TF[tk].tickSize) {
        const candle = { epoch, open: buf[0] || price, high: max(buf), low: min(buf), close: price, ticks: buf.length };
        let candles = candleArr[sym];
        if (!candles) candleArr[sym] = candles = [];
        candles.push(candle);
        if (candles.length > 200) candles.shift();
        bufArr[sym] = [];
        cfg.prices[sym] = candles.map(c => c.close);
        if (isSel) {
          closed = candle;
          const tp = (this.tickPrices[sym] = this.tickPrices[sym] || []);
          tp.push(...buf);
          if (tp.length > 80) tp.splice(0, tp.length - 60);
        }
      }
    }
    return closed;
  }

  pushDigit(sym, price) {
    const d = digitOf(price, sym);
    const h = (this.digHist[sym] = this.digHist[sym] || []);
    h.push(d);
    if (h.length > 1000) h.shift();
    return d;
  }

  lastDigit(sym) {
    const h = this.digHist[sym];
    return h && h.length ? h[h.length - 1] : 0;
  }

  // Returns a fresh copy so consumers keyed on the array identity (e.g. the
  // chart's useMemo) recompute on every tick instead of seeing a mutated array.
  livePrices(sym) { return (this.liveBuf[sym] || []).slice(); }
}
