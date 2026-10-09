// Fiat on/off-ramp hand-off.
//
// Deposits and withdrawals leave this app and continue on abepayy.com, the
// external payment portal configured for it. We build the destination with the
// action and (when we know them) the account + amount so the portal can open
// on the right flow, and open it in a new tab so the trader stays put.
//
// The portal reads its parameters from the query string; unknown parameters are
// ignored, so the same URL is safe whether or not the account id is present.

export const PAYMENT_ORIGIN = 'https://abepayy.com';

// `action` is 'deposit' | 'withdraw'. `accountId`/`currency`/`amount` are
// optional context forwarded to the portal.
export function paymentUrl(action = 'deposit', { accountId, currency, amount } = {}) {
  const base = PAYMENT_ORIGIN.replace(/\/+$/, '');
  const path = action === 'withdraw' ? '/withdraw' : '/deposit';
  const qs = new URLSearchParams();
  if (accountId) qs.set('account', accountId);
  if (currency) qs.set('currency', currency);
  if (amount) qs.set('amount', String(amount));
  const query = qs.toString();
  return `${base}${path}${query ? `?${query}` : ''}`;
}

// Open the portal in a new tab. Returns the URL so callers/tests can inspect it.
// If the popup is blocked, navigate the current tab instead of silently failing.
export function openPaymentPortal(action, opts = {}) {
  const url = paymentUrl(action, opts);
  if (typeof window !== 'undefined') {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.assign(url);
  }
  return url;
}
