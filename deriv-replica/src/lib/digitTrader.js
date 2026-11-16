// Digit-contract autotrader logic: Over/Under and Even/Odd.
//
// Both products settle on the last digit of the tick price, so their only input
// is the digit stream itself — no candles, no indicators. This module measures
// the recent digit distribution, decides which side to take, and reports how
// far the sample departs from the baseline the contract is priced against.
//
// Honest limit: Deriv builds its synthetic indices so every digit is equally
// likely. A deviation measured here is a statement about the recent sample, not
// a forecast, so the trader gates on a z-score — how many standard errors the
// sample sits from the baseline — rather than on a raw percentage. It reports
// the measured edge and stands aside when the sample says nothing.

export const DIGIT_WINDOWS = [50, 100, 200, 300, 500];

// The two products. `over` wins on digits above the barrier and `under` on
// digits below it; the barrier digit wins neither, so the two baselines need
// not sum to 1. Even/Odd split the ten digits five and five, so both baselines
// are exactly 1/2.
export const DIGIT_MODES = [
  {
    id: 'over_under', label: 'Over/Under', tradeType: 'over_under',
    upLabel: 'Over', downLabel: 'Under', contractUp: 'DIGITOVER', contractDown: 'DIGITUNDER',
    barrier: true, tooltip: 'Earn when the last digit is over or under your barrier.',
  },
  {
    id: 'even_odd', label: 'Even/Odd', tradeType: 'even_odd',
    upLabel: 'Even', downLabel: 'Odd', contractUp: 'DIGITEVEN', contractDown: 'DIGITODD',
    barrier: false, tooltip: 'Earn when the last digit is even or odd.',
  },
];

export function digitMode(id) {
  return DIGIT_MODES.find(m => m.id === id) ?? DIGIT_MODES[0];
}

// A default that trades rarely and honestly: a 200-tick window, the two-sided
// auto pick, and a 2-sigma gate (a deviation this large is unlikely to be pure
// sampling noise) on top of a small absolute floor.
export function defaultDigitConfig() {
  return {
    mode: 'over_under', barrier: 4, window: 200, minEdge: 0.02, minZ: 2, side: 'auto',
    duration: 5,
  };
}

// Digit counts over the most recent `window` ticks. Only well-formed digits are
// counted, and `n` is that same count, so `counts` and `n` can never disagree
// when a stream carries a malformed entry.
export function digitCounts(digits, window) {
  const span = Math.max(1, Math.floor(window) || 1);
  const start = Math.max(0, digits.length - span);
  const counts = new Array(10).fill(0);
  let n = 0;
  for (let i = start; i < digits.length; i++) {
    const d = digits[i];
    if (Number.isFinite(d) && d >= 0 && d <= 9) { counts[d]++; n++; }
  }
  return { counts, n };
}

// The empirical win rate, the baseline, the edge (rate − baseline) and the
// z-score of each side of a digit contract.
export function sideRates(mode, barrier, counts, n) {
  const m = digitMode(mode);
  let upWins = 0, downWins = 0, upBase, downBase;
  if (m.id === 'even_odd') {
    for (let d = 0; d < 10; d++) { if (d % 2 === 0) upWins += counts[d]; else downWins += counts[d]; }
    upBase = 0.5; downBase = 0.5;
  } else {
    const b = Math.max(0, Math.min(9, Math.floor(barrier)));
    for (let d = 0; d < 10; d++) { if (d > b) upWins += counts[d]; else if (d < b) downWins += counts[d]; }
    upBase = (9 - b) / 10; downBase = b / 10;
  }
  const make = (side, label, contract, wins, base) => {
    const rate = n ? wins / n : 0;
    const se = n ? Math.sqrt((base * (1 - base)) / n) : Infinity;
    return {
      side, label, contract, rate, base, wins,
      edge: rate - base,
      z: se > 0 && Number.isFinite(se) ? (rate - base) / se : 0,
    };
  };
  return {
    mode: m,
    up: make('up', m.upLabel, m.contractUp, upWins, upBase),
    down: make('down', m.downLabel, m.contractDown, downWins, downBase),
  };
}

// How far the whole distribution sits from uniform, as a chi-square. 9 degrees
// of freedom; the 5% critical value is 16.9, so a figure below that is
// consistent with a fair digit stream.
export function digitBias(counts, n) {
  const expected = n / 10;
  let chi2 = 0;
  if (expected > 0) counts.forEach(c => { chi2 += ((c - expected) ** 2) / expected; });
  return { chi2, expected };
}

// The full live read for the panel: counts, both sides' rates, the distribution
// bias and the decision the trader would take right now.
export function digitRead(config, digits) {
  const cfg = { ...defaultDigitConfig(), ...config };
  const { counts, n } = digitCounts(digits, cfg.window);
  const rates = sideRates(cfg.mode, cfg.barrier, counts, n);
  const bias = digitBias(counts, n);
  const signal = n >= 20 ? pickSide(cfg, rates) : null;
  return { mode: cfg.mode, barrier: cfg.barrier, window: cfg.window, n, counts, rates, bias, signal };
}

// Choose the side the config asks for. `auto` takes whichever side sits further
// above its own baseline; an explicit side is only taken when it clears the
// gate itself.
function pickSide(cfg, rates) {
  const { up, down } = rates;
  let pick;
  if (cfg.side === 'up') pick = up;
  else if (cfg.side === 'down') pick = down;
  else pick = up.edge >= down.edge ? up : down;
  if (!(pick.edge >= cfg.minEdge)) return null;
  if (!(pick.z >= cfg.minZ)) return null;
  return pick;
}

// The trade the autotrader would place right now, or null when it stands aside.
// Null carries no proposal: the sample does not support an entry.
export function digitSignal(config, digits) {
  const cfg = { ...defaultDigitConfig(), ...config };
  const { counts, n } = digitCounts(digits, cfg.window);
  if (n < 20) return null;
  const rates = sideRates(cfg.mode, cfg.barrier, counts, n);
  const pick = pickSide(cfg, rates);
  if (!pick) return null;
  return {
    mode: rates.mode.id, tradeType: rates.mode.tradeType,
    side: pick.side, label: pick.label, contract: pick.contract,
    rate: pick.rate, base: pick.base, edge: pick.edge, z: pick.z,
    barrier: rates.mode.barrier ? Math.max(0, Math.min(9, Math.floor(cfg.barrier))) : null,
    sample: n, counts, rates,
  };
}
