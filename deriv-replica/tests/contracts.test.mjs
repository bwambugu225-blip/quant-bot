// contracts_for shaping: the catalogue the exchange publishes for a market is
// the authority on which barriers and durations that market accepts. These use
// real catalogue rows (captured from the public API) and assert that the shaped
// proposal carries the values the API will actually accept.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTO_CONTRACTS, buildAutoValue, shapeProposal,
} from '../src/lib/autoStrategies.js';
import { buildProposal } from '../src/lib/contracts.js';
import { makeEngine, tick } from './helpers.mjs';

// A Volatility 50 catalogue, trimmed to the rows these tests exercise.
const V50 = [
  { contract_type: 'TURBOSLONG', contract_category: 'turbos', sentiment: 'up', expiry_type: 'tick', duration_unit: 't', min_contract_duration: '5t', max_contract_duration: '10t', barrier_choices: ['0.1224', '0.2326', '0.4422', '0.8405', '1.5978', '3.0373'] },
  { contract_type: 'TURBOSSHORT', contract_category: 'turbos', sentiment: 'down', expiry_type: 'tick', duration_unit: 't', min_contract_duration: '5t', max_contract_duration: '10t', barrier_choices: ['0.1224', '0.2326', '0.4422', '0.8405', '1.5978', '3.0373'] },
  { contract_type: 'VANILLALONGCALL', contract_category: 'vanilla', sentiment: 'up', expiry_type: 'intraday', barrier: '+0.0520', barrier_choices: ['+0.0980', '+0.0520', '+0.0000', '-0.0510', '-0.0980'], min_contract_duration: '1m', max_contract_duration: '1d', duration_unit: 'm', unit_options: ['1', '2', '5'] },
  { contract_type: 'VANILLALONGPUT', contract_category: 'vanilla', sentiment: 'down', expiry_type: 'intraday', barrier: '-0.0510', barrier_choices: ['+0.0980', '+0.0520', '+0.0000', '-0.0510', '-0.0980'], min_contract_duration: '1m', max_contract_duration: '1d', duration_unit: 'm', unit_options: ['1', '2', '5'] },
  { contract_type: 'LOWER', contract_category: 'higherlower', sentiment: 'down', expiry_type: 'intraday', barrier: '+0.0230', min_contract_duration: '15s', max_contract_duration: '1d', duration_unit: 's', unit_options: ['15', '30', '60'] },
  { contract_type: 'NOTOUCH', contract_category: 'touchnotouch', sentiment: 'down', expiry_type: 'intraday', barrier: '+0.0652', min_contract_duration: '15s', max_contract_duration: '1d', duration_unit: 's', unit_options: ['15', '30', '60'] },
  { contract_type: 'RANGE', contract_category: 'staysinout', sentiment: 'low_vol', expiry_type: 'intraday', high_barrier: '+0.0652', low_barrier: '-0.0651', min_contract_duration: '2m', max_contract_duration: '1d', duration_unit: 'm', unit_options: ['2', '3', '5'] },
  { contract_type: 'EXPIRYRANGE', contract_category: 'endsinout', sentiment: 'low_vol', expiry_type: 'intraday', high_barrier: '+0.0652', low_barrier: '-0.0651', min_contract_duration: '2m', max_contract_duration: '1d', duration_unit: 'm', unit_options: ['2', '3', '5'] },
  { contract_type: 'MULTUP', contract_category: 'multiplier', sentiment: 'up', expiry_type: 'no_expiry', multiplier_range: [80, 200, 400, 600, 800] },
  { contract_type: 'DIGITOVER', contract_category: 'digits', sentiment: 'up', expiry_type: 'tick', min_contract_duration: '1t', max_contract_duration: '10t' },
  { contract_type: 'TICKHIGH', contract_category: 'highlowticks', sentiment: 'up', expiry_type: 'tick', min_contract_duration: '5t', max_contract_duration: '5t' },
];

function shaped(key, sym = 'R_50', params = {}) {
  const entry = AUTO_CONTRACTS[key];
  const value = buildAutoValue(entry, { stake: 1, ...entry.defaults, ...params });
  value.stake = 1;
  const raw = buildProposal(entry.typeId, entry.side, value, sym);
  const { available, fields } = shapeProposal(entry, raw, V50);
  return { entry, available, fields };
}

test('a contract the market does not offer is reported unavailable', () => {
  const { available } = shaped('RUNHIGH', 'stpRNG');
  assert.equal(available, false);
});

test('turbos take the near-spot rung on the correct side of spot', () => {
  const long = shaped('TURBOSLONG');
  assert.ok(/^-0\.1224$/.test(long.fields.barrier), `Long barrier was ${long.fields.barrier}`);
  const short = shaped('TURBOSSHORT');
  assert.ok(/^\+0\.1224$/.test(short.fields.barrier), `Short barrier was ${short.fields.barrier}`);
});

test('vanillas snap to the nearest in-the-money strike', () => {
  // A Call is in the money below spot and a Put above it, so the generic +0.10
  // form offset is snapped onto the market's ladder on that side.
  assert.equal(shaped('VANILLALONGCALL').fields.barrier, '-0.0980');
  assert.equal(shaped('VANILLALONGPUT').fields.barrier, '+0.0980');
});

test('a higher/lower or touch barrier is taken from the market quote', () => {
  assert.equal(shaped('LOWER').fields.barrier, '+0.0230');
  assert.equal(shaped('NOTOUCH').fields.barrier, '+0.0652');
});

test('range contracts put the high barrier in `barrier` and the low in `barrier2`', () => {
  for (const key of ['RANGE', 'EXPIRYRANGE']) {
    const { fields } = shaped(key);
    assert.equal(fields.barrier, '+0.0652', key);
    assert.equal(fields.barrier2, '-0.0651', key);
  }
});

test('multipliers snap to the market ladder instead of a fixed value', () => {
  assert.equal(shaped('MULTUP').fields.multiplier, 400);
});

test('tick contracts are held to the catalogue window', () => {
  // TICKHIGH has no duration input at all but still needs a 5-tick expiry.
  assert.equal(shaped('TICKHIGH').fields.duration, 5);
  assert.equal(shaped('TICKHIGH').fields.duration_unit, 't');
  // A configured digit hold outside [1t, 10t] is clamped back into it.
  assert.equal(shaped('DIGITOVER:3', 'R_50', { duration: 30 }).fields.duration, 10);
});

test('a seconds contract is normalized into its published step', () => {
  const { fields } = shaped('LOWER', 'R_50', { duration: 5, unit: 'm' });
  assert.equal(fields.duration_unit, 's');
  assert.ok(['15', '30', '60'].includes(String(fields.duration)), `duration was ${fields.duration}`);
});

test('a duration below the market minimum is lifted to the minimum', () => {
  // UPORDOWN intraday on the 1HZ indices publishes a 2m–1d window with no
  // `unit_options`, and rejects anything under 2m with "Trading is not offered
  // for this duration". The engine proposed 1m and every Universal AI entry on
  // those markets was rejected; the catalogue minimum must lift it to 2m.
  const UPORDOWN = [{
    contract_type: 'UPORDOWN', contract_category: 'staysinout', sentiment: 'high_vol',
    expiry_type: 'intraday', high_barrier: '+2.04', low_barrier: '-2.03',
    min_contract_duration: '2m', max_contract_duration: '1d',
  }];
  const entry = AUTO_CONTRACTS.UPORDOWN;
  const value = buildAutoValue(entry, { stake: 1, ...entry.defaults, duration: 1, unit: 'm' });
  value.stake = 1;
  const raw = buildProposal(entry.typeId, entry.side, value, '1HZ100V');
  const { fields } = shapeProposal(entry, raw, UPORDOWN);
  assert.equal(fields.duration_unit, 'm');
  assert.equal(fields.duration, 2, 'a sub-minimum hold must rise to the catalogue minimum');
});

test('a duration above the market maximum is capped at the maximum', () => {
  const UPORDOWN = [{
    contract_type: 'UPORDOWN', contract_category: 'staysinout', sentiment: 'high_vol',
    expiry_type: 'intraday', high_barrier: '+2.04', low_barrier: '-2.03',
    min_contract_duration: '2m', max_contract_duration: '1h',
  }];
  const entry = AUTO_CONTRACTS.UPORDOWN;
  const value = buildAutoValue(entry, { stake: 1, ...entry.defaults, duration: 3, unit: 'd' });
  value.stake = 1;
  const raw = buildProposal(entry.typeId, entry.side, value, '1HZ100V');
  const { fields } = shapeProposal(entry, raw, UPORDOWN);
  assert.ok(['60m', '1h'].includes(`${fields.duration}${fields.duration_unit}`),
    `expected ~1h, got ${fields.duration}${fields.duration_unit}`);
});

test('an unknown catalogue leaves the raw fields untouched', () => {
  const entry = AUTO_CONTRACTS.TURBOSLONG;
  const value = buildAutoValue(entry, { stake: 1, ...entry.defaults });
  const raw = buildProposal(entry.typeId, entry.side, value, 'R_50');
  const { available, fields } = shapeProposal(entry, raw, null);
  assert.equal(available, null);
  assert.deepEqual(fields, raw);
});

// ── engine integration ───────────────────────────────────────────────────
// The engine must fetch a market's catalogue before it proposes, shape the
// proposal to it, skip contracts the market does not offer, and refresh the
// catalogue to retry a barrier the exchange has since re-priced.
const CF = [
  { contract_type: 'DIGITOVER', contract_category: 'digits', sentiment: 'up', expiry_type: 'tick', min_contract_duration: '1t', max_contract_duration: '10t' },
  { contract_type: 'VANILLALONGCALL', contract_category: 'vanilla', sentiment: 'up', expiry_type: 'intraday', barrier: '+0.60', barrier_choices: ['+1.10', '+0.60', '+0.00', '-0.60', '-1.10'] },
];

test('the engine fetches the catalogue, then shapes and sends the proposal', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.9, deferSpecs: true });
  engine.running = true;
  engine._scanAt = 0;
  engine._runScan();
  tick(engine, engine.autoMarket, 5000.44);
  // The catalogue is not known yet, so the request is raised and no proposal
  // is sent until it lands.
  assert.equal(client.cfReqs.length, 1, 'must request the catalogue first');
  assert.equal(client.proposals().length, 0, 'must not propose before the catalogue arrives');
  client.answerContractsFor(engine.autoMarket, CF);
  assert.equal(client.proposals().length, 1, 'proposal is sent once the catalogue arrives');
});

test('the engine skips a contract the market does not offer', () => {
  const { engine } = makeEngine({ contractKey: 'TURBOSLONG' });
  engine._cfCache.set('R_50', { at: Date.now(), avail: CF }); // digits only
  let ran = false;
  engine._ensureSpecs(AUTO_CONTRACTS.TURBOSLONG, 'R_50', () => { ran = true; });
  assert.equal(ran, false, 'must not propose a contract the market lacks');
});

test('a barrier rejection adopts the reported ladder and resends once', () => {
  const { engine, client } = makeEngine({ contractKey: 'VANILLALONGCALL' });
  engine._cfCache.set('R_50', { at: Date.now(), avail: CF });
  const entry = AUTO_CONTRACTS.VANILLALONGCALL;
  const value = buildAutoValue(entry, { stake: 1, ...entry.defaults });
  value.stake = 1;
  const raw = buildProposal(entry.typeId, entry.side, value, 'R_50');
  engine._shapedSend(entry, 'R_50', raw);
  assert.equal(client.proposals().length, 1);
  // The exchange reports the ladder it will actually accept.
  engine._onProposal({ error: { code: 'ContractBuyValidationError', message: 'Barriers available are +1.50, +0.80, +0.00, -0.80, -1.50.' } });
  assert.equal(client.proposals().length, 2, 'the proposal is retried exactly once');
  // The reported ladder is adopted for this market, so later entries snap to it.
  assert.deepEqual(
    engine._specs('R_50').find(r => r.contract_category === 'vanilla').barrier_choices,
    ['+1.50', '+0.80', '+0.00', '-0.80', '-1.50'],
  );
});

test('a non-barrier rejection is not retried', () => {
  const { engine, client } = makeEngine({ contractKey: 'DIGITOVER:3', leader: 'R_75', leaderRate: 0.9, deferSpecs: true });
  engine.running = true;
  engine._scanAt = 0;
  engine._runScan();
  tick(engine, engine.autoMarket, 5000.44);
  client.answerContractsFor(engine.autoMarket, CF);
  engine._onProposal({ error: { code: 'ContractBuyValidationError', message: "Please enter a stake amount that's at least 10.00." } });
  assert.equal(client.cfReqs.length, 0, 'a stake error must not trigger a catalogue refresh');
});
