// Small shared formatting helpers.
//
// The terminal presents money in Kenyan shillings. Two cases:
//   • A figure already denominated in KES (a stake, a backtest result) formats
//     as-is with `kes`.
//   • A figure the exchange quotes in the account's own currency (balance,
//     contract P&L) goes through `money(v, accountCurrency)`, which converts a
//     non-KES account to KES for display.
// The trade dock asks Deriv for a KES proposal, so its payout is already KES.
export const CURRENCY = 'KES';

// USD→KES display rate, used only to present a non-KES account in shillings.
// Update when it drifts.
export const USD_KES = 130;

// The venue's minimum stake, and the terminal's default everywhere a stake is
// entered.
export const DEFAULT_STAKE = 0.35;

export function addComma(value, decimals = 2) {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// A USD amount expressed in KES.
export function toKes(v) {
  return Number(v || 0) * USD_KES;
}

// Format an amount that is already denominated in KES. The sign, if negative,
// leads the code ("-KES 12.50") so a caller can prefix '+' for gains.
export function kes(v) {
  const n = Number(v || 0);
  return `${n < 0 ? '-' : ''}${CURRENCY} ${addComma(Math.abs(n))}`;
}

// Format an amount quoted in `accountCurrency`, presenting it in KES. A KES
// account is shown as-is; any other account is treated as USD and converted.
export function money(v, accountCurrency = CURRENCY) {
  return kes(accountCurrency === CURRENCY ? v : toKes(v));
}

export function formatMoney(v, currency = CURRENCY) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(v) || 0);
}

// A form-field label that names the currency, e.g. "Stake (KES)".
export function stakeLabel(text = 'Stake') {
  return `${text} (${CURRENCY})`;
}
