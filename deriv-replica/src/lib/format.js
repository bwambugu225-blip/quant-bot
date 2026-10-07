// Small shared formatting helpers. Deriv renders amounts as "10.00 USD"
// (value + spaced code), not via Intl currency style, so keep a dedicated
// formatter for that convention.
export function addComma(value, decimals = 2) {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatMoney(v, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(v) || 0);
}
