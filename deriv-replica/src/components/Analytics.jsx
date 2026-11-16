import React from 'react';
import Panel from './Panel.jsx';
import { indicatorSnapshot } from '../lib/indicators.js';
import { digitStats, marketStats, marketReadout } from '../lib/analytics.js';
import { aiRead } from '../lib/aiComposites.js';
import { structureRead } from '../lib/marketStructure.js';
import { candleRead } from '../lib/candleIntelligence.js';
import { tickIntelligence } from '../lib/microstructure.js';
import { volumeActivity, moveUnit, tickMoves } from '../lib/volume.js';

// Format a reading. `-0` and `-0.00` are normalised to `0` so a rounding
// artefact never renders as a negative zero.
const f = (v, d = 2) => {
  if (v == null || Number.isNaN(v)) return '—';
  const n = (+v).toFixed(d);
  return Number(n) === 0 ? (0).toFixed(d) : n;
};
const sign = v => (v == null ? '' : v > 0 ? 'is-up' : v < 0 ? 'is-down' : '');

// The indicator groups. Each card is one reading; the segmented control above
// the grid shows one group at a time so the column stays scannable instead of
// dumping every number at once.
const GROUPS = [
  { id: 'trend', label: 'Trend' },
  { id: 'momentum', label: 'Momentum' },
  { id: 'volatility', label: 'Volatility' },
  { id: 'volume', label: 'Volume' },
  { id: 'levels', label: 'Levels' },
  { id: 'quant', label: 'Quant' },
];

function cardsFor(group, s, price) {
  const above = (v) => (price != null && v != null ? (price >= v ? 'is-up' : 'is-down') : '');
  if (group === 'trend') {
    return [
      { name: 'EMA 9', value: f(s.emaFast, 4), cls: above(s.emaFast), sub: 'fast' },
      { name: 'EMA 21', value: f(s.emaSlow, 4), cls: above(s.emaSlow), sub: 'slow' },
      { name: 'SMA 20', value: f(s.sma, 4), cls: above(s.sma), sub: 'mean' },
      { name: 'Hull MA', value: f(s.hma, 4), cls: above(s.hma), sub: 'low lag' },
      { name: 'DEMA', value: f(s.dema, 4), cls: above(s.dema), sub: 'double' },
      { name: 'TEMA', value: f(s.tema, 4), cls: above(s.tema), sub: 'triple' },
      { name: 'SuperTrend', value: s.superTrend?.dir === 1 ? 'BULL' : 'BEAR', cls: s.superTrend?.dir === 1 ? 'is-up' : 'is-down', sub: f(s.superTrend?.value, 4) },
      { name: 'Parabolic SAR', value: f(s.psar, 4), cls: price != null && s.psar != null ? (price >= s.psar ? 'is-up' : 'is-down') : '', sub: price != null && s.psar != null ? (price >= s.psar ? 'long' : 'short') : 'stop & reverse' },
      { name: 'Vortex', value: f(s.vortex?.plus, 3), cls: s.vortex?.plus > s.vortex?.minus ? 'is-up' : 'is-down', sub: `VI− ${f(s.vortex?.minus, 3)}` },
      { name: 'Aroon', value: f(s.aroon?.up, 0), cls: s.aroon?.up > s.aroon?.down ? 'is-up' : 'is-down', sub: `Down ${f(s.aroon?.down, 0)}` },
      { name: 'Alligator', value: f(s.alligator?.lips, 4), cls: s.alligator?.lips > s.alligator?.jaw ? 'is-up' : 'is-down', sub: `Jaw ${f(s.alligator?.jaw, 4)}` },
      { name: 'Kalman', value: f(s.kalman, 4), cls: above(s.kalman), sub: 'adaptive trend' },
    ];
  }
  if (group === 'momentum') {
    return [
      { name: 'RSI 14', value: f(s.rsi, 1), cls: s.rsi > 70 ? 'is-down' : s.rsi < 30 ? 'is-up' : '', sub: s.rsi > 70 ? 'overbought' : s.rsi < 30 ? 'oversold' : 'neutral' },
      { name: 'MACD', value: f(s.macd?.macd, 4), cls: sign(s.macd?.hist), sub: `hist ${f(s.macd?.hist, 4)}` },
      { name: 'Stoch %K', value: f(s.stoch?.k, 1), cls: s.stoch?.k > 80 ? 'is-down' : s.stoch?.k < 20 ? 'is-up' : '', sub: `D ${f(s.stoch?.d, 1)}` },
      { name: 'Stoch RSI', value: f(s.stochRsi, 1), sub: '14 / 3' },
      { name: 'CCI 20', value: f(s.cci, 1), cls: s.cci > 100 ? 'is-down' : s.cci < -100 ? 'is-up' : '', sub: 'commodity' },
      { name: 'Williams %R', value: f(s.williamsR, 1), cls: s.williamsRanges?.state === 'overbought' ? 'is-down' : s.williamsRanges?.state === 'oversold' ? 'is-up' : '', sub: s.williamsRanges?.state || 'momentum' },
      { name: 'ROC 12', value: `${f(s.roc, 3)}%`, cls: sign(s.roc), sub: 'rate of change' },
      { name: 'Fisher', value: f(s.fisher, 3), cls: sign(s.fisher), sub: 'turn' },
      { name: 'Awesome Osc', value: f(s.awesome, 4), cls: sign(s.awesome), sub: '5 / 34' },
      { name: 'Ultimate Osc', value: f(s.ultimate, 1), cls: s.ultimate > 70 ? 'is-down' : s.ultimate < 30 ? 'is-up' : '', sub: '7 / 14 / 28' },
      { name: 'TRIX', value: f(s.trix, 4), cls: sign(s.trix), sub: '15 period' },
      { name: 'DPO', value: f(s.dpo, 4), cls: sign(s.dpo), sub: 'detrended' },
    ];
  }
  if (group === 'volatility') {
    return [
      { name: 'ATR 14', value: f(s.atr, 4), sub: 'absolute' },
      { name: 'ATR %', value: price ? `${f((s.atr / price) * 100, 3)}%` : '—', sub: 'of price' },
      { name: 'ADX 14', value: f(s.adx?.adx, 1), sub: s.adx ? `${s.adx.trend} · ${s.adx.adx >= 25 ? 'trending' : 'ranging'}` : '—' },
      { name: 'Bollinger', value: f(s.bb?.mid, 4), sub: `${f(s.bb?.lower, 2)}–${f(s.bb?.upper, 2)}` },
      { name: 'Bandwidth', value: s.bb?.mid ? `${f(((s.bb.upper - s.bb.lower) / s.bb.mid) * 100, 3)}%` : '—', sub: 'BB width' },
      { name: 'Keltner', value: f(s.keltner?.mid, 4), sub: `${f(s.keltner?.lower, 2)}–${f(s.keltner?.upper, 2)}` },
      { name: 'Donchian', value: f(s.donchian?.mid, 4), sub: `${f(s.donchian?.lower, 2)}–${f(s.donchian?.upper, 2)}` },
      { name: 'Choppiness', value: f(s.choppiness, 1), cls: s.choppiness > 61.8 ? 'is-down' : s.choppiness < 38.2 ? 'is-up' : '', sub: s.choppiness > 61.8 ? 'ranging' : s.choppiness < 38.2 ? 'trending' : 'mixed' },
      { name: 'Volatility σ', value: f(s.atr ? s.atr / (price || 1) : null, 5), sub: 'normalised' },
    ];
  }
  if (group === 'volume') {
    return [
      { name: 'Calc volume', value: f(s.volumeProfile?.total ?? s.obv, 0), sub: 'move-weighted' },
      { name: 'MFI 14', value: f(s.mfi, 1), sub: 'money flow' },
      { name: 'OBV', value: f(s.obv, 0), sub: 'on-balance vol' },
      { name: 'Chaikin MF', value: f(s.cmf, 3), cls: sign(s.cmf), sub: '20 period' },
      { name: 'Klinger', value: f(s.klinger?.kvo, 0), cls: sign(s.klinger?.kvo), sub: `signal ${f(s.klinger?.signal, 0)}` },
      { name: 'Force Index', value: f(s.forceIndex, 1), cls: sign(s.forceIndex), sub: '13 period' },
      { name: 'Ease of Move', value: f(s.eom, 3), cls: sign(s.eom), sub: '14 period' },
      { name: 'Volume POC', value: f(s.volumeProfile?.poc, 4), sub: 'point of control' },
    ];
  }
  if (group === 'quant') {
    return [
      { name: 'Z-Score 20', value: f(s.zscore, 2), cls: s.zscore > 2 ? 'is-down' : s.zscore < -2 ? 'is-up' : '', sub: 'stretch' },
      { name: 'Efficiency', value: f(s.efficiencyRatio, 3), cls: s.efficiencyRatio > 0.5 ? 'is-up' : '', sub: 'net / path' },
      { name: 'Hurst', value: f(s.hurst, 3), cls: s.hurst > 0.55 ? 'is-up' : s.hurst < 0.45 ? 'is-down' : '', sub: s.hurst > 0.55 ? 'persistent' : s.hurst < 0.45 ? 'mean-revert' : 'random' },
      { name: 'Fractal Dim', value: f(s.fractalDimension, 3), sub: 'path complexity' },
      { name: 'Entropy', value: f(s.entropy, 3), sub: 'order 0–1' },
      { name: 'Skew', value: f(s.skew, 3), cls: sign(s.skew), sub: 'tail lean' },
      { name: 'Kurtosis', value: f(s.kurtosis, 3), sub: 'tail weight' },
      { name: 'CUSUM', value: f(s.cusum, 2), cls: sign(s.cusum), sub: 'regime shift' },
      { name: 'Choppiness', value: f(s.choppiness, 1), sub: '14 period' },
    ];
  }
  // levels
  return [
    { name: 'VWAP', value: f(s.vwap, 4), cls: price != null && s.vwap != null ? (price >= s.vwap ? 'is-up' : 'is-down') : '', sub: price != null && s.vwap != null ? (price >= s.vwap ? 'above' : 'below') : '20 period' },
    { name: 'Pivot P', value: f(s.pivots?.p, 4), sub: 'classic' },
    { name: 'Resistance R1', value: f(s.pivots?.r1, 4), cls: 'is-down', sub: `R2 ${f(s.pivots?.r2, 2)}` },
    { name: 'Support S1', value: f(s.pivots?.s1, 4), cls: 'is-up', sub: `S2 ${f(s.pivots?.s2, 2)}` },
    { name: 'Ichimoku', value: f(s.ichimoku?.tenkan, 4), cls: price != null && s.ichimoku?.tenkan != null ? (price >= s.ichimoku.tenkan ? 'is-up' : 'is-down') : '', sub: `Kijun ${f(s.ichimoku?.kijun, 4)}` },
    { name: 'PSAR', value: f(s.psar, 4), cls: price != null && s.psar != null ? (price >= s.psar ? 'is-up' : 'is-down') : '', sub: 'trailing stop' },
  ];
}

// The analytics column: a compact signal readout, a grouped indicator matrix
// over the selected timeframe, a digit distribution for the synthetic indices,
// and market-structure stats. Every number is derived from the imported tape.
export default function Analytics({ candles, digits, sym, price, prices = [], times = [] }) {
  const [group, setGroup] = React.useState('trend');
  const snap = React.useMemo(() => (candles.length > 30 ? indicatorSnapshot(candles) : null), [candles]);
  const read = React.useMemo(() => marketReadout(snap, price), [snap, price]);
  const dstats = React.useMemo(() => (digits.length > 30 ? digitStats(digits) : null), [digits]);
  const mstats = React.useMemo(() => (candles.length > 30 ? marketStats(candles) : null), [candles]);
  const ai = React.useMemo(
    () => (candles.length > 30 ? aiRead({ candles, prices, times }) : null),
    [candles, prices, times],
  );
  const struct = React.useMemo(() => (candles.length > 30 ? structureRead(candles) : null), [candles]);
  const candle = React.useMemo(() => (candles.length ? candleRead(candles) : null), [candles]);
  const micro = React.useMemo(() => (prices.length > 5 ? tickIntelligence(prices, times) : null), [prices, times]);
  // Calculated volume, from the same tape and the same pure model the store
  // folds into candles, so the panel and the volume histogram agree.
  const vol = React.useMemo(
    () => (prices.length > 51 ? { activity: volumeActivity(prices, times, sym, 50), unit: moveUnit(tickMoves(prices), sym) } : null),
    [prices, times, sym],
  );

  const cards = snap ? cardsFor(group, snap, price) : [];

  return (
    <div className="dock__scroll">
      <Panel title="Signal" count={read ? `${read.votes} inputs` : '—'} defaultOpen>
        {!read ? <div className="empty">Importing history…</div> : <SignalHeader read={read} />}
      </Panel>

      {ai && (
        <Panel title="AI Confluence" count={ai.confluence.verdict} defaultOpen>
          <div className={`ai-verdict ${ai.confluence.direction === 'up' ? 'is-up' : ai.confluence.direction === 'down' ? 'is-down' : ''}`}>
            <span className="ai-verdict__score">{f(ai.confluence.score, 0)}</span>
            <span className="ai-verdict__label">{ai.confluence.verdict}</span>
            <span className="ai-verdict__meta">{ai.confluence.regime} · {Math.round((ai.confluence.agreement || 0) * 100)}% agreement</span>
          </div>
          <div className="ind-grid">
            <Card name="01 Velocity Pulse" value={f(ai.velocityPulse.score, 0)} cls={ai.velocityPulse.direction === 'up' ? 'is-up' : ai.velocityPulse.direction === 'down' ? 'is-down' : ''} sub={ai.velocityPulse.direction || 'flat'} />
            <Card name="02 Exhaustion Radar" value={f(ai.exhaustionRadar.score, 0)} cls={ai.exhaustionRadar.score > 60 ? 'is-down' : ''} sub={ai.exhaustionRadar.direction || 'stable'} />
            <Card name="03 Liquidity Trap" value={f(ai.liquidityTrap.score, 0)} cls={ai.liquidityTrap.score > 60 ? 'is-down' : ''} sub={ai.liquidityTrap.direction ? `trap ${ai.liquidityTrap.direction}` : 'clean'} />
            <Card name="04 Micro Pressure" value={f(ai.microstructurePressure.score, 0)} cls={ai.microstructurePressure.direction === 'up' ? 'is-up' : ai.microstructurePressure.direction === 'down' ? 'is-down' : ''} sub={ai.microstructurePressure.direction || 'balanced'} />
            <Card name="05 Volatility Storm" value={f(ai.volatilityStorm.score, 0)} sub={ai.volatilityStorm.score > 65 ? 'storm' : 'calm'} />
            <Card name="06 Reversal Model" value={f(ai.reversalProbability.score, 0)} cls={ai.reversalProbability.direction === 'up' ? 'is-up' : ai.reversalProbability.direction === 'down' ? 'is-down' : ''} sub={ai.reversalProbability.direction || 'no signal'} />
            <Card name="07 Breakout Quality" value={f(ai.breakoutQuality.score, 0)} cls={ai.breakoutQuality.direction === 'up' ? 'is-up' : 'is-down'} sub={ai.breakoutQuality.direction || '—'} />
            <Card name="08 Trend Persistence" value={f(ai.trendPersistence.score, 0)} cls={ai.trendPersistence.direction === 'up' ? 'is-up' : 'is-down'} sub={ai.trendPersistence.direction || '—'} />
            <Card name="09 Regime" value={ai.regimeClassifier.regime} sub={`ADX ${f(ai.regimeClassifier.evidence.adx, 0)}`} />
            <Card name="10 Confluence" value={f(ai.confluence.score, 0)} cls={ai.confluence.direction === 'up' ? 'is-up' : ai.confluence.direction === 'down' ? 'is-down' : ''} sub={ai.confluence.verdict} />
          </div>
        </Panel>
      )}

      {micro && (
        <Panel title="Microstructure" count="tick-level" defaultOpen={false}>
          <div className="rows">
            <Row k="Velocity (px/s)" v={f(micro.velocity, 5)} cls={sign(micro.velocity)} />
            <Row k="Acceleration" v={f(micro.acceleration, 5)} cls={sign(micro.acceleration)} />
            <Row k="Tick frequency" v={micro.frequency != null ? `${f(micro.frequency, 2)}/s` : '—'} />
            <Row k="Direction ratio" v={micro.directionRatio != null ? `${f(micro.directionRatio * 100, 1)}% up` : '—'} />
            <Row k="Streak" v={micro.streak ? `${micro.streak > 0 ? '+' : ''}${micro.streak}` : '0'} cls={sign(micro.streak)} />
            <Row k="Displacement" v={f(micro.displacement, 3)} cls={sign(micro.displacement)} />
            <Row k="Efficiency" v={f(micro.efficiency, 3)} />
            <Row k="Tick volatility" v={f(micro.volatility, 5)} />
            <Row k="Realised vol" v={f(micro.realized, 5)} />
            <Row k="Vol burst (20/100)" v={f(micro.burst, 2)} cls={micro.burst > 1.5 ? 'is-down' : ''} />
            <Row k="Trend strength" v={micro.trendStrength != null ? `${f(micro.trendStrength * 100, 1)}%` : '—'} />
            <Row k="Reversal rate" v={micro.reversalRate != null ? `${f(micro.reversalRate * 100, 1)}%` : '—'} />
            <Row k="Pressure" v={f(micro.pressure, 3)} cls={sign(micro.pressure)} />
            <Row k="Tick volume (calc, 50)" v={vol ? f(vol.activity, 2) : '—'} />
            <Row k="Move unit" v={vol ? f(vol.unit, 6) : '—'} />
          </div>
        </Panel>
      )}

      {struct?.structure && (
        <Panel title="Market Structure" count={struct.structure.bias} defaultOpen={false}>
          <div className="rows">
            <Row k="Bias" v={struct.structure.bias} cls={struct.structure.bias === 'bullish' ? 'is-up' : struct.structure.bias === 'bearish' ? 'is-down' : ''} />
            <Row k="Trend" v={struct.structure.trend || 'undecided'} />
            <Row k="Last event" v={struct.structure.event ? `${struct.structure.event.kind} ${struct.structure.event.direction}` : '—'} />
            <Row k="Swing high" v={f(struct.structure.lastHigh?.price, 4)} cls="is-down" />
            <Row k="Swing low" v={f(struct.structure.lastLow?.price, 4)} cls="is-up" />
            <Row k="HH / LL count" v={`${struct.structure.higherHighs} / ${struct.structure.lowerLows}`} />
            <Row k="Dealing range" v={struct.range?.zone || '—'} cls={struct.range?.zone === 'premium' ? 'is-down' : struct.range?.zone === 'discount' ? 'is-up' : ''} />
            <Row k="Range position" v={struct.range?.position != null ? `${f(struct.range.position * 100, 1)}%` : '—'} />
            <Row k="Fair value gaps" v={struct.fvg.length} />
            <Row k="Order blocks" v={struct.blocks.length} />
            <Row k="Liquidity sweeps" v={struct.sweeps.length} />
            <Row k="Equal highs / lows" v={struct.equals.length} />
          </div>
        </Panel>
      )}

      {candle && (
        <Panel title="Candle Intelligence" count="latest bar" defaultOpen={false}>
          <div className="rows">
            <Row k="Body / range" v={`${f(candle.body * 100, 1)}%`} />
            <Row k="Upper wick" v={`${f(candle.wick.upper * 100, 1)}%`} cls="is-down" />
            <Row k="Lower wick" v={`${f(candle.wick.lower * 100, 1)}%`} cls="is-up" />
            <Row k="Displacement" v={f(candle.displacement, 2)} cls={candle.displacement > 1.5 ? 'is-up' : ''} />
            <Row k="Streak" v={candle.streak ? `${candle.streak > 0 ? '+' : ''}${candle.streak}` : '0'} cls={sign(candle.streak)} />
            <Row k="Rejection" v={candle.rejection || '—'} cls={candle.rejection === 'bullish' ? 'is-up' : candle.rejection === 'bearish' ? 'is-down' : ''} />
            <Row k="Engulfing" v={candle.engulfing || '—'} cls={candle.engulfing === 'bullish' ? 'is-up' : candle.engulfing === 'bearish' ? 'is-down' : ''} />
            <Row k="Inside / outside" v={`${candle.inside ? 'inside' : '—'} / ${candle.outside ? 'outside' : '—'}`} />
            <Row k="3-candle reversal" v={candle.reversal || '—'} cls={candle.reversal === 'bullish' ? 'is-up' : candle.reversal === 'bearish' ? 'is-down' : ''} />
            <Row k="Imbalance" v={f(candle.imbalance, 3)} cls={sign(candle.imbalance)} />
            <Row k="Effort / result" v={f(candle.effort, 0)} />
          </div>
        </Panel>
      )}

      <Panel title="Indicators" count={snap ? '50+' : '—'} defaultOpen>
        {!snap ? <div className="empty">Importing history…</div> : (
          <>
            <div className="segbar">
              {GROUPS.map(g => (
                <button key={g.id} className={`tf${group === g.id ? ' is-active' : ''}`} onClick={() => setGroup(g.id)} type="button">{g.label}</button>
              ))}
            </div>
            <div className="ind-grid">
              {cards.map(c => <Card key={c.name} {...c} />)}
            </div>
          </>
        )}
      </Panel>

      {dstats && (
        <Panel title="Digit Distribution" count={`${dstats.total} ticks`} defaultOpen={false}>
          <div className="digits">
            {dstats.dist.map((pct, d) => (
              <div className="digit" key={d}>
                <div className={`digit__bar${d === dstats.hot ? ' is-hot' : ''}${d === dstats.cold ? ' is-cold' : ''}${d === dstats.now ? ' is-now' : ''}`}
                  style={{ height: `${Math.max(4, pct * 4)}%` }} title={`${d}: ${pct.toFixed(1)}%`} />
                <span className="digit__lbl">{d}</span>
              </div>
            ))}
          </div>
          <div className="rows" style={{ marginTop: 8 }}>
            <Row k="Even / Odd" v={`${f(dstats.even, 1)}% / ${f(dstats.odd, 1)}%`} />
            <Row k="χ² bias (9 df)" v={f(dstats.chi2, 1)} cls={dstats.chi2 > 16.9 ? 'is-up' : ''} />
            <Row k="Entropy" v={f(dstats.entropy, 3)} />
            <Row k="Hot / Cold" v={`${dstats.hot} / ${dstats.cold}`} />
            <Row k="Longest streak" v={`${dstats.streak}× ${dstats.streakDigit}`} />
          </div>
        </Panel>
      )}

      {mstats && (
        <Panel title="Market Structure" count={sym} defaultOpen={false}>
          <div className="rows">
            <Row k="Bars analysed" v={mstats.bars} />
            <Row k="Period range" v={`${f(mstats.rangeLow, 4)}–${f(mstats.rangeHigh, 4)}`} />
            <Row k="Realised vol (σ)" v={f(mstats.vol, 5)} />
            <Row k="Mean candle body" v={f(mstats.body, 4)} />
            <Row k="Up / Down bars" v={`${mstats.upBars} / ${mstats.downBars}`} />
            <Row k="Max run up / down" v={`${mstats.maxRunUp} / ${mstats.maxRunDown}`} />
            <Row k="Volume (calculated)" v={f(mstats.volume, 1)} />
            <Row k="Trend (linear slope)" v={f(mstats.slope, 6)} cls={sign(mstats.slope)} />
          </div>
        </Panel>
      )}
    </div>
  );
}

// The one-line read: which way the tape leans, how strongly, and the two
// conditions that qualify it (regime and volatility).
function SignalHeader({ read }) {
  const cls = read.bias === 'bullish' ? 'is-up' : read.bias === 'bearish' ? 'is-down' : '';
  return (
    <div className="signal">
      <div className="signal__top">
        <span className={`signal__bias ${cls}`}>{read.bias}</span>
        <span className="signal__meta">{read.strength}% agreement</span>
      </div>
      <div className="signal__bar"><div className={`signal__fill ${cls}`} style={{ width: `${read.strength}%` }} /></div>
      <div className="signal__grid">
        <Mini k="Regime" v={read.regime} />
        <Mini k="Volatility" v={read.vol} />
        <Mini k="Momentum" v={read.momentum} />
        <Mini k="RSI" v={read.rsi != null ? read.rsi.toFixed(1) : '—'} />
      </div>
    </div>
  );
}

function Mini({ k, v }) {
  return (
    <div className="mini">
      <span className="mini__k">{k}</span>
      <span className="mini__v">{v}</span>
    </div>
  );
}

function Card({ name, value, sub, cls = '' }) {
  return (
    <div className="ind-card">
      <div className="ind-card__name">{name}</div>
      <div className={`ind-card__val ${cls}`}>{value}</div>
      <div className="ind-card__sub">{sub}</div>
    </div>
  );
}

function Row({ k, v, cls = '' }) {
  return (
    <div className="row">
      <span className="row__k">{k}</span>
      <span className={`row__v ${cls}`}>{v}</span>
    </div>
  );
}
