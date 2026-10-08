// Engine + strategy tests.
//
// These exercise the real decision path — the same _onTick → signal → _execute
// → proposal chain the browser runs. Only the WebSocket boundary is faked.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  AUTO_CONTRACTS, AUTO_FAMILIES, contractsForFamily, accuracyParams, durationProfile, buildAutoValue,
} from '../src/lib/autoStrategies.js';
import { buildProposal } from '../src/lib/contracts.js';
import { SYMBOLS, isDigitSymbol } from '../src/lib/marketStore.js';
import { makeEngine, tick, ctxFor, digitStream, FakeClient } from './helpers.mjs';

const ALL = AUTO_FAMILIES.flatMap(f => contractsForFamily(f.id));

// ── registry integrity ───────────────────────────────────────────────────
test('every contract is well formed', () => {
  assert.equal(ALL.length, 70, 'contract count changed — update expectations');
  for (const c of ALL) {
    assert.equal(typeof c.signal, 'function', `${c.key} has no signal fn`);
    assert.ok(AUTO_CONTRACTS[c.key], `${c.key} not registered`);
    assert.ok(c.label && c.winNote, `${c.key} missing label/winNote`);
  }
});

// ── strategies fire in their own regime ──────────────────────────────────
test('all 70 contracts produce a signal in their matching regime (Max accuracy)', () => {
  const dead = [];
  for (const c of ALL) {
    let fired = false;
    for (let seed = 1; seed <= 12 && !fired; seed++) {
      const params = { stake: 1, ...accuracyParams('max'), ...c.defaults };
      // High/Low Tick carries the predicted slot as a parameter (the UI's
      // segmented control); sweep it the way a user would.
      const slots = c.inputs.includes('selectedTick') ? [1, 2, 3, 4, 5] : [undefined];
      for (const st of slots) {
        const ctx = { ...ctxFor(c, seed), params: st == null ? params : { ...params, selectedTick: st } };
        const sig = c.signal(ctx);
        if (sig && sig.conf != null) { fired = true; break; }
      }
    }
    if (!fired) dead.push(c.key);
  }
  assert.deepEqual(dead, [], `contracts that never fire: ${dead.join(', ')}`);
});

test('Only Ups and Only Downs never both fire on one tape', () => {
  const t = ctxFor(AUTO_CONTRACTS.RUNHIGH, 1);
  const params = { stake: 1, ...accuracyParams('max'), ...AUTO_CONTRACTS.RUNHIGH.defaults };
  const up = AUTO_CONTRACTS.RUNHIGH.signal({ ...t, params });
  const down = AUTO_CONTRACTS.RUNLOW.signal({ ...t, params });
  assert.ok(!(up && down), 'Only Ups and Only Downs both fired on one tape');
});

// High/Low Tick requires the live price tape, not just candles.
test('High/Low Tick reads the live tick tape and refuses without one', () => {
  const entry = AUTO_CONTRACTS.TICKHIGH;
  const base = { stake: 1, ...accuracyParams('max'), ...entry.defaults };
  const prices = ctxFor(entry, 1).prices;
  // The drift on this tape favours slot 1; sweep the parameter as the UI does.
  let fired = null;
  for (let st = 1; st <= 5 && !fired; st++) {
    fired = entry.signal({ candles: [], digits: [], prices, params: { ...base, selectedTick: st } });
  }
  assert.ok(fired && fired.conf != null, 'High Tick did not fire on a drifting tape');
  const without = entry.signal({ candles: [], digits: [], prices: [], params: base });
  assert.equal(without, null, 'High Tick fired with no tick tape');
});

// The new products must build the exact proposal fields Deriv expects.
test('new contract families build the correct proposal fields', () => {
  const base = { duration: 5, unit: 't', stake: 1 };

  const stays = buildProposal('stays_goes', 'up', { ...base, barrier: '+1.51', barrier2: '-1.51' }, 'R_10');
  assert.equal(stays.contract_type, 'RANGE');
  assert.equal(stays.barrier, '+1.51');
  assert.equal(stays.barrier2, '-1.51');

  const goes = buildProposal('stays_goes', 'down', { ...base, barrier: '+1.51', barrier2: '-1.51' }, 'R_10');
  assert.equal(goes.contract_type, 'UPORDOWN');

  const endsIn = buildProposal('ends_between', 'up', { ...base, barrier: '+1.51', barrier2: '-1.51' }, 'R_10');
  assert.equal(endsIn.contract_type, 'EXPIRYRANGE');
  const endsOut = buildProposal('ends_between', 'down', { ...base, barrier: '+1.51', barrier2: '-1.51' }, 'R_10');
  assert.equal(endsOut.contract_type, 'EXPIRYMISS');

  assert.equal(buildProposal('runs', 'up', base, 'R_100').contract_type, 'RUNHIGH');
  assert.equal(buildProposal('runs', 'down', base, 'R_100').contract_type, 'RUNLOW');
  assert.equal(buildProposal('asians', 'up', base, 'R_100').contract_type, 'ASIANU');
  assert.equal(buildProposal('asians', 'down', base, 'R_100').contract_type, 'ASIAND');
  assert.equal(buildProposal('resets', 'up', base, 'R_100').contract_type, 'RESETCALL');
  assert.equal(buildProposal('resets', 'down', base, 'R_100').contract_type, 'RESETPUT');

  // High/Low Tick: duration is the fixed five-tick window, selected_tick is 1–5.
  const high = buildProposal('highs_lows', 'up', { stake: 1, selectedTick: 5 }, 'R_100');
  assert.equal(high.contract_type, 'TICKHIGH');
  assert.equal(high.selected_tick, 5);
  assert.equal(high.duration, undefined, 'tick-extreme products take no duration');
  const clamped = buildProposal('highs_lows', 'down', { stake: 1, selectedTick: 9 }, 'R_100');
  assert.equal(clamped.contract_type, 'TICKLOW');
  assert.equal(clamped.selected_tick, 5, 'selected_tick clamps to the 5-tick window');

  // Lookbacks: multiplier payout, close-low / high-close / high-low.
  const cl = buildProposal('lookbacks', 'up', { ...base, multiplier: 10 }, 'R_100');
  assert.equal(cl.contract_type, 'LBFLOATCALL');
  assert.equal(cl.multiplier, 10);
  assert.equal(buildProposal('lookbacks', 'down', { ...base, multiplier: 10 }, 'R_100').contract_type, 'LBFLOATPUT');
  assert.equal(buildProposal('lookbacks_highlow', 'up', { ...base, multiplier: 10 }, 'R_100').contract_type, 'LBHIGHLOW');
});

// ── accuracy presets are ordered and honest ──────────────────────────────
test('accuracy levels are ordered Max <= High <= Balanced on a marginal stream', () => {
  const digits = digitStream(d => d > 3, 0.62, 600, 11);
  const counts = ['max', 'high', 'balanced'].map(lvl => {
    let n = 0;
    for (let k = 0; k < 40; k++) {
      const slice = digits.slice(k, k + 500);
      const params = { stake: 1, ...accuracyParams(lvl), ...AUTO_CONTRACTS['DIGITOVER:3'].defaults };
      if (AUTO_CONTRACTS['DIGITOVER:3'].signal({ digits: slice, candles: [], params })) n++;
    }
    return n;
  });
  assert.ok(counts[0] <= counts[1], `Max(${counts[0]}) must not fire more than High(${counts[1]})`);
  assert.ok(counts[1] <= counts[2], `High(${counts[1]}) must not fire more than Balanced(${counts[2]})`);
});

test('Max accuracy stays silent on a noisy 55% digit stream', () => {
  const digits = digitStream(d => d > 3, 0.55, 600, 21);
  const params = { stake: 1, ...accuracyParams('max'), ...AUTO_CONTRACTS['DIGITOVER:3'].defaults };
  const sig = AUTO_CONTRACTS['DIGITOVER:3'].signal({ digits, candles: [], params });
  assert.equal(sig, null, 'Max must not fire on noise');
});

// ── duration-aware analysis ──────────────────────────────────────────────
test('duration scales the analysis window and the evidence bar', () => {
  const short = durationProfile({ duration: 1, unit: 't' });
  const long = durationProfile({ duration: 1, unit: 'm' });
  assert.equal(short.windowScale, 1, '1 tick must not scale the window');
  assert.ok(long.windowScale > short.windowScale, 'a longer hold must widen the window');
  assert.ok(long.durZ > short.durZ, 'a longer hold must raise the evidence bar');
});

test('a longer duration never fires more often on the same tape', () => {
  const digits = digitStream(d => d > 3, 0.66, 700, 31);
  const count = (p) => {
    let n = 0;
    for (let k = 0; k < 40; k++) {
      const params = { stake: 1, ...accuracyParams('max'), ...p };
      if (AUTO_CONTRACTS['DIGITOVER:3'].signal({ digits: digits.slice(k, k + 620), candles: [], params })) n++;
    }
    return n;
  };
  const t1 = count({ duration: 1, unit: 't' });
  const m1 = count({ duration: 1, unit: 'm' });
  assert.ok(m1 <= t1, `1-minute (${m1}) must not fire more than 1-tick (${t1})`);
});

test('the selected duration is echoed in the signal and the proposal', () => {
  const digits = digitStream(d => d > 3, 0.85, 600, 41);
  const params = { stake: 1, ...accuracyParams('max'), ...AUTO_CONTRACTS['DIGITOVER:3'].defaults, duration: 5, unit: 't' };
  const sig = AUTO_CONTRACTS['DIGITOVER:3'].signal({ digits, candles: [], params });
  assert.ok(sig, 'expected a signal on a strong stream');
  assert.equal(sig.dur, '5t');

  const value = buildAutoValue(AUTO_CONTRACTS['DIGITOVER:3'], params);
  const fields = buildProposal('over_under', 'up', value, 'R_10');
  assert.equal(fields.duration, 5);
  assert.equal(fields.duration_unit, 't');
});

// ── multi-market scanner ─────────────────────────────────────────────────
test('scanner ranks the universe and follows the strongest market', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.9 });
  engine.running = true;
  engine._scanAt = 0;
  const best = engine.scanner.scan();
  assert.equal(best.sym, 'R_75', `expected R_75 to lead, got ${best.sym}`);
  const rows = engine.scanner.top(8);
  assert.ok(rows.length >= 2, 'scanner must rank multiple markets');
  // Ranking is sorted descending.
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i - 1].score >= rows[i].score);
});

test('scanner only rotates when the leader is clearly ahead', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.9 });
  engine.running = true;
  engine._scanAt = 0;
  engine._runScan();
  assert.equal(engine.autoMarket, 'R_75', 'should adopt a clearly stronger market');
});

// ── lightning execution ──────────────────────────────────────────────────
test('a qualifying tick executes in milliseconds with a correct proposal', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.9 });
  engine.running = true;
  engine._scanAt = 0;
  engine._runScan();
  const leader = engine.autoMarket;

  const t0 = Date.now();
  tick(engine, leader, 5000.44);
  const dt = Date.now() - t0;

  const props = client.proposals();
  assert.equal(props.length, 1, 'exactly one proposal must be sent');
  assert.equal(props[0].contract_type, 'DIGITOVER');
  assert.equal(String(props[0].barrier), '3');
  assert.ok(dt < 100, `decision took ${dt}ms — expected a synchronous tick decision`);
});

test('no second trade is placed while one is in flight', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.9 });
  engine.running = true;
  engine._scanAt = 0;
  engine._runScan();
  const leader = engine.autoMarket;

  tick(engine, leader, 5000.44);
  tick(engine, leader, 5000.45); // activeContracts now holds "sending"
  assert.equal(client.proposals().length, 1, 'must not stack proposals');
});

test('a tick on a market with no qualifying signal does not trade', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.9 });
  engine.running = true;
  engine._scanAt = 0;
  engine._runScan();
  // R_10 was seeded at 50% — no edge, so no trade.
  tick(engine, 'R_10', 1111.1);
  assert.equal(client.proposals().length, 0, 'must not trade a no-edge market');
});

test('exec latency stats are recorded from tick to proposal', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.9 });
  engine.running = true;
  engine._scanAt = 0;
  engine._runScan();
  tick(engine, engine.autoMarket, 5000.1);
  engine._onProposal({ proposal: { id: 'P1', ask_price: 1, payout: 1.95 } });
  const s = engine.execStats();
  assert.equal(s.n, 1);
  assert.ok(Number.isFinite(s.p50) && s.p50 >= 0);
});

test('proposal → buy → settle updates session stats', () => {
  const { engine, client } = makeEngine();
  engine.running = true;
  engine._execStart = Date.now();
  engine._onProposal({ proposal: { id: 'P1', ask_price: 1, payout: 1.95 } });
  assert.equal(client.buys.length, 1, 'proposal must be bought');
  engine._onBuy({ buy: { contract_id: 77, buy_price: 1, contract_type: 'DIGITOVER', longcode: 'x' } });
  engine._onContract({ contract_id: 77, status: 'won', profit: 0.95, is_sold: 1 });
  assert.equal(engine.trades, 1, 'buy must count the trade');
  assert.equal(engine.wins, 1);
  assert.ok(Math.abs(engine.pnl - 0.95) < 1e-9);
});

// ── warm-up / seamless start ─────────────────────────────────────────────
test('start is refused on a cold tape and engages automatically when warm', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  // Cold: clear the target market's history.
  engine.store.digHist = {};
  assert.equal(engine.start(), false, 'must not start cold');
  assert.equal(engine.running, false);
  assert.equal(engine._startPending, true, 'start must be queued');

  // Not ready yet after a few ticks.
  for (let i = 0; i < 50; i++) tick(engine, engine.autoMarket, 5000 + i);
  assert.equal(engine.running, false, 'still warming at 50 ticks');

  // Cross the 100-tick threshold.
  for (let i = 0; i < 60; i++) tick(engine, engine.autoMarket, 5100 + i);
  assert.equal(engine.running, true, 'must auto-start once warm');
  assert.equal(engine._startPending, false);
  engine.stop();
});

test('start engages immediately when the tape is already warm', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  assert.ok(engine.warmup().have >= 100, 'fixture should be warm');
  assert.equal(engine.start(), true);
  assert.equal(engine.running, true);
  engine.stop();
});

test('warm-up reports progress against the 100-tick target', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.store.digHist = { R_10: digitStream(d => d >= 0, 0.5, 42, 1) };
  const w = engine.warmup();
  assert.equal(w.need, 100);
  assert.equal(w.have, 42);
  assert.equal(w.ready, false);
});

// ── guards and caps ──────────────────────────────────────────────────────
test('digit contracts refuse to start on a non-volatility market', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.autoMarket = 'frxEURUSD';
  assert.equal(engine.start(), false);
  assert.equal(engine.running, false);
});

test('max trades cap stops the engine', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.running = true;
  engine.trades = 3;
  engine.setParams({ maxTrades: 3 });
  const allowed = engine._sessionAllows();
  assert.equal(allowed, false);
  assert.equal(engine.running, false, 'engine must stop at the trade cap');
});

test('stop clears a pending start', () => {
  const { engine } = makeEngine({ contractKey: 'DIGITOVER:3' });
  engine.store.digHist = {};
  engine.start();
  assert.equal(engine._startPending, true);
  engine.stop();
  assert.equal(engine._startPending, false);
});

// ── directional routing ──────────────────────────────────────────────────
test('a directional contract builds a CALL/RISE proposal with the chosen duration', () => {
  const { engine, client } = makeEngine({ contractKey: 'CALL' });
  const sym = engine.autoMarket;
  engine.store.candles[sym] = ctxFor(AUTO_CONTRACTS.CALL, 3).candles;
  engine.running = true;
  engine.setParams({ duration: 5, unit: 't' });
  engine._evaluateDirectional(sym, AUTO_CONTRACTS.CALL);
  const props = client.proposals();
  assert.ok(props.length >= 1, 'a clear uptrend must produce a Rise proposal');
  assert.equal(props[0].contract_type, 'CALL');
  assert.equal(props[0].underlying_symbol, sym);
});