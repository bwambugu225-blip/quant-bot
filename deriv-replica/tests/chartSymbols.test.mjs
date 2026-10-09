import test from 'node:test';
import assert from 'node:assert/strict';
import { toLegacySymbol, toLegacySymbols, toChartTradingTimes } from '../src/lib/chartSymbols.js';

// The current public endpoint returns underlying_symbol/pip_size/…, while the
// bundled SmartCharts sorts on submarket_display_name. A missing name throws
// `Cannot read properties of undefined (reading 'localeCompare')` at mount, so
// the mapping has to guarantee every field SmartCharts reads.

test('maps the new active-symbols shape onto the legacy SmartCharts shape', () => {
  const out = toLegacySymbol({
    underlying_symbol: 'R_10',
    underlying_symbol_name: 'Volatility 10 Index',
    market: 'synthetic_index',
    submarket: 'random_index',
    subgroup: 'synthetics',
    pip_size: 0.001,
    exchange_is_open: 1,
  });
  assert.equal(out.symbol, 'R_10');
  assert.equal(out.display_name, 'Volatility 10 Index');
  assert.equal(out.market_display_name, 'Synthetic Indices');
  assert.equal(out.submarket_display_name, 'Continuous Indices');
  assert.equal(out.exchange_is_open, true);
  // SmartCharts derives precision as pip.toString().length - 2.
  assert.equal(out.pip, 0.001);
  assert.equal(out.decimal_places, 3);
});

test('never leaves a label undefined so localeCompare cannot throw', () => {
  for (const s of toLegacySymbols([
    { underlying_symbol: 'X', market: 'unknown_mkt', submarket: 'mystery_sub', subgroup: 'none', pip_size: 0.1 },
    { underlying_symbol: 'Y', market: 'indices', submarket: 'americas_OTC', pip_size: 0.01 },
  ])) {
    assert.equal(typeof s.submarket_display_name, 'string');
    assert.ok(s.submarket_display_name.length > 0);
    assert.equal(typeof s.market_display_name, 'string');
    assert.doesNotThrow(() => s.submarket_display_name.localeCompare(s.submarket_display_name));
  }
});

test('tolerates an empty or malformed list', () => {
  assert.deepEqual(toLegacySymbols(undefined), []);
  assert.deepEqual(toLegacySymbols(null), []);
  assert.deepEqual(toLegacySymbols([]), []);
});

test('trading times map uses underlying_symbol and reports closed days', () => {
  const out = toChartTradingTimes({
    trading_times: {
      markets: [{
        submarkets: [{ symbols: [
          { underlying_symbol: 'R_10', times: { open: ['00:00:00'], close: ['23:59:59'] } },
          { underlying_symbol: 'frxX', times: { open: ['--'], close: ['--'] } },
        ] }],
      }],
    },
  });
  assert.ok('R_10' in out);
  assert.equal(out.frxX.isOpen, false);
});
