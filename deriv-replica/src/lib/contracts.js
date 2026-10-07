// Deriv's trade-type catalogue with the exact inputs each product needs.
//
// Each product family exposes a different parameter dock in the real Trader
// App — Accumulators have no duration, Multipliers have a multiplier plus risk
// controls, Vanillas need a strike, and the digit products need a last-digit
// barrier. `inputs` drives which controls the Trade form renders, and
// `buildFields` maps the form state onto the exact `proposal` payload the
// Deriv API expects for that contract type.

export const CATEGORY_LABELS = {
  growth_based: 'Growth based',
  directional: 'Directional',
  digit_based: 'Digit based',
};

// `inputs` keys:
//   duration    → duration + duration_unit
//   stake       → amount / basis
//   barrier     → price barrier (relative "+0.10" for intraday, absolute digits)
//   digit       → last-digit barrier for the digit products
//   equals      → Rise/Fall "Allow equals" (CALLE/PUTE)
//   growthRate  → Accumulators growth rate
//   multiplier  → Multipliers leverage
//   risk        → take profit / stop loss limit_order
//   cancellation→ Multipliers deal cancellation
export const TRADE_TYPES = [
  {
    id: 'rise_fall',
    label: 'Rise/Fall',
    tooltip: 'Earn when the exit price is higher or lower than the entry price.',
    category: 'directional',
    popular: true,
    inputs: ['duration', 'stake', 'equals'],
    durationUnits: ['t', 's', 'm', 'h', 'd'],
    contracts: { up: 'CALL', down: 'PUT' },
    equalsContracts: { up: 'CALLE', down: 'PUTE' },
    sides: ['Rise', 'Fall'],
  },
  {
    id: 'higher_lower',
    label: 'Higher/Lower',
    tooltip: 'Earn when the exit price is above or below your barrier.',
    category: 'directional',
    popular: true,
    inputs: ['duration', 'stake', 'barrier'],
    durationUnits: ['t', 's', 'm', 'h', 'd'],
    contracts: { up: 'HIGHER', down: 'LOWER' },
    sides: ['Higher', 'Lower'],
    barrierKind: 'price',
  },
  {
    id: 'touch',
    label: 'Touch/No Touch',
    tooltip: 'Earn if the price touches or avoids your barrier before expiry.',
    category: 'directional',
    popular: true,
    inputs: ['duration', 'stake', 'barrier'],
    durationUnits: ['t', 's', 'm', 'h', 'd'],
    contracts: { up: 'ONETOUCH', down: 'NOTOUCH' },
    sides: ['Touch', 'No Touch'],
    barrierKind: 'price',
  },
  {
    id: 'matches_differs',
    label: 'Matches/Differs',
    tooltip: 'Earn when the last digit matches or differs from your number.',
    category: 'digit_based',
    popular: true,
    inputs: ['duration', 'stake', 'digit'],
    durationUnits: ['t'],
    contracts: { up: 'DIGITMATCH', down: 'DIGITDIFF' },
    sides: ['Matches', 'Differs'],
    barrierKind: 'digit',
  },
  {
    id: 'even_odd',
    label: 'Even/Odd',
    tooltip: 'Earn when the last digit is even or odd.',
    category: 'digit_based',
    popular: true,
    inputs: ['duration', 'stake'],
    durationUnits: ['t'],
    contracts: { up: 'DIGITEVEN', down: 'DIGITODD' },
    sides: ['Even', 'Odd'],
  },
  {
    id: 'over_under',
    label: 'Over/Under',
    tooltip: 'Earn when the last digit is over or under your number.',
    category: 'digit_based',
    popular: true,
    inputs: ['duration', 'stake', 'digit'],
    durationUnits: ['t'],
    contracts: { up: 'DIGITOVER', down: 'DIGITUNDER' },
    sides: ['Over', 'Under'],
    barrierKind: 'digit',
  },
  {
    id: 'accumulators',
    label: 'Accumulators',
    tooltip: 'Grow your stake exponentially while the price stays in range.',
    category: 'growth_based',
    popular: true,
    inputs: ['stake', 'growthRate', 'risk'],
    durationUnits: [],
    contracts: { up: 'ACCU', down: 'ACCU' },
    sides: ['Accumulate'],
  },
  {
    id: 'multipliers',
    label: 'Multipliers',
    tooltip: 'Leveraged trading with risk controls — losses capped at your stake.',
    category: 'growth_based',
    popular: true,
    inputs: ['stake', 'multiplier', 'risk', 'cancellation'],
    durationUnits: [],
    contracts: { up: 'MULTUP', down: 'MULTDOWN' },
    sides: ['Up', 'Down'],
    defaultMultiplier: 100,
    multipliers: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000],
  },
  {
    id: 'turbos',
    label: 'Turbos',
    tooltip: 'Directional trade with a barrier knockout.',
    category: 'growth_based',
    inputs: ['duration', 'stake', 'barrier'],
    durationUnits: ['t', 's', 'm', 'h', 'd'],
    contracts: { up: 'TURBOSLONG', down: 'TURBOSSHORT' },
    sides: ['Up', 'Down'],
    barrierKind: 'price',
  },
  {
    id: 'vanillas',
    label: 'Vanillas',
    tooltip: 'Earn if the price ends above or below your strike price.',
    category: 'growth_based',
    inputs: ['duration', 'stake', 'barrier'],
    durationUnits: ['d', 'h', 'm', 's'],
    contracts: { up: 'VANILLALONGCALL', down: 'VANILLALONGPUT' },
    sides: ['Call', 'Put'],
    barrierKind: 'price',
  },
];

export function findTradeType(id) {
  return TRADE_TYPES.find(t => t.id === id) ?? TRADE_TYPES[0];
}

export function isDigitContract(id) {
  return findTradeType(id).category === 'digit_based';
}

// Digit contract types that take a last-digit barrier.
export function needsDigitBarrier(id) {
  return id === 'matches_differs' || id === 'over_under';
}

// Maps a form selection onto the exact Deriv `proposal` fields.
//   side    → 'up' | 'down'
//   value   → { duration, unit, stake, barrier, digit, equals, growthRate,
//               multiplier, takeProfit, stopLoss, cancellation }
export function buildProposal(type, side, value, symbol) {
  const t = findTradeType(type);
  let contractType = t.contracts[side] || t.contracts.up;
  if (type === 'rise_fall' && value.equals) {
    contractType = t.equalsContracts[side] || contractType;
  }

  const fields = {
    contract_type: contractType,
    underlying_symbol: symbol,
    amount: +(+value.stake).toFixed(2),
    basis: 'stake',
    currency: 'USD',
  };

  if (t.inputs.includes('duration')) {
    fields.duration = Math.max(1, Math.round(+value.duration || 1));
    fields.duration_unit = value.unit || 't';
  }
  if (t.inputs.includes('digit')) fields.barrier = String(value.digit);
  if (t.inputs.includes('barrier')) fields.barrier = String(value.barrier);
  if (t.inputs.includes('growthRate')) fields.growth_rate = +value.growthRate || 0.01;
  if (t.inputs.includes('multiplier')) fields.multiplier = +value.multiplier || 100;
  if (t.inputs.includes('cancellation') && value.cancellation) fields.cancellation = value.cancellation;
  if (t.inputs.includes('risk')) {
    const lo = {};
    if (+value.takeProfit > 0) lo.take_profit = +value.takeProfit;
    if (+value.stopLoss > 0) lo.stop_loss = +value.stopLoss;
    if (Object.keys(lo).length) fields.limit_order = lo;
  }
  return fields;
}
