// SmartCharts' chartData.activeSymbols expects the legacy Deriv v3 payload
// (symbol/display_name/market_display_name/submarket_display_name/pip/…). The
// current public endpoint returns the newer shape
// (underlying_symbol/underlying_symbol_name/pip_size/…), so map it here. A
// missing submarket_display_name is fatal: SmartCharts sorts the list with
// `.localeCompare` and throws when it is undefined.

const MARKET_NAMES = {
  synthetic_index: 'Synthetic Indices',
  indices: 'Stock Indices',
  forex: 'Forex',
  commodities: 'Commodities',
  cryptocurrency: 'Cryptocurrencies',
  basket_index: 'Baskets',
};

const SUBGROUP_NAMES = {
  synthetics: 'Continuous Indices',
  baskets: 'Baskets',
};

// SmartCharts never displays these (the trader has its own selector), but every
// row needs a defined label so its sort and search stay safe. Slugs not listed
// fall back to a title-cased version of the slug.
const SUBMARKET_NAMES = {
  random_index: 'Continuous Indices',
  random_daily: 'Daily Reset Indices',
  crash_index: 'Crash/Boom Indices',
  jump_index: 'Jump Indices',
  range_index: 'Range Break Indices',
  step_index: 'Step Indices',
  forex_basket: 'Forex Basket',
  commodity_basket: 'Commodity Basket',
  major_pairs: 'Major Pairs',
  minor_pairs: 'Minor Pairs',
  smart_forex: 'Smart Forex',
  metals: 'Metals',
  energy: 'Energy',
  non_stable_coin: 'Cryptocurrencies',
  americas: 'Americas',
  americas_OTC: 'Americas OTC',
  asia_oceania: 'Asia/Oceania',
  asia_oceania_OTC: 'Asia/Oceania OTC',
  europe: 'Europe',
  europe_OTC: 'Europe OTC',
};

const titleCase = slug =>
  String(slug || '')
    .replace(/_OTC$/, ' OTC')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();

export function toLegacySymbol(s = {}) {
  const symbol = s.underlying_symbol || s.symbol;
  const pip = s.pip_size != null ? s.pip_size : s.pip;
  return {
    symbol,
    display_name: s.underlying_symbol_name || s.display_name || symbol,
    market: s.market,
    market_display_name: MARKET_NAMES[s.market] || titleCase(s.market),
    subgroup: s.subgroup === 'none' ? undefined : s.subgroup,
    subgroup_display_name: SUBGROUP_NAMES[s.subgroup] || titleCase(s.subgroup),
    submarket_display_name: SUBMARKET_NAMES[s.submarket] || titleCase(s.submarket),
    exchange_is_open: !!s.exchange_is_open,
    pip,
    // SmartCharts computes display precision as `pip.toString().length - 2`.
    decimal_places: pip != null ? String(pip).length - 2 : 2,
  };
}

export function toLegacySymbols(list) {
  return (Array.isArray(list) ? list : []).map(toLegacySymbol);
}

// SmartCharts only needs per-symbol open/closed state to gate its feed. The
// active-symbols payload already carries it, so derive tradingTimes from there
// and keep the trading_times request as a refinement for precise open/close.
export function toChartTradingTimes(ttRes) {
  const out = {};
  ttRes?.trading_times?.markets?.forEach(market => {
    market.submarkets?.forEach(sub => {
      sub.symbols?.forEach(s => {
        const symbol = s.underlying_symbol || s.symbol;
        if (!symbol) return;
        const { open = [], close = [] } = s.times || {};
        const closedAllDay = open.length === 1 && open[0] === '--';
        let isOpen = true;
        if (closedAllDay) isOpen = false;
        else if (open[0] && close[0]) {
          const dateStr = new Date().toISOString().substring(0, 11);
          const openTime = `${dateStr}${open[0]}Z`;
          const closeTime = `${dateStr}${close[0]}Z`;
          isOpen = new Date() >= new Date(openTime) && new Date() < new Date(closeTime);
        }
        out[symbol] = { isOpen, openTime: '', closeTime: '' };
      });
    });
  });
  return out;
}
