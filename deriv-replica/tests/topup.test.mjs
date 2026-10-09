// Engine-level account tests: the Transfer/top-up flow routes through the
// engine so the demo account is selected before the recharge and the new
// balance lands in a state snapshot. Only the socket/REST boundary is faked.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/lib/engine.js';

function fakeClient({ accountType = 'demo', balance = 10 } = {}) {
  return {
    accountId: accountType === 'demo' ? 'VRTC1' : 'CR1',
    accountType,
    balance,
    auth: true,
    ws: { readyState: 1 },
    handlers: {},
    on(evt, fn) { (this.handlers[evt] = this.handlers[evt] || []).push(fn); return this; },
    emit(evt, ...a) { (this.handlers[evt] || []).forEach(fn => fn(...a)); },
    switchAccount(id) { this.accountId = id; this.accountType = id.startsWith('VR') ? 'demo' : 'real'; return Promise.resolve(); },
    topUpDemo() {
      if (this.accountType !== 'demo') throw new Error('Top-up is only available on a demo account');
      this.balance = 10000;
      this.emit('authorized', { accountId: this.accountId, accountType: this.accountType, balance: this.balance });
      return Promise.resolve(this.balance);
    },
    subscribeMarket() {}, send() {}, buy() {}, requestContractsFor() { return null; },
    close() {},
  };
}

test('topUpDemo recharges the current demo account and updates state', async () => {
  const engine = new Engine();
  const client = fakeClient({ accountType: 'demo', balance: 10 });
  engine.attach(client);
  const balance = await engine.topUpDemo();
  assert.equal(balance, 10000);
  assert.equal(engine.snapshot().balance, 10000);
});

test('topUpDemo from a real login switches to the demo account first', async () => {
  const engine = new Engine();
  const client = fakeClient({ accountType: 'real', balance: 40 });
  engine.accounts = [
    { account: 'CR1', isDemo: false, balance: 40 },
    { account: 'VRTC9', isDemo: true, balance: 5 },
  ];
  engine.attach(client);
  const balance = await engine.topUpDemo();
  assert.equal(balance, 10000);
  assert.equal(client.accountId, 'VRTC9');
  assert.equal(client.accountType, 'demo');
});

test('topUpDemo with no demo account surfaces a clear error', async () => {
  const engine = new Engine();
  const client = fakeClient({ accountType: 'real', balance: 40 });
  engine.accounts = [{ account: 'CR1', isDemo: false, balance: 40 }];
  engine.attach(client);
  await assert.rejects(() => engine.topUpDemo(), /No demo account/);
});
