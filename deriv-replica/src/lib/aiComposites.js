// AI composite indicators.
//
// Each of these blends several independent measurements into one interpretable
// reading, so the panel shows a handful of judged signals rather than dozens of
// raw numbers. They are deterministic and explainable: every score carries the
// evidence that produced it, and no score is a calibrated probability of a win.
// A reading of 70 means "70 out of 100 of the evidence we measure lines up",
// not "70% chance".

import {
  atrSeries, rsiSeries, adxSeries, closes, lastOf, mean,
} from './indicators.js';
import { tickIntelligence, rangeExpansion } from './microstructure.js';
import { candleRead } from './candleIntelligence.js';
import { marketStructure, fairValueGaps, liquiditySweeps } from './marketStructure.js';

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const score = v => (v == null || Number.isNaN(v) ? null : clamp(Math.round(v)));

// 01. Velocity Pulse — tick velocity, acceleration and momentum combined into a
// signed -100…+100 directional movement strength.
export function velocityPulse(prices, times) {
  const t = tickIntelligence(prices, times);
  if (t.velocity == null && t.acceleration == null) return { score: null, direction: null, evidence: {} };
  const vel = t.velocity || 0;
  const acc = t.acceleration || 0;
  const mom = (t.directionRatio != null ? (t.directionRatio - 0.5) * 2 : 0);
  const raw = (Math.sign(vel) * Math.min(1, Math.abs(vel) * 100) * 0.5) + (Math.sign(acc) * Math.min(1, Math.abs(acc) * 100) * 0.2) + mom * 0.3;
  return {
    score: score(Math.abs(raw) * 100),
    direction: raw > 0.05 ? 'up' : raw < -0.05 ? 'down' : 'flat',
    evidence: { velocity: vel, acceleration: acc, momentum: mom },
  };
}

// 02. Exhaustion Radar — large displacement, fading follow-through and a
// rejection wick. High readings flag a move that may be running out of fuel.
export function exhaustionRadar(candles, prices, times) {
  const c = candleRead(candles);
  const t = tickIntelligence(prices, times);
  const disp = c.displacement ?? 0;
  const decay = t.exhaustion ?? 0;
  const reject = c.rejection ? 1 : 0;
  const acc = Math.abs(t.acceleration || 0);
  const raw = (Math.min(1, disp / 2) * 0.35) + (Math.min(1, decay * 100) * 0.3) + (reject * 0.2) + (Math.min(1, acc * 50) * 0.15);
  return {
    score: score(raw * 100),
    direction: c.rejection === 'bullish' ? 'up' : c.rejection === 'bearish' ? 'down' : null,
    evidence: { displacement: disp, deceleration: decay, rejection: c.rejection, acceleration: t.acceleration },
  };
}

// 03. Liquidity Trap Detector — a swing that was broken then reclaimed, with no
// follow-through. High readings flag a probable false breakout.
export function liquidityTrap(candles) {
  const sweeps = liquiditySweeps(candles);
  const struct = marketStructure(candles);
  if (!sweeps.length) {
    return { score: score(struct.bias === 'ranging' ? 30 : 15), direction: null, evidence: { sweeps: 0, bias: struct.bias } };
  }
  const recent = sweeps[sweeps.length - 1];
  const raw = 60 + Math.min(40, sweeps.length * 12);
  return {
    score: score(raw),
    direction: recent.type === 'bullish' ? 'up' : 'down',
    evidence: { sweeps: sweeps.length, latest: recent.type, bias: struct.bias },
  };
}

// 04. Microstructure Pressure — tick streaks, direction ratio and efficiency
// blended into a signed pressure read.
export function microstructurePressure(prices, times) {
  const t = tickIntelligence(prices, times);
  if (t.pressure == null) return { score: null, direction: null, evidence: {} };
  return {
    score: score(Math.abs(t.pressure) * 100),
    direction: t.pressure > 0.05 ? 'up' : t.pressure < -0.05 ? 'down' : 'flat',
    evidence: { streak: t.streak, directionRatio: t.directionRatio, efficiency: t.efficiency },
  };
}

// 05. Volatility Storm — ATR, realised tick volatility and range expansion
// together. High readings mean abnormal volatility.
export function volatilityStorm(candles, prices) {
  const atr = atrSeries(candles, 14);
  const atrNow = lastOf(atr);
  const atrBase = mean(atr.filter(v => v != null).slice(-50));
  const atrRatio = atrBase ? atrNow / atrBase : 1;
  const realized = tickIntelligence(prices, []).realized;
  const expansion = rangeExpansion(candles) ?? 1;
  const raw = (Math.min(2, atrRatio) / 2 * 0.4) + (Math.min(2, expansion) / 2 * 0.35) + (realized != null ? 0.25 : 0);
  return {
    score: score(raw * 100),
    direction: null,
    evidence: { atrRatio, rangeExpansion: expansion, realizedVol: realized },
  };
}

// 06. Reversal Probability Model — reversal evidence scored together: a
// structural shift, a rejection, and momentum divergence. It is a score out of
// 100, not a calibrated probability.
export function reversalProbability(candles) {
  const struct = marketStructure(candles);
  const c = candleRead(candles);
  const cl = closes(candles);
  const rsi = rsiSeries(cl, 14);
  const rsiNow = lastOf(rsi);
  const priceRising = cl.length >= 5 && cl[cl.length - 1] > cl[cl.length - 5];
  const rsiFalling = rsiNow != null && lastOf(rsi.slice(0, -5)) != null && rsiNow < lastOf(rsi.slice(0, -5));
  const divergence = (priceRising && rsiFalling) || (!priceRising && rsiNow != null && !rsiFalling);
  let raw = 0;
  if (struct.event?.kind === 'CHoCH') raw += 40;
  else if (struct.event?.kind === 'BOS') raw += 20;
  if (c.rejection) raw += 25;
  if (divergence) raw += 20;
  if (struct.bias === 'ranging') raw += 15;
  return {
    score: score(raw),
    direction: struct.event?.direction || (c.rejection === 'bullish' ? 'up' : c.rejection === 'bearish' ? 'down' : null),
    evidence: { event: struct.event?.kind || null, rejection: c.rejection, divergence },
  };
}

// 07. Breakout Quality Score — displacement, where the bar closed in its range,
// follow-through and a retest.
export function breakoutQuality(candles) {
  const c = candleRead(candles);
  if (!candles.length) return { score: null, direction: null, evidence: {} };
  const cur = candles[candles.length - 1];
  const range = cur.high - cur.low || 1;
  const closePos = (cur.close - cur.low) / range;      // 0 at low, 1 at high
  const dir = cur.close >= cur.open ? 'up' : 'down';
  const closeQuality = dir === 'up' ? closePos : 1 - closePos;
  const disp = Math.min(1, (c.displacement ?? 0) / 2);
  const struct = marketStructure(candles);
  const followThrough = struct.event?.direction === dir ? 1 : 0;
  const raw = (disp * 0.4) + (closeQuality * 0.35) + (followThrough * 0.25);
  return {
    score: score(raw * 100),
    direction: dir,
    evidence: { displacement: c.displacement, closePosition: closePos, followThrough: !!followThrough },
  };
}

// 08. Trend Persistence Score — directional consistency and path efficiency.
export function trendPersistence(candles, prices) {
  const cl = closes(candles);
  const adx = adxSeries(candles, 14);
  const adxNow = lastOf(adx);
  const eff = tickIntelligence(prices, []).efficiency ?? 0;
  const t = tickIntelligence(prices, []);
  const consistency = t.trendStrength ?? 0.5;
  const raw = (Math.min(1, (adxNow || 0) / 50) * 0.4) + (eff * 0.35) + (Math.max(0, consistency - 0.5) * 2 * 0.25);
  return {
    score: score(raw * 100),
    direction: cl.length >= 2 ? (cl[cl.length - 1] >= cl[0] ? 'up' : 'down') : null,
    evidence: { adx: adxNow, efficiency: eff, consistency },
  };
}

// 09. Market Regime Classifier — trending, ranging, compression or expansion,
// from ADX, the efficiency ratio and band/ATR behaviour.
export function regimeClassifier(candles, prices) {
  const adx = lastOf(adxSeries(candles, 14));
  const eff = tickIntelligence(prices, []).efficiency ?? 0;
  const expansion = rangeExpansion(candles) ?? 1;
  const atr = atrSeries(candles, 14);
  const atrNow = lastOf(atr);
  const atrBase = mean(atr.filter(v => v != null).slice(-50));
  const volRatio = atrBase ? atrNow / atrBase : 1;

  let regime = 'normal';
  if (adx != null && adx > 25 && eff > 0.35) regime = 'trending';
  else if (adx != null && adx < 18 && eff < 0.25) regime = 'ranging';
  if (volRatio < 0.7 && expansion < 0.8) regime = 'compression';
  else if (volRatio > 1.6 || expansion > 1.8) regime = 'expansion';

  return {
    score: score(regime === 'trending' ? 80 : regime === 'ranging' ? 40 : regime === 'compression' ? 50 : 70),
    regime,
    direction: null,
    evidence: { adx, efficiency: eff, volRatio, rangeExpansion: expansion },
  };
}

// 10. Trade Confluence Score — independent evidence counted together into the
// final setup quality, with a verdict and the reasons behind it.
export function confluenceScore({ candles, prices, times }) {
  const pulse = velocityPulse(prices, times);
  const pressure = microstructurePressure(prices, times);
  const regime = regimeClassifier(candles, prices);
  const breakout = breakoutQuality(candles);
  const reversal = reversalProbability(candles);
  const struct = marketStructure(candles);

  // Pick the side the evidence leans toward, then count how many independent
  // engines agree with it.
  const votes = [pulse.direction, pressure.direction, breakout.direction, reversal.direction]
    .filter(d => d === 'up' || d === 'down');
  const ups = votes.filter(d => d === 'up').length;
  const downs = votes.filter(d => d === 'down').length;
  const direction = ups === downs ? null : ups > downs ? 'up' : 'down';

  const parts = [pulse.score, pressure.score, breakout.score, reversal.score].filter(v => v != null);
  const base = parts.length ? mean(parts) : 0;
  const agreement = votes.length ? Math.max(ups, downs) / votes.length : 0;
  // A trending regime is worth more to a directional entry than a ranging one.
  const regimeBonus = regime.regime === 'trending' ? 12 : regime.regime === 'ranging' ? -10 : 0;
  const structBonus = struct.bias === (direction === 'up' ? 'bullish' : 'bearish') ? 8 : 0;

  const total = score(base * (0.6 + agreement * 0.4) + regimeBonus + structBonus);
  const verdict = total == null ? 'NO DATA' : total >= 70 && direction ? (direction === 'up' ? 'BUY' : 'SELL') : total >= 55 ? 'WAIT FOR CONFIRMATION' : 'STAND ASIDE';

  return {
    score: total,
    direction,
    verdict,
    agreement,
    regime: regime.regime,
    evidence: {
      velocityPulse: pulse.score,
      microstructure: pressure.score,
      breakout: breakout.score,
      reversal: reversal.score,
      structure: struct.bias,
    },
  };
}

// The whole AI panel in one call.
export function aiRead({ candles = [], prices = [], times = [] } = {}) {
  return {
    velocityPulse: velocityPulse(prices, times),
    exhaustionRadar: exhaustionRadar(candles, prices, times),
    liquidityTrap: liquidityTrap(candles),
    microstructurePressure: microstructurePressure(prices, times),
    volatilityStorm: volatilityStorm(candles, prices),
    reversalProbability: reversalProbability(candles),
    breakoutQuality: breakoutQuality(candles),
    trendPersistence: trendPersistence(candles, prices),
    regimeClassifier: regimeClassifier(candles, prices),
    confluence: confluenceScore({ candles, prices, times }),
    gaps: fairValueGaps(candles).length,
  };
}
