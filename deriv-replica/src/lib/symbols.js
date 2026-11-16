// Instrument catalogue.
//
// The terminal works with Deriv's synthetic indices (where tick history is
// continuous and the API is the only source) plus the forex/crypto/commodity
// pairs Deriv offers. `pip` is the number of decimals used to render a price
// and, for digit contracts, to extract the last digit. The values match Deriv's
// published `pip_size` for the synthetic indices; for the real-market pairs the
// store refines them from `active_symbols` when the feed connects.

export const SYMBOL_GROUPS = [
  { id: 'synthetic', label: 'Synthetic Indices' },
  { id: 'forex', label: 'Forex' },
  { id: 'crypto', label: 'Cryptocurrencies' },
  { id: 'commodity', label: 'Commodities' },
];

export const SYMBOLS = [
  // ── Synthetic indices ──────────────────────────────────────────────────
  { sym: 'R_10', name: 'Volatility 10 Index', pip: 3, group: 'synthetic', ticks: '2s' },
  { sym: 'R_25', name: 'Volatility 25 Index', pip: 3, group: 'synthetic', ticks: '2s' },
  { sym: 'R_50', name: 'Volatility 50 Index', pip: 4, group: 'synthetic', ticks: '2s' },
  { sym: 'R_75', name: 'Volatility 75 Index', pip: 4, group: 'synthetic', ticks: '2s' },
  { sym: 'R_100', name: 'Volatility 100 Index', pip: 2, group: 'synthetic', ticks: '2s' },
  { sym: '1HZ10V', name: 'Volatility 10 (1s) Index', pip: 2, group: 'synthetic', ticks: '1s' },
  { sym: '1HZ25V', name: 'Volatility 25 (1s) Index', pip: 2, group: 'synthetic', ticks: '1s' },
  { sym: '1HZ50V', name: 'Volatility 50 (1s) Index', pip: 2, group: 'synthetic', ticks: '1s' },
  { sym: '1HZ75V', name: 'Volatility 75 (1s) Index', pip: 2, group: 'synthetic', ticks: '1s' },
  { sym: '1HZ100V', name: 'Volatility 100 (1s) Index', pip: 2, group: 'synthetic', ticks: '1s' },
  { sym: 'stpRNG', name: 'Step Index', pip: 1, group: 'synthetic', ticks: '1s' },
  { sym: 'RDBULL', name: 'Bull Market Index', pip: 4, group: 'synthetic', ticks: '2s' },
  { sym: 'RDBEAR', name: 'Bear Market Index', pip: 4, group: 'synthetic', ticks: '2s' },
  { sym: 'JD10', name: 'Jump 10 Index', pip: 3, group: 'synthetic', ticks: '1s' },
  { sym: 'JD25', name: 'Jump 25 Index', pip: 3, group: 'synthetic', ticks: '1s' },
  { sym: 'JD50', name: 'Jump 50 Index', pip: 4, group: 'synthetic', ticks: '1s' },
  { sym: 'JD75', name: 'Jump 75 Index', pip: 4, group: 'synthetic', ticks: '1s' },
  { sym: 'JD100', name: 'Jump 100 Index', pip: 2, group: 'synthetic', ticks: '1s' },
  // ── Forex ──────────────────────────────────────────────────────────────
  { sym: 'frxEURUSD', name: 'EUR/USD', pip: 5, group: 'forex', ticks: 'stream' },
  { sym: 'frxGBPUSD', name: 'GBP/USD', pip: 5, group: 'forex', ticks: 'stream' },
  { sym: 'frxUSDJPY', name: 'USD/JPY', pip: 3, group: 'forex', ticks: 'stream' },
  { sym: 'frxAUDUSD', name: 'AUD/USD', pip: 5, group: 'forex', ticks: 'stream' },
  { sym: 'frxUSDCAD', name: 'USD/CAD', pip: 5, group: 'forex', ticks: 'stream' },
  { sym: 'frxUSDCHF', name: 'USD/CHF', pip: 5, group: 'forex', ticks: 'stream' },
  { sym: 'frxEURGBP', name: 'EUR/GBP', pip: 5, group: 'forex', ticks: 'stream' },
  // ── Crypto ─────────────────────────────────────────────────────────────
  { sym: 'cryBTCUSD', name: 'BTC/USD', pip: 2, group: 'crypto', ticks: 'stream' },
  { sym: 'cryETHUSD', name: 'ETH/USD', pip: 2, group: 'crypto', ticks: 'stream' },
  // ── Commodities ────────────────────────────────────────────────────────
  { sym: 'frxXAUUSD', name: 'Gold/USD', pip: 2, group: 'commodity', ticks: 'stream' },
  { sym: 'frxXAGUSD', name: 'Silver/USD', pip: 3, group: 'commodity', ticks: 'stream' },
];

const BY_SYM = new Map(SYMBOLS.map(s => [s.sym, s]));

export function symbolInfo(sym) {
  return BY_SYM.get(sym) || { sym, name: sym, pip: 2, group: 'synthetic' };
}

export function pipSize(sym) {
  return symbolInfo(sym).pip ?? 2;
}

export function decimalsFor(sym) {
  return pipSize(sym);
}

// Deriv digit = last digit of the displayed price at the symbol's pip precision
// (decimal point ignored). The API sends raw JSON numbers, so 1296.20 arrives as
// 1296.2; formatting to the pip size first keeps the digit correct.
export function digitOf(price, sym) {
  const digits = pipSize(sym);
  const v = Number(price);
  if (!Number.isFinite(v)) return 0;
  const s = Math.abs(v).toFixed(digits).replace('.', '');
  return s ? parseInt(s.slice(-1), 10) : 0;
}

// Digit contracts (Matches/Differs, Over/Under, Even/Odd) are only offered on
// the synthetic indices whose last digit is a meaningful, exchange-priced digit.
export function isDigitSymbol(sym) {
  return symbolInfo(sym).group === 'synthetic';
}

// The symbol's normal tick interval in seconds, read from the `ticks` field of
// the catalogue. The 1s indices tick every second, the classic volatility and
// jump indices every two, and the real-market pairs stream without a fixed
// cadence — those fall back to 1, which makes activity a per-tick measure.
export function tickSeconds(sym) {
  const raw = symbolInfo(sym).ticks;
  const m = typeof raw === 'string' && /^(\d+(?:\.\d+)?)s$/.exec(raw);
  return m ? Number(m[1]) : 1;
}

export function defaultSymbol() {
  return 'R_75';
}
