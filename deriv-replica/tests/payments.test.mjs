// Payments hand-off tests.
//
// The deposit/withdraw portal URL is the contract with abepayy.com: the action
// selects the path and the account context rides in the query string. Only the
// pure builder is tested here (openPaymentPortal's side effect is a window.open).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paymentUrl, PAYMENT_ORIGIN } from '../src/lib/payments.js';

test('deposit and withdraw target abepayy.com paths', () => {
  assert.equal(paymentUrl('deposit'), `${PAYMENT_ORIGIN}/deposit`);
  assert.equal(paymentUrl('withdraw'), `${PAYMENT_ORIGIN}/withdraw`);
});

test('an unknown action falls back to deposit', () => {
  assert.equal(paymentUrl('topup'), `${PAYMENT_ORIGIN}/deposit`);
});

test('account context is carried as query parameters', () => {
  const url = paymentUrl('deposit', { accountId: 'VRTC123', currency: 'USD', amount: 50 });
  const qs = new URL(url).searchParams;
  assert.equal(qs.get('account'), 'VRTC123');
  assert.equal(qs.get('currency'), 'USD');
  assert.equal(qs.get('amount'), '50');
});

test('no context yields a clean origin+path', () => {
  assert.equal(paymentUrl('withdraw', {}), 'https://abepayy.com/withdraw');
});
