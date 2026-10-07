// Deriv's canonical trade-type catalogue, mirroring AVAILABLE_CONTRACTS in
// the real Trader AppV2 source (Utils/trade-types-utils.tsx).

export const CONTRACT_LIST = {
  ACCUMULATORS: 'Accumulators',
  VANILLAS: 'Vanillas',
  TURBOS: 'Turbos',
  MULTIPLIERS: 'Multipliers',
  RISE_FALL: 'Rise/Fall',
  HIGHER_LOWER: 'Higher/Lower',
  TOUCH_NO_TOUCH: 'Touch/No Touch',
  MATCHES_DIFFERS: 'Matches/Differs',
  EVEN_ODD: 'Even/Odd',
  OVER_UNDER: 'Over/Under',
};

// `subtypes` maps to Deriv's TradeTypeTabs: the pair of Buy/Sell labels shown
// above the purchase buttons for the selected contract.
export const TRADE_TYPES = [
  {
    id: CONTRACT_LIST.RISE_FALL,
    label: 'Rise/Fall',
    tooltip: 'Earn when exit price is higher or lower than entry price.',
    category: 'directional',
    popular: true,
    fire: true,
    subtypes: [
      { id: 'rise_fall', label: 'Rise/Fall', labels: ['Rise', 'Fall'] },
      { id: 'rise_fall_equal', label: 'Rise/Fall (Equals)', labels: ['Rise', 'Fall'] },
    ],
  },
  {
    id: CONTRACT_LIST.ACCUMULATORS,
    label: 'Accumulators',
    tooltip: 'Grow your stake exponentially while price stays in range.',
    category: 'growth_based',
    popular: true,
    fire: true,
    subtypes: [{ id: 'accumulator', label: 'Accumulators', labels: ['Accumulate', 'Accumulate'] }],
  },
  {
    id: CONTRACT_LIST.MULTIPLIERS,
    label: 'Multipliers',
    tooltip: 'Leveraged trading with risk controls.',
    category: 'growth_based',
    popular: true,
    subtypes: [{ id: 'multiplier', label: 'Multipliers', labels: ['Up', 'Down'] }],
  },
  {
    id: CONTRACT_LIST.TURBOS,
    label: 'Turbos',
    tooltip: 'Directional trade with barrier knockout.',
    category: 'growth_based',
    subtypes: [{ id: 'turbos', label: 'Turbos', labels: ['Up', 'Down'] }],
  },
  {
    id: CONTRACT_LIST.VANILLAS,
    label: 'Vanillas',
    tooltip: 'Earn if price ends above or below strike price.',
    category: 'growth_based',
    subtypes: [{ id: 'vanilla', label: 'Vanillas', labels: ['Call', 'Put'] }],
  },
  {
    id: CONTRACT_LIST.HIGHER_LOWER,
    label: 'Higher/Lower',
    tooltip: 'Earn when exit price is above or below barrier.',
    category: 'directional',
    subtypes: [{ id: 'high_low', label: 'Higher/Lower', labels: ['Higher', 'Lower'] }],
  },
  {
    id: CONTRACT_LIST.TOUCH_NO_TOUCH,
    label: 'Touch/No Touch',
    tooltip: 'Earn if price touches or avoids your barrier before expiry.',
    category: 'directional',
    subtypes: [{ id: 'touch', label: 'Touch/No Touch', labels: ['Touch', 'No Touch'] }],
  },
  {
    id: CONTRACT_LIST.MATCHES_DIFFERS,
    label: 'Matches/Differs',
    tooltip: 'Earn when final digit matches or differs.',
    category: 'digit_based',
    popular: true,
    subtypes: [{ id: 'match_diff', label: 'Matches/Differs', labels: ['Matches', 'Differs'] }],
  },
  {
    id: CONTRACT_LIST.OVER_UNDER,
    label: 'Over/Under',
    tooltip: 'Earn when final digit is over or under your number.',
    category: 'digit_based',
    popular: true,
    subtypes: [{ id: 'over_under', label: 'Over/Under', labels: ['Over', 'Under'] }],
  },
  {
    id: CONTRACT_LIST.EVEN_ODD,
    label: 'Even/Odd',
    tooltip: 'Earn when final digit is even or odd.',
    category: 'digit_based',
    subtypes: [{ id: 'even_odd', label: 'Even/Odd', labels: ['Even', 'Odd'] }],
  },
];

export const CATEGORY_LABELS = {
  growth_based: 'Growth based',
  directional: 'Directional',
  digit_based: 'Digit based',
};

// Only the contract types above evaluate to a directional up/down outcome.
const DIRECTIONAL = new Set([
  'rise_fall',
  'rise_fall_equal',
  'high_low',
  'touch',
  'turbos',
  'vanilla',
  'multiplier',
]);

export function findTradeType(id) {
  return TRADE_TYPES.find(t => t.id === id) ?? TRADE_TYPES[0];
}

export function isDigitContract(id) {
  const parent = TRADE_TYPES.find(t => t.subtypes.some(s => s.id === id));
  return parent?.category === 'digit_based';
}

export function isDirectional(id) {
  return DIRECTIONAL.has(id);
}
