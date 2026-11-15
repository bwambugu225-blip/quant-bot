import React from 'react';
import Panel from './Panel.jsx';
import { indicatorSnapshot } from '../lib/indicators.js';
import { digitStats, marketStats } from '../lib/analytics.js';

const f = (v, d = 2) => (v == null || Number.isNaN(v) ? '—' : (+v).toFixed(d));
const sign = v => (v == null ? '' : v > 0 ? 'is-up' : v < 0 ? 'is-down' : '');

// The analytics column: an indicator matrix over the selected timeframe, a digit
// distribution for the synthetic indices, and market-structure stats. Every
// number is derived from the imported tape — nothing here is decorative.
export default function Analytics({ candles, digits, sym, price }) {
  const snap = React.useMemo(() => (candles.length > 20 ? indicatorSnapshot(candles) : null), [candles]);
  const dstats = React.useMemo(() => (digits.length > 30 ? digitStats(digits) : null), [digits]);
  const mstats = React.useMemo(() => (candles.length > 20 ? marketStats(candles) : null), [candles]);

  return (
    <div className="dock__scroll">
      <Panel title="Indicators" count={snap ? '20+' : '—'}>
        {!snap ? <div className="empty">Importing history…</div> : (
          <div className="ind-grid">
            <Card name="RSI 14" value={f(snap.rsi, 1)} cls={snap.rsi > 70 ? 'is-down' : snap.rsi < 30 ? 'is-up' : ''} sub={snap.rsi > 70 ? 'overbought' : snap.rsi < 30 ? 'oversold' : 'neutral'} />
            <Card name="Stoch %K" value={f(snap.stoch.k, 1)} cls={snap.stoch.k > 80 ? 'is-down' : snap.stoch.k < 20 ? 'is-up' : ''} sub={`D ${f(snap.stoch.d, 1)}`} />
            <Card name="MACD" value={f(snap.macd.macd, 4)} cls={sign(snap.macd.hist)} sub={`hist ${f(snap.macd.hist, 4)}`} />
            <Card name="ADX 14" value={f(snap.adx?.adx, 1)} sub={snap.adx ? `${snap.adx.trend} · ${snap.adx.adx > 25 ? 'trending' : 'ranging'}` : '—'} />
            <Card name="ATR 14" value={f(snap.atr, 4)} sub="volatility" />
            <Card name="CCI 20" value={f(snap.cci, 1)} cls={snap.cci > 100 ? 'is-down' : snap.cci < -100 ? 'is-up' : ''} sub="commodity" />
            <Card name="Williams %R" value={f(snap.williamsR, 1)} cls={snap.williamsR > -20 ? 'is-down' : snap.williamsR < -80 ? 'is-up' : ''} sub="momentum" />
            <Card name="MFI 14" value={f(snap.mfi, 1)} sub="money flow" />
            <Card name="ROC 12" value={f(snap.roc, 3) + '%'} cls={sign(snap.roc)} sub="rate of change" />
            <Card name="Momentum" value={f(snap.momentum, 4)} cls={sign(snap.momentum)} sub="10 period" />
            <Card name="Stoch RSI" value={f(snap.stochRsi, 1)} sub="14 / 3" />
            <Card name="VWAP" value={f(snap.vwap, 4)} sub={snap.vwap != null && price != null ? (price > snap.vwap ? 'above' : 'below') : '20 period'} />
            <Card name="Aroon Up" value={f(snap.aroon.up, 0)} cls={snap.aroon.up > snap.aroon.down ? 'is-up' : 'is-down'} sub={`Down ${f(snap.aroon.down, 0)}`} />
            <Card name="SuperTrend" value={snap.superTrend.dir === 1 ? 'BULL' : 'BEAR'} cls={snap.superTrend.dir === 1 ? 'is-up' : 'is-down'} sub={f(snap.superTrend.value, 4)} />
            <Card name="EMA 9" value={f(snap.emaFast, 4)} cls={price > snap.emaFast ? 'is-up' : 'is-down'} sub="fast" />
            <Card name="EMA 21" value={f(snap.emaSlow, 4)} cls={price > snap.emaSlow ? 'is-up' : 'is-down'} sub="slow" />
            <Card name="SMA 20" value={f(snap.sma, 4)} sub="trend" />
            <Card name="Bollinger" value={f(snap.bb.mid, 4)} sub={`${f(snap.bb.lower, 2)}–${f(snap.bb.upper, 2)}`} />
            <Card name="Keltner" value={f(snap.keltner.mid, 4)} sub={`${f(snap.keltner.lower, 2)}–${f(snap.keltner.upper, 2)}`} />
            <Card name="Donchian" value={f(snap.donchian.mid, 4)} sub={`${f(snap.donchian.lower, 2)}–${f(snap.donchian.upper, 2)}`} />
            <Card name="Ichimoku" value={f(snap.ichimoku.tenkan, 4)} sub={`Kijun ${f(snap.ichimoku.kijun, 4)}`} />
            <Card name="OBV" value={f(snap.obv, 0)} sub="on-balance vol" />
          </div>
        )}
      </Panel>

      {dstats && (
        <Panel title="Digit Distribution" count={`${dstats.total} ticks`}>
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
        <Panel title="Market Structure" count={sym}>
          <div className="rows">
            <Row k="Bars analysed" v={mstats.bars} />
            <Row k="Period range" v={`${f(mstats.rangeLow, 4)}–${f(mstats.rangeHigh, 4)}`} />
            <Row k="Realised vol (σ)" v={f(mstats.vol, 5)} />
            <Row k="Mean candle body" v={f(mstats.body, 4)} />
            <Row k="Up / Down bars" v={`${mstats.upBars} / ${mstats.downBars}`} />
            <Row k="Max run up / down" v={`${mstats.maxRunUp} / ${mstats.maxRunDown}`} />
            <Row k="Tick volume" v={mstats.volume} />
            <Row k="Trend (linear slope)" v={f(mstats.slope, 6)} cls={sign(mstats.slope)} />
          </div>
        </Panel>
      )}
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
