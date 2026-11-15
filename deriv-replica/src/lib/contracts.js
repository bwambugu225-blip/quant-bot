// Deriv trade-type catalogue.
//
// Each entry declares the inputs that product needs, because Deriv trade types
// do not share a parameter set. `buildProposal` maps the form state onto the
// exact `proposal` payload the Deriv API expects. This is the manual-placement
// surface; the strategy builder drives the same proposals automatically.

export const CATEGORY_LABELS = {
  directional: 'Directional',
  digit_based: 'Digit based',
  growth_based: 'Growth based',
};

export const TRADE_TYPES = [
  {
    id: 'rise_fall', label: 'Rise/Fall',
    tooltip: 'Earn when the exit price is higher or lower than the entry price.',
    category: 'directional', popular: true,
    inputs: ['duration', 'stake', 'equals'], durationUnits: ['t', 's', 'm', 'h', 'd'],
    contracts: { up: 'CALL', down: 'PUT' }, equalsContracts: { up: 'CALLE', down: 'PUTE' },
    sides: ['Rise', 'Fall'],
  },
  {
    id: 'higher_lower', label: 'Higher/Lower',
    tooltip: 'Earn when the exit price is above or below your barrier.',
    category: 'directional', popular: true,
    inputs: ['duration', 'stake', 'barrier'], durationUnits: ['t', 's', 'm', 'h', 'd'],
    contracts: { up: 'HIGHER', down: 'LOWER' }, sides: ['Higher', 'Lower'], barrierKind: 'price',
  },
  {
    id: 'touch', label: 'Touch/No Touch',
    tooltip: 'Earn if the price touches or avoids your barrier before expiry.',
    category: 'directional', popular: true,
    inputs: ['duration', 'stake', 'barrier'], durationUnits: ['t', 's', 'm', 'h', 'd'],
    contracts: { up: 'ONETOUCH', down: 'NOTOUCH' }, sides: ['Touch', 'No Touch'], barrierKind: 'price',
  },
  {
    id: 'matches_differs', label: 'Matches/Differs',
    tooltip: 'Earn when the last digit matches or differs from your number.',
    category: 'digit_based', popular: true,
    inputs: ['duration', 'stake', 'digit'], durationUnits: ['t'],
    contracts: { up: 'DIGITMATCH', down: 'DIGITDIFF' }, sides: ['Matches', 'Differs'], barrierKind: 'digit',
  },
  {
    id: 'even_odd', label: 'Even/Odd',
    tooltip: 'Earn when the last digit is even or odd.',
    category: 'digit_based', popular: true,
    inputs: ['duration', 'stake'], durationUnits: ['t'],
    contracts: { up: 'DIGITEVEN', down: 'DIGITODD' }, sides: ['Even', 'Odd'],
  },
  {
    id: 'over_under', label: 'Over/Under',
    tooltip: 'Earn when the last digit is over or under your number.',
    category: 'digit_based', popular: true,
    inputs: ['duration', 'stake', 'digit'], durationUnits: ['t'],
    contracts: { up: 'DIGITOVER', down: 'DIGITUNDER' }, sides: ['Over', 'Under'], barrierKind: 'digit',
  },
  {
    id: 'stays_goes', label: 'Stays/Goes',
    tooltip: 'Earn if the price stays inside or breaks out of a two-barrier range.',
    category: 'directional',
    inputs: ['duration', 'stake', 'barrier', 'barrier2'], durationUnits: ['t', 's', 'm', 'h'],
    contracts: { up: 'RANGE', down: 'UPORDOWN' }, sides: ['Stays Between', 'Goes Outside'], barrierKind: 'range',
  },
  {
    id: 'ends_between', label: 'Ends Between/Outside',
    tooltip: 'Earn if the expiry price lands inside or outside a two-barrier range.',
    category: 'directional',
    inputs: ['duration', 'stake', 'barrier', 'barrier2'], durationUnits: ['t', 's', 'm', 'h'],
    contracts: { up: 'EXPIRYRANGE', down: 'EXPIRYMISS' }, sides: ['Ends Between', 'Ends Outside'], barrierKind: 'range',
  },
  {
    id: 'asians', label: 'Asian Up/Down',
    tooltip: 'Earn if the last tick is above or below the period average.',
    category: 'directional',
    inputs: ['duration', 'stake'], durationUnits: ['t', 's', 'm', 'h'],
    contracts: { up: 'ASIANU', down: 'ASIAND' }, sides: ['Asian Up', 'Asian Down'],
  },
  {
    id: 'resets', label: 'Reset Call/Put',
    tooltip: 'Call/Put with a midpoint reset that gives a second chance.',
    category: 'directional',
    inputs: ['duration', 'stake'], durationUnits: ['t', 's', 'm', 'h'],
    contracts: { up: 'RESETCALL', down: 'RESETPUT' }, sides: ['Reset Call', 'Reset Put'],
  },
  {
    id: 'highs_lows', label: 'High/Low Tick',
    tooltip: 'Predict which of the next five ticks is the highest or lowest.',
    category: 'directional',
    inputs: ['stake', 'selectedTick'], durationUnits: [],
    contracts: { up: 'TICKHIGH', down: 'TICKLOW' }, sides: ['High Tick', 'Low Tick'], tickWindow: 5,
  },
  {
    id: 'lookbacks', label: 'Lookbacks',
    tooltip: 'Payout scales with the range the price covers over the period.',
    category: 'growth_based',
    inputs: ['duration', 'stake', 'multiplier'], durationUnits: ['t', 's', 'm', 'h'],
    contracts: { up: 'LBFLOATCALL', down: 'LBFLOATPUT' }, sides: ['Close-Low', 'High-Close'],
  },
];

export function findTradeType(id) {
  return TRADE_TYPES.find(t => t.id === id) ?? TRADE_TYPES[0];
}

export function isDigitContract(id) {
  return findTradeType(id).category === 'digit_based';
}

export function needsDigitBarrier(id) {
  return id === 'matches_differs' || id === 'over_under';
}

// Maps a form selection onto the exact Deriv `proposal` fields.
export function buildProposal(type, side, value, symbol) {
  const t = findTradeType(type);
  let contractType = t.contracts[side] || t.contracts.up;
  if (type === 'rise_fall' && value.equals) contractType = t.equalsContracts[side] || contractType;

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
  if (t.inputs.includes('barrier2')) fields.barrier2 = String(value.barrier2 ?? value.barrier);
  if (t.inputs.includes('selectedTick')) fields.selected_tick = Math.max(1, Math.min(5, Math.round(+value.selectedTick || 1)));
  if (t.inputs.includes('multiplier')) fields.multiplier = +value.multiplier || 100;
  return fields;
}
