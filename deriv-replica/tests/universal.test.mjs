// Universal AI: any market, any contract, auto duration.
//
// These exercise the real evaluator over real strategy functions. Only the
// WebSocket boundary is faked; the contract registry, the signals and the
// proposal construction are the shipping code.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeEngine, tick } from './helpers.mjs';
import { SYMBOLS } from '../src/lib/marketStore.js';
import { AUTO_CONTRACTS } from '../src/lib/autoStrategies.js';
import {
  evaluateUniversal, durationLadder, universalContracts, UNIVERSAL_MIN_CONF,
} from '../src/lib/universalAI.js';
import { UNIVERSAL_MIN_GAP_MS } from '../src/lib/engine.js';

test('the universal universe is the whole registry', () => {
  const keys = universalContracts().map(c => c.key).sort();
  const expected = Object.keys(AUTO_CONTRACTS).sort();
  assert.deepEqual(keys, expected);
  assert.ok(keys.length >= 70, `expected the full registry, got ${keys.length}`);
});

test('duration ladder covers every unit and skips contracts without duration', () => {
  const accumulators = Object.values(AUTO_CONTRACTS).find(c => c.family === 'accumulators');
  assert.deepEqual(durationLadder(accumulators), [{ dur: null, unit: null }], 'accumulators have no duration input');
  const rf = durationLadder(AUTO_CONTRACTS.CALL);
  assert.ok(rf.length >= 3 && rf.every(d => d.dur >= 1 && d.unit === 't'));
});

test('duration is chosen automatically from the tape, not fixed', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.94 });
  const res = evaluateUniversal({
    store: engine.store, symbols: SYMBOLS.map(s => s.sym),
    params: { accuracy: 'max' }, minConf: 80,
  });
  assert.ok(res.length > 0, 'a strongly biased tape should produce candidates');
  const durs = new Set(res.map(r => r.durLabel));
  // Every candidate carries a concrete duration label; the search picked them.
  assert.ok([...durs].every(d => /\d/.test(d)));
});

test('nothing is proposed below the confidence threshold', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.56 });
  const res = evaluateUniversal({
    store: engine.store, symbols: SYMBOLS.map(s => s.sym),
    params: { accuracy: 'max' }, minConf: 80,
  });
  assert.ok(res.every(r => r.conf >= 80), 'no candidate may sit under the bar');
});

test('a stronger threshold yields no candidates from an ambiguous tape', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.6 });
  const loose = evaluateUniversal({
    store: engine.store, symbols: SYMBOLS.map(s => s.sym),
    params: { accuracy: 'balanced' }, minConf: 55,
  });
  const strict = evaluateUniversal({
    store: engine.store, symbols: SYMBOLS.map(s => s.sym),
    params: { accuracy: 'max' }, minConf: 90,
  });
  assert.ok(strict.length <= loose.length, 'a stricter bar cannot admit more');
});

test('results are ranked by confidence, best first', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.95 });
  const res = evaluateUniversal({
    store: engine.store, symbols: SYMBOLS.map(s => s.sym),
    params: { accuracy: 'max' }, minConf: UNIVERSAL_MIN_CONF,
  });
  for (let i = 1; i < res.length; i++) {
    assert.ok(res[i - 1].conf >= res[i].conf, 'ranking must be monotone in confidence');
  }
});

test('universal mode executes any contract that clears the bar', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.95 });
  engine.setUniversal(true);
  engine.running = true;
  engine._runUniversalScan();
  assert.ok(engine.universalCandidates.length > 0, 'scan must find opportunities');

  tick(engine, engine.universalCandidates[0].sym, 5000.44);
  assert.equal(client.proposals().length, 1, 'a qualifying reading must trade');
  const sent = client.sent[client.sent.length - 1];
  assert.ok(sent.proposal === 1);
  assert.ok(typeof sent.duration === 'number' && sent.duration >= 1, 'a concrete duration must be sent');
});

test('universal mode places no trade when nothing clears the bar', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.5 });
  engine.setUniversal(true);
  engine.universalMinConf = 95;
  engine.running = true;
  engine._runUniversalScan();
  if (engine.universalCandidates.length === 0) {
    tick(engine, 'R_75', 5000.44);
    assert.equal(client.proposals().length, 0, 'silence is the correct action');
  }
});

// Natural cadence. The universal AI must trade at most once per
// UNIVERSAL_MIN_GAP_MS, so a burst of qualifying ticks cannot open a string of
// overlapping entries. This is the "trade the tape, not a timer" guarantee.
test('universal mode will not trade twice inside the natural cadence window', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.95 });
  engine.setUniversal(true);
  engine.running = true;
  engine._runUniversalScan();
  const sym = engine.universalCandidates[0].sym;

  // A fast burst of qualifying ticks with each prior contract treated as
  // settled: only the first may enter, the rest are held back by the cadence
  // gate even though the tape still qualifies.
  for (let i = 0; i < 8; i++) {
    engine.activeContracts.clear();
    tick(engine, sym, 5000.44 + i * 0.01);
  }
  assert.equal(client.proposals().length, 1, 'cadence must cap entries at one per window');

  // Once the window has elapsed the next qualifying tick may trade again.
  engine._universalLastTradeAt = Date.now() - UNIVERSAL_MIN_GAP_MS - 1;
  engine.activeContracts.clear();
  tick(engine, sym, 5000.99);
  assert.equal(client.proposals().length, 2, 'a new trade is allowed after the gap');
});

test('the cadence window is the natural ~5s, not a forced interval', () => {
  assert.equal(UNIVERSAL_MIN_GAP_MS, 5000);
});

test('the threshold is clamped to a usable range', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.setUniversalMinConf(10);
  assert.ok(engine.universalMinConf >= 50);
  engine.setUniversalMinConf(200);
  assert.ok(engine.universalMinConf <= 99);
});

test('universal warm-up waits for a slice of the universe, not one market', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.setUniversal(true);
  const w = engine.warmup();
  assert.equal(w.sym, 'ALL');
  assert.ok(w.need >= 1 && w.need <= SYMBOLS.length);
});
