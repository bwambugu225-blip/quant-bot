// Calculated volume.
//
// Deriv's synthetic indices publish no traded volume — the API sends prices and
// epochs, nothing else — so volume has to be derived from the tape. The honest
// reading of a tick stream is that a tick which *moves* the price is carrying
// activity and a tick that repeats the last price is not. This module turns that
// into a number:
//
//     volume(tick) = moveWeight(move size) × activity(time since previous tick)
//
// The move is measured in the symbol's own pip steps and divided by the
// symbol's typical move, so "big" means big *for this market*. Without that
// normalisation a raw price difference would make R_75's volume ~30,000×
// R_100's for the same relative move, which is meaningless. The weight is
// concave (a square root): a move four times the typical size weighs twice as
// much, so one outsized jump counts for more than an ordinary tick without
// swamping the window the way a raw magnitude would.
//
// Activity is 1 for a tick that arrives on the symbol's normal cadence (1s or
// 2s — see `tickSeconds`). A tick that took longer to arrive covers more elapsed
// time, so it counts proportionally more; a tick faster than the cadence still
// counts as a full tick, so the weight never falls below 1.
//
// The scale is self-calibrating: the typical move is the median absolute move
// of the symbol's recent tape, so the reading needs no per-symbol constant and
// adapts when volatility shifts. Everything here is pure.

import { pipSize, tickSeconds } from './symbols.js';

// Used only before enough of the tape has arrived to measure the symbol's own
// typical move, in pip steps. The median takes over after a handful of ticks.
const FALLBACK_MOVE_STEPS = 1;

// The absolute price change between consecutive ticks, skipping non-finite
// entries. The first tick has no predecessor and is not represented.
export function tickMoves(prices) {
  const out = [];
  for (let i = 1; i < prices.length; i++) {
    const d = Math.abs(Number(prices[i]) - Number(prices[i - 1]));
    if (Number.isFinite(d)) out.push(d);
  }
  return out;
}

function median(values) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// The symbol's typical (median) absolute move in price units. `moves` is the
// array from `tickMoves`. A market that mostly repeats its last price has a
// small unit, so the ticks that do move stand out; a jittery market has a large
// unit, so an ordinary tick is unremarkable. Falls back to one pip step when the
// tape is too short or entirely flat to measure.
export function moveUnit(moves, sym) {
  const positive = moves.filter(m => m > 0);
  const med = median(positive);
  const step = Math.pow(10, -pipSize(sym));
  if (med == null || !(med > 0)) return FALLBACK_MOVE_STEPS * step;
  return med;
}

// One tick's volume. `move` is the absolute price change from the previous tick,
// `dtSec` the seconds since it, `unit` the symbol's typical move (from
// `moveUnit`) and `cadenceSec` the symbol's normal tick interval.
//
//   moveWeight = sqrt(move / unit) — the move in units of the typical move,
//                under a square root so the response is concave.
//   activity   = max(1, dtSec / cadenceSec) — the elapsed time this tick covers,
//                in units of the normal cadence.
//
// A flat tick (move 0) still carries the activity weight: the time passed, not
// the size, is what a repeated price measures. That keeps a quiet market's
// volume from collapsing to zero and makes the series continuous.
export function tickVolume(move, dtSec, unit, cadenceSec = 1) {
  const u = unit > 0 ? unit : 1;
  const cad = cadenceSec > 0 ? cadenceSec : 1;
  const m = Number.isFinite(move) && move > 0 ? move : 0;
  const weight = m > 0 ? Math.sqrt(m / u) : 0;
  const activity = Math.max(1, (Number.isFinite(dtSec) ? dtSec : cad) / cad);
  return weight * activity;
}

// Calculated volume for every tick in a tape, aligned to `prices` (the first
// entry is 0 — a tick with no predecessor carries no measured move). `times` is
// optional; without it every tick is assumed to arrive on cadence.
export function tickVolumes(prices, times, sym) {
  const n = prices.length;
  if (!n) return [];
  const cadence = tickSeconds(sym);
  const moves = tickMoves(prices);
  const unit = moveUnit(moves, sym);
  const out = [0];
  for (let i = 1; i < n; i++) {
    const move = Math.abs(Number(prices[i]) - Number(prices[i - 1]));
    const dt = times && times.length > i ? Number(times[i]) - Number(times[i - 1]) : cadence;
    out.push(tickVolume(move, dt, unit, cadence));
  }
  return out;
}

// Average calculated volume per tick over the last `window` ticks — how much
// the tape is moving per tick right now, on the symbol's own scale. Rising means
// each tick is carrying more than the tape's norm; falling means it is
// quietening. The scale comes from the *whole* tape passed in, not the window:
// normalising on the window alone would make every window read ~1 and hide the
// very change this measures. Returns null while the window is still warming up.
export function volumeActivity(prices = [], times = [], sym, window = 50) {
  if (prices.length < window + 1) return null;
  const cadence = tickSeconds(sym);
  const unit = moveUnit(tickMoves(prices), sym);
  const start = prices.length - window;
  let sum = 0;
  for (let i = start; i < prices.length; i++) {
    const move = Math.abs(Number(prices[i]) - Number(prices[i - 1]));
    const dt = times.length > i ? Number(times[i]) - Number(times[i - 1]) : cadence;
    sum += tickVolume(move, dt, unit, cadence);
  }
  return sum / window;
}
