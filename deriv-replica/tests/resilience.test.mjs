import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeEngine, loadTape, tickTape } from './helpers.mjs';
import { defaultStrategy } from '../src/lib/strategyBuilder.js';

// A minimal localStorage so the engine's bot persistence can be exercised in
// Node. The engine guards storage with try/catch, so this only replaces the
// boundary, not the logic.
function withStorage(fn) {
  const prev = globalThis.localStorage;
  const map = new Map();
  globalThis.localStorage = {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    clear: () => map.clear(),
  };
  try { return fn(map); } finally {
    if (prev === undefined) delete globalThis.localStorage; else globalThis.localStorage = prev;
  }
}

test('the desk is persisted and a running bot resumes on the next boot', () => {
  withStorage(() => {
    const { engine } = makeEngine();
    engine.setSymbol('R_100');
    loadTape(engine, 'R_100', tickTape(1000, 3));
    engine.setStrategy(defaultStrategy());
    engine.start();
    assert.equal(engine.running, true);

    // A fresh engine on the same storage restores the strategy, the market and
    // the running flag, and marks the run for resume.
    const { engine: next } = makeEngine();
    assert.equal(next.restoreBot(), true);
    assert.equal(next.selectedSymbol, 'R_100');
    assert.equal(next.strategy.name, defaultStrategy().name);
    assert.equal(next._resumePending, true);
  });
});

test('stopping the bot clears the resume flag', () => {
  withStorage(() => {
    const { engine } = makeEngine();
    engine.setSymbol('R_100');
    loadTape(engine, 'R_100', tickTape(1000, 3));
    engine.setStrategy(defaultStrategy());
    engine.start();
    engine.stop();
    const { engine: next } = makeEngine();
    next.restoreBot();
    assert.equal(next._resumePending, false);
  });
});

test('a resumed run starts once the session authorises', () => {
  withStorage(() => {
    const { engine } = makeEngine();
    engine.setSymbol('R_100');
    loadTape(engine, 'R_100', tickTape(1000, 3));
    engine.setStrategy(defaultStrategy());
    engine.start();

    const { engine: next, client } = makeEngine();
    next.restoreBot();
    assert.equal(next.running, false);
    // The market history lands before the session authorises on a real reload.
    loadTape(next, 'R_100', tickTape(1000, 4));
    client.emit('authorized', { accountId: 'VRTC1', accountType: 'demo', balance: 1000 });
    assert.equal(next.running, true);
  });
});
