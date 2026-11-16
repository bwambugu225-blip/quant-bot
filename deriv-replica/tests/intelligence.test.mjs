// Tests for the intelligence layers built on top of the tape: tick
// microstructure, market structure, candle intelligence and the AI composites.
// Every function is fed a deterministic tape from helpers.mjs, so a failure is
// always reproducible.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tickReturns, tickVelocity, tickAcceleration, tickFrequency, tickDirectionRatio,
  tickStreak, microDisplacement, priceEfficiency, tickVolatility, realizedVolatility,
  volatilityBurst, microTrendStrength, tickReversalRate, accelerationExhaustion,
  rangeExpansion, tickIntelligence,
} from '../src/lib/microstructure.js';
import {
  swings, labelSwings, marketStructure, fairValueGaps, orderBlocks,
  liquiditySweeps, equalExtremes, premiumDiscount, structureRead,
} from '../src/lib/marketStructure.js';
import {
  bodyStrength, wickPressure, candleDisplacement, consecutiveStrength, rejection,
  isEngulfing, isInsideBar, isOutsideBar, threeCandleReversal, candleImbalance,
  effortVsResult, candleRead,
} from '../src/lib/candleIntelligence.js';
import {
  velocityPulse, exhaustionRadar, liquidityTrap, microstructurePressure,
  volatilityStorm, reversalProbability, breakoutQuality, trendPersistence,
  regimeClassifier, confluenceScore, aiRead,
} from '../src/lib/aiComposites.js';
import { bucketTicksByCount, TICK_BAR_SIZES } from '../src/lib/marketStore.js';
import { tickTape, candles } from './helpers.mjs';

const tape = tickTape(400, 7, 0.00005, 0.0006);
const up = tickTape(400, 3, 0.0006, 0.0002);     // strong upward drift
const down = tickTape(400, 3, -0.0006, 0.0002); // strong downward drift
const C = candles(200, 5, 0.0003);

// ── microstructure ─────────────────────────────────────────────────────────
test('tickReturns is the first difference of the tape', () => {
  assert.deepEqual(tickReturns([1, 3, 6, 10]), [2, 3, 4]);
});

test('tickVelocity is signed and finite on a real tape', () => {
  const vUp = tickVelocity(up.prices, up.times, 20);
  const vDown = tickVelocity(down.prices, down.times, 20);
  assert.ok(Number.isFinite(vUp));
  assert.ok(vUp > 0, 'an upward tape has positive velocity');
  assert.ok(vDown < 0, 'a downward tape has negative velocity');
  assert.equal(tickVelocity([1, 2], [1, 2], 20), null);
});

test('tickFrequency counts ticks per second', () => {
  // One tick per second: a 5-second window holds about 5 ticks → ~1/s.
  const f = tickFrequency(tape.times, 5);
  assert.ok(f > 0.5 && f < 2, `frequency was ${f}`);
  assert.equal(tickFrequency([1], 5), null);
});

test('tickDirectionRatio reflects the drift', () => {
  assert.ok(tickDirectionRatio(up.prices, 100) > 0.5);
  assert.ok(tickDirectionRatio(down.prices, 100) < 0.5);
});

test('tickStreak is signed and non-zero for a monotone run', () => {
  assert.equal(tickStreak([1, 2, 3, 4]), 3);
  assert.equal(tickStreak([4, 3, 2, 1]), -3);
});

test('microDisplacement is near +1 for a clean climb', () => {
  const d = microDisplacement(Array.from({ length: 40 }, (_, i) => i), 40);
  assert.ok(d > 0.99);
});

test('priceEfficiency is 1 for a straight line and low for a zig-zag', () => {
  assert.ok(priceEfficiency(Array.from({ length: 40 }, (_, i) => i), 40) > 0.99);
  assert.ok(priceEfficiency(Array.from({ length: 40 }, (_, i) => (i % 2)), 40) < 0.1);
});

test('volatility functions are non-negative and burst is a ratio', () => {
  assert.ok(tickVolatility(tape.prices, 50) >= 0);
  assert.ok(realizedVolatility(tape.prices, 50) >= 0);
  const b = volatilityBurst(tape.prices, 20, 100);
  assert.ok(b == null || b >= 0);
});

test('trend strength and reversal rate are complementary', () => {
  const s = microTrendStrength(up.prices, 30);
  const r = tickReversalRate(up.prices, 30);
  assert.ok(s >= 0 && s <= 1);
  assert.ok(r >= 0 && r <= 1);
});

test('rangeExpansion compares the last bar to its recent average', () => {
  const small = Array.from({ length: 25 }, () => ({ high: 1.1, low: 0.9, close: 1, open: 1 }));
  const withSpike = [...small, { high: 3, low: 0, close: 2, open: 1 }];
  assert.ok(rangeExpansion(withSpike, 20) > 1.5);
  assert.equal(rangeExpansion([{ high: 1, low: 0 }], 20), null);
});

test('tickIntelligence returns a coherent bundle with a bounded pressure', () => {
  const t = tickIntelligence(tape.prices, tape.times);
  for (const k of ['velocity', 'acceleration', 'frequency', 'directionRatio', 'streak',
    'displacement', 'efficiency', 'volatility', 'realized', 'burst', 'trendStrength',
    'reversalRate', 'exhaustion', 'pressure']) {
    assert.ok(k in t, `missing ${k}`);
  }
  assert.ok(t.pressure == null || (t.pressure >= -1 && t.pressure <= 1));
  const empty = tickIntelligence([], []);
  assert.equal(empty.velocity, null);
});

// ── market structure ───────────────────────────────────────────────────────
test('swings finds alternating highs and lows on a zig-zag series', () => {
  // A triangle wave: 4 bars up, 4 bars down, so clear local extremes exist.
  const zig = [];
  let p = 100;
  for (let i = 0; i < 40; i++) {
    const phase = i % 8;
    p = phase < 4 ? 100 + phase * 2 : 100 + (8 - phase) * 2;
    zig.push({ epoch: i, open: p, high: p + 1, low: p - 1, close: p });
  }
  const s = swings(zig, 2);
  assert.ok(s.length > 0);
  assert.ok(s.some(x => x.type === 'high'));
  assert.ok(s.some(x => x.type === 'low'));
  assert.ok(s.every(x => x.type === 'high' || x.type === 'low'));
  assert.ok(s.every(x => Number.isFinite(x.price)));
});

test('labelSwings marks higher-highs and lower-lows', () => {
  const list = [
    { type: 'high', price: 10 }, { type: 'low', price: 5 },
    { type: 'high', price: 12 }, { type: 'low', price: 6 },
    { type: 'high', price: 11 }, { type: 'low', price: 4 },
  ];
  const l = labelSwings(list);
  assert.deepEqual(l.map(x => x.label), ['H', 'L', 'HH', 'HL', 'LH', 'LL']);
});

test('marketStructure reports a bias and the last structural event', () => {
  const ms = marketStructure(C);
  assert.ok(['bullish', 'bearish', 'ranging', 'neutral'].includes(ms.bias));
  assert.ok(ms.event == null || ['BOS', 'CHoCH'].includes(ms.event.kind));
});

test('fairValueGaps finds an unfilled three-bar gap', () => {
  const c = [
    { epoch: 0, open: 1, high: 2, low: 0.5, close: 1.5 },
    { epoch: 1, open: 3, high: 5, low: 3, close: 4.5 },
    { epoch: 2, open: 6, high: 7, low: 6, close: 6.5 },  // gap: c.low 6 > a.high 2
  ];
  const g = fairValueGaps(c, 10);
  assert.equal(g.length, 1);
  assert.equal(g[0].type, 'bullish');
});

test('orderBlocks and liquiditySweeps return well-formed entries', () => {
  const blocks = orderBlocks(C);
  assert.ok(Array.isArray(blocks));
  blocks.forEach(b => assert.ok(['bullish', 'bearish'].includes(b.type)));
  const sweeps = liquiditySweeps(C);
  sweeps.forEach(s => assert.ok(['bullish', 'bearish'].includes(s.type)));
});

test('equalExtremes detects two matching swing highs', () => {
  const c = [];
  for (let i = 0; i < 30; i++) {
    const spike = (i === 10 || i === 20) ? 5 : 0;
    c.push({ epoch: i, open: 100, high: 100 + spike, low: 99, close: 100 });
  }
  const eq = equalExtremes(c, 2, 0.001);
  assert.ok(eq.some(e => e.type === 'high'));
});

test('premiumDiscount splits the dealing range in half', () => {
  const c = [];
  for (let i = 0; i < 30; i++) c.push({ epoch: i, open: 100 + i, high: 100 + i + 1, low: 100 + i - 1, close: 100 + i });
  const r = premiumDiscount(c);
  assert.ok(r.hi != null && r.lo != null && r.mid != null);
  assert.ok(['premium', 'discount'].includes(r.zone));
});

test('structureRead bundles every structural reading', () => {
  const s = structureRead(C);
  for (const k of ['structure', 'fvg', 'blocks', 'sweeps', 'equals', 'range']) assert.ok(k in s);
  assert.equal(structureRead([]).structure, null);
});

// ── candle intelligence ────────────────────────────────────────────────────
test('bodyStrength and wickPressure describe a candle', () => {
  assert.equal(bodyStrength({ open: 1, close: 2, high: 2, low: 1 }), 1);
  assert.equal(bodyStrength({ open: 1, close: 1, high: 2, low: 0 }), 0);
  const w = wickPressure({ open: 1, close: 2, high: 3, low: 0 });
  assert.ok(w.upper > 0 && w.lower > 0);
});

test('rejection reads a long lower wick as bullish', () => {
  assert.equal(rejection({ open: 5, close: 5.1, high: 5.2, low: 1 }), 'bullish');
  assert.equal(rejection({ open: 5, close: 4.9, high: 9, low: 4.8 }), 'bearish');
  assert.equal(rejection({ open: 5, close: 6, high: 6.1, low: 4.9 }), null);
});

test('engulfing, inside and outside bars are classified correctly', () => {
  const a = { open: 5, close: 4, high: 5.2, low: 3.8 };
  const engulf = { open: 3.9, close: 5.1, high: 5.2, low: 3.7 };
  assert.equal(isEngulfing([a, engulf]), 'bullish');
  const inside = { open: 4.5, close: 4.6, high: 4.9, low: 4.1 };
  assert.equal(isInsideBar([a, inside]), true);
  const outside = { open: 4.5, close: 4.6, high: 5.5, low: 3.5 };
  assert.equal(isOutsideBar([a, outside]), true);
});

test('threeCandleReversal flags a failed push', () => {
  const a = { open: 1, close: 2, high: 2.1, low: 0.9 };
  const b = { open: 2, close: 3, high: 3.1, low: 1.9 };
  const c = { open: 3, close: 0.5, high: 3.1, low: 0.4 };
  assert.equal(threeCandleReversal([a, b, c]), 'bearish');
});

test('candleImbalance is signed by body direction', () => {
  const upBars = Array.from({ length: 10 }, () => ({ open: 1, close: 2, high: 2, low: 1 }));
  assert.equal(candleImbalance(upBars, 10), 1);
  const downBars = Array.from({ length: 10 }, () => ({ open: 2, close: 1, high: 2, low: 1 }));
  assert.equal(candleImbalance(downBars, 10), -1);
});

test('candleRead bundles every per-bar read', () => {
  const r = candleRead(C);
  for (const k of ['body', 'wick', 'displacement', 'streak', 'rejection', 'engulfing',
    'inside', 'outside', 'reversal', 'imbalance', 'effort']) assert.ok(k in r);
  assert.equal(candleRead([]).body, null);
});

// ── AI composites ──────────────────────────────────────────────────────────
test('each AI composite returns a bounded score and evidence', () => {
  const parts = [
    velocityPulse(up.prices, up.times),
    exhaustionRadar(C, up.prices, up.times),
    liquidityTrap(C),
    microstructurePressure(up.prices, up.times),
    volatilityStorm(C, up.prices),
    reversalProbability(C),
    breakoutQuality(C),
    trendPersistence(C, up.prices),
    regimeClassifier(C, up.prices),
  ];
  parts.forEach(p => {
    assert.ok(p.score == null || (p.score >= 0 && p.score <= 100));
    assert.ok('evidence' in p);
  });
});

test('velocityPulse reads the drift direction', () => {
  assert.equal(velocityPulse(up.prices, up.times).direction, 'up');
  assert.equal(velocityPulse(down.prices, down.times).direction, 'down');
});

test('regimeClassifier names a known regime', () => {
  const r = regimeClassifier(C, up.prices);
  assert.ok(['trending', 'ranging', 'compression', 'expansion', 'normal'].includes(r.regime));
});

test('confluenceScore returns a verdict and an agreement fraction', () => {
  const c = confluenceScore({ candles: C, prices: up.prices, times: up.times });
  assert.ok(c.score == null || (c.score >= 0 && c.score <= 100));
  assert.ok(['BUY', 'SELL', 'WAIT FOR CONFIRMATION', 'STAND ASIDE', 'NO DATA'].includes(c.verdict));
  assert.ok(c.agreement >= 0 && c.agreement <= 1);
});

test('aiRead returns all ten composites plus a gap count', () => {
  const r = aiRead({ candles: C, prices: up.prices, times: up.times });
  for (const k of ['velocityPulse', 'exhaustionRadar', 'liquidityTrap', 'microstructurePressure',
    'volatilityStorm', 'reversalProbability', 'breakoutQuality', 'trendPersistence',
    'regimeClassifier', 'confluence']) assert.ok(k in r, `missing ${k}`);
  assert.ok(Number.isInteger(r.gaps));
});

// ── tick bars ──────────────────────────────────────────────────────────────
test('bucketTicksByCount groups ticks into fixed-size bars', () => {
  const times = Array.from({ length: 250 }, (_, i) => 1_700_000_000 + i);
  const prices = Array.from({ length: 250 }, (_, i) => 100 + i * 0.01);
  for (const size of TICK_BAR_SIZES) {
    const bars = bucketTicksByCount(times, prices, size);
    assert.equal(bars.length, Math.ceil(250 / size));
    // Every closed bar holds exactly `size` ticks; the last may be short.
    bars.slice(0, -1).forEach(b => assert.equal(b.ticks, size));
    bars.forEach(b => {
      assert.equal(b.open, prices[(bars.indexOf(b)) * size] ?? b.open);
      assert.ok(b.high >= b.low);
      assert.equal(b.volume, b.ticks);
    });
  }
});

test('bucketTicksByCount keeps open/close aligned to the tick order', () => {
  const times = [1, 2, 3, 4];
  const prices = [10, 12, 11, 13];
  const bars = bucketTicksByCount(times, prices, 2);
  assert.equal(bars.length, 2);
  assert.deepEqual([bars[0].open, bars[0].high, bars[0].low, bars[0].close], [10, 12, 10, 12]);
  assert.deepEqual([bars[1].open, bars[1].high, bars[1].low, bars[1].close], [11, 13, 11, 13]);
});
