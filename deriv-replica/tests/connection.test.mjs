import { test } from 'node:test';
import assert from 'node:assert/strict';

// The connection layer is the one piece that must survive a long session. These
// tests drive DerivClient against a stub WebSocket so the reconnect loop, the
// stale-stream watchdog and the health readout are exercised as real code —
// only the socket boundary is faked.

// A minimal WebSocket stand-in. `instances` records every socket opened so a
// test can inspect what the client did without touching the network.
class StubWS {
  static instances = [];
  static OPEN = 1;
  static CONNECTING = 0;
  static CLOSED = 3;
  constructor(url) {
    this.url = url;
    this.readyState = StubWS.CONNECTING;
    this.sent = [];
    StubWS.instances.push(this);
    // Open on the next microtask so onopen handlers are attached first.
    queueMicrotask(() => { this.readyState = StubWS.OPEN; this.onopen?.(); });
  }
  send(data) { this.sent.push(data); }
  close() { this.readyState = StubWS.CLOSED; this.onclose?.(); }
}

async function withStub(fn) {
  const prevWS = globalThis.WebSocket;
  const prevWin = globalThis.window;
  StubWS.instances = [];
  globalThis.WebSocket = StubWS;
  delete globalThis.window;               // keep the client off the DOM hooks
  try { return await fn(); }
  finally { globalThis.WebSocket = prevWS; if (prevWin) globalThis.window = prevWin; }
}

const flush = () => new Promise(r => setTimeout(r, 5));

test('the market socket reports its state through marketHealth()', async () => {
  await withStub(async () => {
    const { DerivClient } = await import('../src/lib/derivClient.js');
    const c = new DerivClient();
    const states = [];
    c.on('market-state', s => states.push(s.state));
    c.connectMarket();
    await flush();
    const h = c.marketHealth();
    assert.equal(h.state, 'open');
    assert.equal(h.connected, true);
    assert.equal(h.ticks, 0);
    assert.ok(states.includes('connecting') && states.includes('open'));
    c.close();
  });
});

test('a dropped market socket reconnects on its own (no reload, no cap)', async () => {
  await withStub(async () => {
    const { DerivClient } = await import('../src/lib/derivClient.js');
    const c = new DerivClient();
    c.connectMarket();
    await flush();
    assert.equal(StubWS.instances.length, 1);

    // Simulate the venue closing the socket.
    StubWS.instances[0].onclose();
    assert.equal(c.marketHealth().state, 'retrying');
    assert.ok(c.marketHealth().reconnectIn > 0);

    // The scheduled reconnect opens a fresh socket. Wait past the fallback
    // (700ms) which is the first retry delay.
    await new Promise(r => setTimeout(r, 900));
    assert.ok(StubWS.instances.length >= 2, 'a new socket was opened');
    c.close();
  });
});

test('ticks feed the health readout: count, freshness and rate', async () => {
  await withStub(async () => {
    const { DerivClient } = await import('../src/lib/derivClient.js');
    const c = new DerivClient();
    c.connectMarket();
    await flush();

    const tick = { symbol: 'R_100', quote: 1234.5, epoch: 1700000000 };
    c._onMessage({ data: JSON.stringify({ msg_type: 'tick', tick }) });
    c._onMessage({ data: JSON.stringify({ msg_type: 'tick', tick }) });
    const h = c.marketHealth();
    assert.equal(h.ticks, 2);
    assert.ok(h.age != null && h.age < 1000, 'fresh tick age');
    assert.ok(h.rate > 0, 'a positive tick rate');
    c.close();
  });
});

test('reconnectMarket() tears down and rebuilds the stream', async () => {
  await withStub(async () => {
    const { DerivClient } = await import('../src/lib/derivClient.js');
    const c = new DerivClient();
    c.connectMarket();
    await flush();
    const before = StubWS.instances.length;
    c.reconnectMarket();
    await flush();
    assert.ok(StubWS.instances.length > before, 'a new socket was opened');
    assert.equal(c.marketHealth().state, 'open');
    c.close();
  });
});

test('close() stops the reconnect loop', async () => {
  await withStub(async () => {
    const { DerivClient } = await import('../src/lib/derivClient.js');
    const c = new DerivClient();
    c.connectMarket();
    await flush();
    c.close();
    const n = StubWS.instances.length;
    StubWS.instances[n - 1].onclose?.();
    await new Promise(r => setTimeout(r, 900));
    assert.equal(StubWS.instances.length, n, 'no socket opened after close()');
    assert.equal(c.marketHealth().state, 'idle');
  });
});
