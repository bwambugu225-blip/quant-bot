// Synthesises Deriv-style volatility-index tick streams so the replica behaves
// like a live feed without a real connection.

export const SYMBOLS = [
  { symbol: 'R_10', display: 'Volatility 10 Index', base: 6421.35, vol: 0.10 },
  { symbol: 'R_25', display: 'Volatility 25 Index', base: 2841.62, vol: 0.25 },
  { symbol: 'R_50', display: 'Volatility 50 Index', base: 234.5671, vol: 0.50 },
  { symbol: 'R_75', display: 'Volatility 75 Index', base: 4218.904, vol: 0.75 },
  { symbol: 'R_100', display: 'Volatility 100 Index', base: 1583.42, vol: 1.0 },
];

const decimalsFor = base => (base < 10 ? 4 : base < 1000 ? 2 : 2);

export function createMarket(symbolDef) {
  const decimals = decimalsFor(symbolDef.base);
  let price = symbolDef.base;
  const ticks = [];
  const now = Date.now();

  for (let i = 220; i >= 0; i--) {
    price = step(price, symbolDef.vol, decimals);
    ticks.push({ epoch: now - i * 1000, quote: price });
  }

  function next() {
    price = step(price, symbolDef.vol, decimals);
    ticks.push({ epoch: Date.now(), quote: price });
    if (ticks.length > 600) ticks.shift();
    return ticks[ticks.length - 1];
  }

  return {
    symbol: symbolDef.symbol,
    display: symbolDef.display,
    decimals,
    ticks,
    next,
    last: () => ticks[ticks.length - 1],
    lastDigit: () => lastDigit(ticks[ticks.length - 1]?.quote, decimals),
    pipSize: decimals,
  };
}

function step(price, vol, decimals) {
  const sigma = price * vol * 0.00012;
  const drift = (Math.random() - 0.5) * 2 * sigma;
  const next = Math.max(0.0001, price + drift);
  return +next.toFixed(decimals);
}

export function lastDigit(quote, decimals) {
  if (quote == null) return 0;
  const s = quote.toFixed(decimals);
  const d = s.replace(/[^0-9]/g, '');
  return Number(d[d.length - 1]);
}

export function digitDistribution(market) {
  const counts = new Array(10).fill(0);
  const window = market.ticks.slice(-100);
  window.forEach(t => {
    counts[lastDigit(t.quote, market.decimals)] += 1;
  });
  const total = window.length || 1;
  const dist = counts.map(c => (c / total) * 100);
  return { counts, dist, total: window.length, min: Math.min(...counts), max: Math.max(...counts) };
}

export function payoutFor(stake, tradeType) {
  const table = {
    rise_fall: 0.94,
    digit_over: 0.93,
    digit_under: 0.9,
    digit_match: 8.5,
    digit_diff: 0.11,
  };
  return +(stake * (1 + (table[tradeType] ?? 0.9))).toFixed(2);
}

export function formatMoney(v, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(v) || 0);
}

// Deriv renders amounts as "10.00 USD" (value + spaced code), not via Intl
// currency style, so keep a dedicated formatter for that convention.
export function addComma(value, decimals = 2) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Digit-based payouts follow real Deriv odds rather than a flat multiplier:
// matches ~11% of digit outcomes, differs ~90%, over/under 5/9 vs 4/9.
export function digitPayout(stake, subId, digit, isOver) {
  let multiplier;
  if (subId === 'match_diff') multiplier = 1 / 0.1;
  else if (subId === 'even_odd') multiplier = 1 / 0.5;
  else if (subId === 'over_under') multiplier = digit == null ? 2 : 1 / (isOver ? (9 - digit) / 10 : (digit + 1) / 10);
  else multiplier = 1.94;
  return +(stake * multiplier).toFixed(2);
}

export function formatPrice(v, decimals) {
  return Number(v).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
