// Demo top-up ("Transfer" row) tests.
//
// `DerivClient.topUpDemo` is the real code path: it builds the REST request,
// parses the new balance and folds it back into the account list. Only `fetch`
// is stubbed (the network boundary); everything else runs for real.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { DerivClient } from '../src/lib/derivClient.js';

const realFetch = globalThis.fetch;
let calls;

beforeEach(() => {
  calls = [];
  globalThis.localStorage = {
    _m: new Map(),
    getItem(k) { return this._m.has(k) ? this._m.get(k) : null; },
    setItem(k, v) { this._m.set(k, String(v)); },
    removeItem(k) { this._m.delete(k); },
    clear() { this._m.clear(); },
  };
  globalThis.fetch = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true, status: 200, json: async () => ({ data: { balance: 10000 } }) };
  };
});

test.after(() => { globalThis.fetch = realFetch; });

function demoClient() {
  const c = new DerivClient();
  c.token = 'tok';
  c.authMode = 'oauth';
  c.accountId = 'VRTC123';
  c.accountType = 'demo';
  c.balance = 12.5;
  c._oauthAccounts = [
    { account: 'VRTC123', isDemo: true, balance: 12.5, currency: 'USD' },
    { account: 'CR456', isDemo: false, balance: 40, currency: 'USD' },
  ];
  return c;
}

test('top-up posts to the reset-demo-balance endpoint and returns the new balance', async () => {
  const c = demoClient();
  const balance = await c.topUpDemo();
  assert.equal(balance, 10000);
  assert.equal(c.balance, 10000);
  assert.match(calls[0].url, /\/VRTC123\/reset-demo-balance$/);
  assert.equal(calls[0].opts.method, 'POST');
});

test('top-up updates only the demo account in the account list', async () => {
  const c = demoClient();
  let emitted;
  c.on('accounts', a => { emitted = a; });
  await c.topUpDemo();
  assert.equal(c._oauthAccounts.find(a => a.account === 'VRTC123').balance, 10000);
  assert.equal(c._oauthAccounts.find(a => a.account === 'CR456').balance, 40);
  assert.equal(emitted.find(a => a.account === 'VRTC123').balance, 10000);
});

test('top-up refuses on a real account', async () => {
  const c = demoClient();
  c.accountType = 'real';
  await assert.rejects(() => c.topUpDemo(), /demo account/i);
});

test('top-up surfaces the server error message', async () => {
  const c = demoClient();
  globalThis.fetch = async () => ({ ok: false, status: 403, json: async () => ({ errors: [{ message: 'Insufficient scope' }] }) });
  await assert.rejects(() => c.topUpDemo(), /Insufficient scope/);
});
