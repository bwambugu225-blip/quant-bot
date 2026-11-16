import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRENCY, DEFAULT_STAKE, USD_KES, addComma, toKes, kes, money, stakeLabel,
} from '../src/lib/format.js';
import { buildProposal } from '../src/lib/contracts.js';
import { defaultStrategy, STRATEGY_TEMPLATES } from '../src/lib/strategyBuilder.js';
import { Engine } from '../src/lib/engine.js';

test('the terminal currency is KES and the default stake is 0.35', () => {
  assert.equal(CURRENCY, 'KES');
  assert.equal(DEFAULT_STAKE, 0.35);
});

test('addComma fixes the decimals and groups thousands', () => {
  assert.equal(addComma(1234.5), '1,234.50');
  assert.equal(addComma(0), '0.00');
  assert.equal(addComma(7, 0), '7');
});

test('toKes converts a USD figure at the display rate', () => {
  assert.equal(toKes(1), USD_KES);
  assert.equal(toKes(0.35), 0.35 * USD_KES);
});

test('kes formats an amount already in shillings, sign leading the code', () => {
  assert.equal(kes(0.35), 'KES 0.35');
  assert.equal(kes(1234.5), 'KES 1,234.50');
  assert.equal(kes(-12.5), '-KES 12.50');
});

test('money shows a KES account as-is and converts any other account', () => {
  assert.equal(money(1000, 'KES'), 'KES 1,000.00');
  assert.equal(money(10, 'USD'), kes(toKes(10)));
});

test('stakeLabel names the currency', () => {
  assert.equal(stakeLabel(), 'Stake (KES)');
  assert.equal(stakeLabel('Amount'), 'Amount (KES)');
});

test('a proposal defaults to KES and honours an explicit account currency', () => {
  const value = { stake: 0.35, duration: 5, unit: 't' };
  const kesProposal = buildProposal('rise_fall', 'up', value, 'R_100');
  assert.equal(kesProposal.currency, 'KES');
  assert.equal(kesProposal.amount, 0.35);
  assert.equal(kesProposal.basis, 'stake');

  const usdProposal = buildProposal('rise_fall', 'up', value, 'R_100', 'USD');
  assert.equal(usdProposal.currency, 'USD');
});

test('every built-in strategy starts at the default stake', () => {
  assert.equal(defaultStrategy().risk.stake, DEFAULT_STAKE);
  for (const make of STRATEGY_TEMPLATES) {
    assert.equal(make().risk.stake, DEFAULT_STAKE);
  }
});

test('the engine floors a stake at the default and labels it with the account currency', () => {
  const engine = new Engine();
  // Below the venue minimum → lifted to 0.35.
  assert.equal(engine._stakeFor({ stake: 0.01 }), DEFAULT_STAKE);
  assert.equal(engine._stakeFor({ stake: 0.35 }), DEFAULT_STAKE);
  // Above the floor → kept.
  assert.equal(engine._stakeFor({ stake: 2 }), 2);

  // Unauthenticated, the snapshot falls back to the terminal currency.
  assert.equal(engine.accountCurrency(), CURRENCY);
  assert.equal(engine.snapshot().currency, CURRENCY);

  // Authenticated on a USD account, the trade currency follows the account.
  engine.accounts = [{ account: 'CR1', currency: 'USD' }];
  engine.client = { auth: true, accountId: 'CR1', currency: 'USD', balance: 500 };
  assert.equal(engine.accountCurrency(), 'USD');
  assert.equal(engine.snapshot().currency, 'USD');
});
