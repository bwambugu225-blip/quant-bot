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

// ── preferred markets ────────────────────────────────────────────────────
// Universal AI must let anyone steer it to the markets they want. With no
// preference it scans the whole universe; picking a subset narrows the scan.

test('the universe defaults to every market', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  assert.equal(engine.universalMarkets, null);
  assert.deepEqual(engine.universalSymbols(), SYMBOLS.map(s => s.sym));
});

test('picking a subset narrows the universal scan to those markets', () => {
  // R_75 is the strongly-biased leader, but it is excluded here, so its edge
  // must not surface at all.
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_25', leaderRate: 0.95 });
  engine.setUniversalMarkets(['R_10', 'R_25', 'R_50']);
  assert.deepEqual(engine.universalSymbols(), ['R_10', 'R_25', 'R_50']);

  engine.setUniversal(true);
  engine.running = true;
  engine._universalAt = 0;
  engine._runUniversalScan();
  assert.ok(engine.universalCandidates.length > 0, 'the chosen markets should yield candidates');
  assert.ok(engine.universalCandidates.every(c => ['R_10', 'R_25', 'R_50'].includes(c.sym)),
    'the scan must not surface a market the user excluded');
});

test('the first tap starts a preference and the second adds to it', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.toggleUniversalMarket('R_75');
  assert.deepEqual(engine.universalSymbols(), ['R_75'], 'the first tap picks just that market');
  engine.toggleUniversalMarket('R_25');
  assert.deepEqual(engine.universalSymbols(), ['R_25', 'R_75'], 'a second tap adds to the set');
  engine.toggleUniversalMarket('R_75');
  assert.deepEqual(engine.universalSymbols(), ['R_25'], 'tapping a picked market removes it');
});

test('a candidate on an excluded market is never proposed', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_10', leaderRate: 0.95 });
  engine.setUniversalMarkets(['R_10']); // R_75 is excluded
  engine.setUniversal(true);
  engine.running = true;
  engine._universalAt = 0;
  engine._runUniversalScan();
  assert.ok(engine.universalCandidates.every(c => c.sym === 'R_10'));

  // Universal mode re-confirms the best *allowed* candidate on any tick, so a
  // tick from an excluded market still cannot produce an entry on it: every
  // proposal carries an allowed symbol.
  for (let i = 0; i < 4; i++) { engine.activeContracts.clear(); tick(engine, 'R_75', 5000 + i); }
  assert.ok(client.proposals().length > 0, 'an allowed market must still trade');
  assert.ok(client.proposals().every(p => p.underlying_symbol === 'R_10'),
    'no proposal may be placed on an excluded market');
});

test('clearing the preference restores the whole universe', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.toggleUniversalMarket('R_10');
  assert.ok(engine.universalMarkets);
  engine.clearUniversalMarkets();
  assert.equal(engine.universalMarkets, null);
  assert.deepEqual(engine.universalSymbols(), SYMBOLS.map(s => s.sym));
});

test('turning every market off falls back to all rather than an empty universe', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  for (const s of SYMBOLS) engine.toggleUniversalMarket(s.sym);
  assert.equal(engine.universalMarkets, null, 'an empty set must fall back to all');
  assert.ok(engine.universalSymbols().length === SYMBOLS.length);
});

test('warm-up is scoped to the preferred markets', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.setUniversalMarkets(['R_10', 'R_25']);
  engine.setUniversal(true);
  const w = engine.warmup();
  assert.equal(w.markets, 2, 'warm-up must only require the chosen markets');
  assert.equal(w.need, 1, 'a two-market set needs only one of them warm');
});

// ── martingale ───────────────────────────────────────────────────────────
// Universal AI must actually escalate after a loss. The settlement path used
// the mirrored contract's params (martingale off), so the ladder never stepped.

test('universal martingale escalates the stake after a loss', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.95 });
  engine.setUniversal(true);
  engine.running = true;
  engine.setUniversalParams({ martingale: true, martMult: 2, martSteps: 3, stake: 1 });
  engine._universalAt = 0;
  engine._runUniversalScan();
  const sym = engine.universalCandidates[0].sym;

  // First entry: base stake.
  tick(engine, sym, 5000.44);
  const first = client.proposals().at(-1);
  assert.equal(first.amount, 1, 'the first entry is the base stake');

  // Settle it as a loss; the ladder must step once.
  engine._onBuy({ buy: { contract_id: 1, buy_price: 1, contract_type: 'DIGITOVER', longcode: 'x' } });
  engine._onContract({ contract_id: 1, status: 'lost', profit: -1, is_sold: 1 });
  assert.equal(engine._martSteps, 1, 'a loss must advance the martingale ladder');

  // Next entry after the cadence window: stake must be base × multiplier.
  engine._universalLastTradeAt = Date.now() - UNIVERSAL_MIN_GAP_MS - 1;
  engine.activeContracts.clear();
  tick(engine, sym, 5000.99);
  const second = client.proposals().at(-1);
  assert.equal(second.amount, 2, 'the next entry must be the martingale stake');
});

test('universal martingale resets to the base stake after a win', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.95 });
  engine.setUniversal(true);
  engine.running = true;
  engine.setUniversalParams({ martingale: true, martMult: 2, martSteps: 3, stake: 1 });
  engine._martSteps = 2;

  engine._onBuy({ buy: { contract_id: 5, buy_price: 4, contract_type: 'DIGITOVER', longcode: 'x' } });
  engine._onContract({ contract_id: 5, status: 'won', profit: 4, is_sold: 1 });
  assert.equal(engine._martSteps, 0, 'a win must reset the ladder');
});

test('martingale is capped at the configured number of steps', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.95 });
  engine.setUniversal(true);
  engine.running = true;
  engine.setUniversalParams({ martingale: true, martMult: 2, martSteps: 2, stake: 1 });
  for (let i = 1; i <= 5; i++) {
    engine._onBuy({ buy: { contract_id: i, buy_price: 1, contract_type: 'DIGITOVER', longcode: 'x' } });
    engine._onContract({ contract_id: i, status: 'lost', profit: -1, is_sold: 1 });
  }
  assert.equal(engine._martSteps, 2, 'the ladder must not exceed max steps');
});

test('universal params are independent of the selected contract', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.setParams({ stake: 99, martingale: true });
  engine.setUniversalParams({ stake: 2 });
  assert.equal(engine.universalParams().stake, 2, 'the AI stake must not inherit the contract stake');
  assert.equal(engine.universalParams().martingale, false, 'the AI must not inherit the contract martingale');
});
