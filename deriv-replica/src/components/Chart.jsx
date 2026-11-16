import React from 'react';
import {
  emaSeries, smaSeries, bollingerSeries, rsiSeries, macdSeries, closes, superTrendSeries,
  vwapSeries, psarSeries, heikenAshi, williamsRSeries,
} from '../lib/indicators.js';
import { DEFAULT_BARS, clamp, visibleWindow, zoomWindow, panWindow } from '../lib/chartView.js';

// A dependency-free SVG chart: candles, Heiken Ashi or line, with optional
// EMA/SMA/Bollinger/SuperTrend/VWAP/Parabolic-SAR overlays, a volume histogram
// and an RSI/MACD/Williams %R sub-pane. It renders from the same candles the
// engine trades, so what is drawn is what the strategy sees. A crosshair tracks
// the pointer and reads out the hovered bar.
//
// The view is a horizontal window over the candle buffer: drag to pan, scroll
// or pinch to zoom. While the window sits at the live edge it follows new
// candles; once the user pans back it holds its place until they return.
const OVERLAY_COLORS = { ema9: '#4c86e0', ema21: '#c8a250', sma50: '#8b7fd4', bb: '#3d4756', st: '#2bb673', vwap: '#d99a3a', psar: '#e0524f' };

function useSize(ref) {
  const [size, setSize] = React.useState({ w: 800, h: 420 });
  React.useEffect(() => {
    if (!ref.current) return undefined;
    const el = ref.current;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth || 800, h: el.clientHeight || 420 }));
    ro.observe(el);
    setSize({ w: el.clientWidth || 800, h: el.clientHeight || 420 });
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

const fmtT = epoch => {
  const d = new Date(epoch * 1000);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

export default function Chart({ candles, up, overlays = ['ema9', 'ema21', 'bb'], pane = 'rsi', mode = 'candles', symbol }) {
  const wrapRef = React.useRef(null);
  const { w, h } = useSize(wrapRef);
  const [hover, setHover] = React.useState(null);
  const [bars, setBars] = React.useState(DEFAULT_BARS);
  const [follow, setFollow] = React.useState(true);
  const [endIdx, setEndIdx] = React.useState(0);
  const [panning, setPanning] = React.useState(false);
  const dragRef = React.useRef(null);
  const pinchRef = React.useRef(null);
  const geomRef = React.useRef(null);

  const total = candles.length;
  const win = visibleWindow({ total, bars, endIdx, follow });
  const visBars = win.bars;
  const start = win.start;
  const end = win.end;
  const view = React.useMemo(() => candles.slice(start, end), [candles, start, end]);
  // Heiken Ashi transforms the *whole* series before slicing so the smoothed
  // bars stay consistent when the window moves; slicing first would restart the
  // recursion at the left edge and make the bars jump as the user pans.
  const haCandles = React.useMemo(
    () => (mode === 'heiken' ? heikenAshi(candles) : null),
    [candles, mode],
  );
  const drawCandles = React.useMemo(
    () => (haCandles ? haCandles.slice(start, end) : view),
    [haCandles, view, start, end],
  );

  const geom = React.useMemo(() => {
    const padL = 8, padR = 62, padT = 30, padB = 22;
    const paneH = pane === 'none' ? 0 : Math.round((h - padT - padB) * 0.22);
    const mainH = h - padT - padB - paneH - (paneH ? 10 : 0);
    const plotW = Math.max(10, w - padL - padR);
    if (view.length < 2) return null;

    const cl = closes(view);
    let lo = Infinity, hi = -Infinity;
    view.forEach(k => { lo = Math.min(lo, k.low); hi = Math.max(hi, k.high); });
    // Heiken Ashi bars can extend past the raw range, so include them.
    drawCandles.forEach(k => { lo = Math.min(lo, k.low); hi = Math.max(hi, k.high); });
    const bb = overlays.includes('bb') ? bollingerSeries(cl, 20, 2) : null;
    if (bb) { bb.upper.forEach(v => { if (v != null) hi = Math.max(hi, v); }); bb.lower.forEach(v => { if (v != null) lo = Math.min(lo, v); }); }
    const psar = overlays.includes('psar') ? psarSeries(view, 0.02, 0.2) : null;
    if (psar) psar.forEach(v => { if (v == null) return; hi = Math.max(hi, v); lo = Math.min(lo, v); });
    const pad = (hi - lo) * 0.06 || 1;
    hi += pad; lo -= pad;
    const x = i => padL + (i / (view.length - 1)) * plotW;
    const y = v => padT + (1 - (v - lo) / (hi - lo)) * mainH;

    const ema9 = overlays.includes('ema9') ? emaSeries(cl, 9) : null;
    const ema21 = overlays.includes('ema21') ? emaSeries(cl, 21) : null;
    const sma50 = overlays.includes('sma50') ? smaSeries(cl, 50) : null;
    const st = overlays.includes('st') ? superTrendSeries(view, 10, 3) : null;
    const vwap = overlays.includes('vwap') ? vwapSeries(view, 20) : null;

    const pathOf = (series) => {
      let d = '';
      series.forEach((v, i) => { if (v == null) return; d += (d ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); });
      return d;
    };

    const maxVol = Math.max(1, ...view.map(k => k.volume ?? k.ticks ?? 0));
    const volY = v => padT + mainH - (v / maxVol) * Math.max(18, mainH * 0.14);

    let paneGeom = null;
    if (paneH) {
      const top = padT + mainH + 10;
      const py = v => top + (1 - v / 100) * paneH;
      const rsi = pane === 'rsi' ? rsiSeries(cl, 14) : null;
      const macd = pane === 'macd' ? macdSeries(cl) : null;
      const willr = pane === 'willr' ? williamsRSeries(view, 14) : null;
      let pPath = '', sPath = '', hist = [], mid = py(50), bandLo = null, bandHi = null;
      if (rsi) { pPath = pathOf(rsi); bandLo = py(30); bandHi = py(70); }
      if (willr) {
        // Williams %R runs -100…0; map that band onto the pane height.
        const wy = v => top + ((v + 100) / 100) * paneH;
        willr.forEach((v, i) => { if (v == null) return; pPath += (pPath ? 'L' : 'M') + x(i).toFixed(1) + ' ' + wy(v).toFixed(1); });
        bandLo = wy(-80); bandHi = wy(-20); mid = wy(-50);
      }
      if (macd) {
        const vals = [...macd.macd, ...macd.signal].filter(v => v != null);
        const lo2 = Math.min(...vals), hi2 = Math.max(...vals);
        const my = v => top + (1 - (v - lo2) / ((hi2 - lo2) || 1)) * paneH;
        macd.macd.forEach((v, i) => { if (v == null) return; pPath += (pPath ? 'L' : 'M') + x(i).toFixed(1) + ' ' + my(v).toFixed(1); });
        macd.signal.forEach((v, i) => { if (v == null) return; sPath += (sPath ? 'L' : 'M') + x(i).toFixed(1) + ' ' + my(v).toFixed(1); });
        hist = macd.hist.map((v, i) => ({ v, i, y: v == null ? null : my(v) }));
        mid = my(0);
      }
      paneGeom = { pPath, sPath, hist, mid, top, height: paneH, bandLo, bandHi };
    }

    const stLine = st ? st.dir.map((d, i) => (d == null ? null : d === 1 ? st.dn[i] : st.up[i])) : null;

    return { padL, padR, padT, padB, plotW, mainH, lo, hi, x, y, ema9, ema21, sma50, bb, pathOf, paneGeom, volY, st, stLine, vwap, psar };
  }, [view, drawCandles, w, h, overlays, pane]);
  geomRef.current = geom;

  const last = view[view.length - 1];
  const shown = hover != null && view[hover] ? view[hover] : last;
  const priceY = geom && last ? geom.y(last.close) : null;

  const barWidth = geom ? geom.plotW / Math.max(1, view.length - 1) : 10;

  const applyWindow = (nb, ne) => {
    setBars(nb);
    setEndIdx(ne);
    setFollow(ne >= total);
  };

  const idxAt = clientX => {
    if (!geom || !wrapRef.current) return null;
    const rect = wrapRef.current.getBoundingClientRect();
    const frac = (clientX - rect.left - geom.padL) / geom.plotW;
    const i = Math.round(frac * (view.length - 1));
    return i >= 0 && i < view.length ? i : null;
  };

  const onDown = e => {
    if (!geom || (e.button != null && e.button !== 0)) return;
    // Ignore drags that start on an overlay control (zoom buttons), otherwise
    // the pointer capture swallows the click before it reaches the button.
    if (e.target && e.target.closest && e.target.closest('.chart-tools')) return;
    dragRef.current = { x: e.clientX, end, follow, barWidth };
    if (e.currentTarget.setPointerCapture && e.pointerId != null) {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    }
    setPanning(true);
  };

  const onMove = e => {
    const d = dragRef.current;
    if (d) {
      const { end: ne } = panWindow({ total, bars: visBars, end: d.end, dxPx: e.clientX - d.x, barWidth: d.barWidth });
      applyWindow(visBars, ne);
      return;
    }
    setHover(idxAt(e.clientX));
  };

  const onUp = e => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setPanning(false);
    if (e && e.currentTarget.releasePointerCapture && e.pointerId != null) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    }
  };

  // Wheel needs a non-passive native listener so preventDefault stops page scroll.
  const wheelRef = React.useRef(null);
  wheelRef.current = e => {
    const g = geomRef.current;
    if (!g || view.length < 2) return;
    e.preventDefault();
    const rect = wrapRef.current.getBoundingClientRect();
    const anchor = clamp((e.clientX - rect.left - g.padL) / g.plotW, 0, 1);
    const factor = e.deltaY > 0 ? 1.18 : 1 / 1.18;
    const next = zoomWindow({ total, bars: visBars, end, follow, anchor, factor });
    if (next.bars === visBars && next.end === end) return;
    applyWindow(next.bars, next.end);
  };
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const fn = e => wheelRef.current(e);
    el.addEventListener('wheel', fn, { passive: false });
    return () => el.removeEventListener('wheel', fn);
  }, []);

  const onTouchStart = e => {
    if (e.touches.length !== 2) return;
    dragRef.current = null;
    setPanning(false);
    const [a, b] = e.touches;
    pinchRef.current = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), bars: visBars, end, follow };
  };
  const onTouchMove = e => {
    const p = pinchRef.current;
    if (!p || e.touches.length !== 2 || p.dist < 1) return;
    const [a, b] = e.touches;
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (dist < 1) return;
    const next = zoomWindow({ total, bars: p.bars, end: p.end, follow: p.follow, anchor: 1, factor: p.dist / dist });
    applyWindow(next.bars, next.end);
  };
  const onTouchEnd = e => { if (e.touches.length < 2) pinchRef.current = null; };

  const zoom = dir => {
    const next = zoomWindow({ total, bars: visBars, end, follow, anchor: 1, factor: dir > 0 ? 1 / 1.4 : 1.4 });
    applyWindow(next.bars, next.end);
  };
  const reset = () => { setBars(DEFAULT_BARS); setFollow(true); setHover(null); };

  const hoverX = geom && hover != null ? geom.x(hover) : null;

  return (
    <div
      className={`chartwrap${panning ? ' is-panning' : ''}`}
      ref={wrapRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={() => { if (!dragRef.current) setHover(null); }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onDoubleClick={reset}
    >
      {geom && (
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map(f => {
            const gy = geom.padT + f * geom.mainH;
            const price = geom.hi - f * (geom.hi - geom.lo);
            return (
              <g key={f}>
                <line x1={geom.padL} x2={w - geom.padR} y1={gy} y2={gy} stroke="var(--line)" strokeWidth="1" />
                <text x={w - geom.padR + 6} y={gy + 3} fill="var(--text-mute)" fontSize="9.5" fontFamily="var(--mono)">{price.toFixed(4)}</text>
              </g>
            );
          })}
          {[0, 0.25, 0.5, 0.75, 1].map(f => {
            const i = Math.round(f * (view.length - 1));
            const gx = geom.x(i);
            const c = view[i];
            return (
              <g key={`v${f}`}>
                <line x1={gx} x2={gx} y1={geom.padT} y2={h - geom.padB} stroke="var(--line)" strokeWidth="1" strokeDasharray="2 4" />
                {c && <text x={gx} y={h - geom.padB + 13} fill="var(--text-mute)" fontSize="9.5" fontFamily="var(--mono)" textAnchor="middle">{fmtT(c.epoch)}</text>}
              </g>
            );
          })}

          {view.map((k, i) => {
            const v = k.volume ?? k.ticks ?? 0;
            const bw = Math.max(1, (geom.plotW / view.length) * 0.6);
            return <rect key={`vol${i}`} x={geom.x(i) - bw / 2} y={geom.volY(v)} width={bw} height={geom.padT + geom.mainH - geom.volY(v)} fill={k.close >= k.open ? 'var(--up)' : 'var(--down)'} opacity="0.16" />;
          })}

          {mode === 'line' ? (
            <path d={view.map((k, i) => `${i ? 'L' : 'M'}${geom.x(i).toFixed(1)} ${geom.y(k.close).toFixed(1)}`).join(' ')} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
          ) : drawCandles.map((k, i) => {
            const bull = k.close >= k.open;
            const color = bull ? 'var(--up)' : 'var(--down)';
            const bw = Math.max(1.5, (geom.plotW / view.length) * 0.62);
            const cx = geom.x(i);
            const yo = geom.y(k.open), yc = geom.y(k.close);
            return (
              <g key={`c${i}`}>
                <line x1={cx} x2={cx} y1={geom.y(k.high)} y2={geom.y(k.low)} stroke={color} strokeWidth="1" />
                <rect x={cx - bw / 2} y={Math.min(yo, yc)} width={bw} height={Math.max(1, Math.abs(yc - yo))} fill={color} />
              </g>
            );
          })}

          {geom.bb && <>
            <path d={geom.pathOf(geom.bb.upper)} fill="none" stroke={OVERLAY_COLORS.bb} strokeWidth="1" />
            <path d={geom.pathOf(geom.bb.lower)} fill="none" stroke={OVERLAY_COLORS.bb} strokeWidth="1" />
          </>}
          {geom.ema9 && <path d={geom.pathOf(geom.ema9)} fill="none" stroke={OVERLAY_COLORS.ema9} strokeWidth="1.3" />}
          {geom.ema21 && <path d={geom.pathOf(geom.ema21)} fill="none" stroke={OVERLAY_COLORS.ema21} strokeWidth="1.3" />}
          {geom.sma50 && <path d={geom.pathOf(geom.sma50)} fill="none" stroke={OVERLAY_COLORS.sma50} strokeWidth="1.3" />}
          {geom.stLine && <path d={geom.pathOf(geom.stLine)} fill="none" stroke={OVERLAY_COLORS.st} strokeWidth="1.4" opacity="0.9" />}
          {geom.vwap && <path d={geom.pathOf(geom.vwap)} fill="none" stroke={OVERLAY_COLORS.vwap} strokeWidth="1.2" strokeDasharray="5 3" />}
          {geom.psar && geom.psar.map((v, i) => (v == null ? null : (
            <circle key={`psar${i}`} cx={geom.x(i)} cy={geom.y(v)} r="1.6" fill={OVERLAY_COLORS.psar} />
          )))}

          {priceY != null && <>
            <line x1={geom.padL} x2={w - geom.padR} y1={priceY} y2={priceY} stroke={up ? 'var(--up)' : 'var(--down)'} strokeWidth="1" strokeDasharray="2 3" opacity="0.75" />
            <rect x={w - geom.padR + 2} y={priceY - 8} width={geom.padR - 4} height={16} rx="2" fill={up ? 'var(--up)' : 'var(--down)'} />
            <text x={w - geom.padR + 5} y={priceY + 3.5} fill="#04150d" fontSize="10" fontWeight="700" fontFamily="var(--mono)">{last.close.toFixed(4)}</text>
          </>}

          {geom.paneGeom && <>
            {geom.paneGeom.bandLo != null && <line x1={geom.padL} x2={w - geom.padR} y1={geom.paneGeom.bandLo} y2={geom.paneGeom.bandLo} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="3 3" />}
            {geom.paneGeom.bandHi != null && <line x1={geom.padL} x2={w - geom.padR} y1={geom.paneGeom.bandHi} y2={geom.paneGeom.bandHi} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="3 3" />}
            <line x1={geom.padL} x2={w - geom.padR} y1={geom.paneGeom.mid} y2={geom.paneGeom.mid} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="3 3" />
            {geom.paneGeom.hist.map((bar, i) => bar.y == null ? null : (
              <rect key={`h${i}`} x={geom.x(bar.i) - 1} y={Math.min(bar.y, geom.paneGeom.mid)} width="2" height={Math.abs(bar.y - geom.paneGeom.mid)} fill={bar.v >= 0 ? 'var(--up)' : 'var(--down)'} opacity="0.5" />
            ))}
            <path d={geom.paneGeom.pPath} fill="none" stroke={pane === 'rsi' ? '#8b7fd4' : pane === 'willr' ? 'var(--gold)' : 'var(--accent)'} strokeWidth="1.2" />
            {geom.paneGeom.sPath && <path d={geom.paneGeom.sPath} fill="none" stroke="var(--gold)" strokeWidth="1.2" />}
            <text x={geom.padL + 2} y={geom.paneGeom.top + 10} fill="var(--text-mute)" fontSize="9.5" fontFamily="var(--mono)">{pane === 'rsi' ? 'RSI 14' : pane === 'willr' ? 'Williams %R 14' : 'MACD 12/26/9'}</text>
          </>}

          {hoverX != null && !panning && <>
            <line x1={hoverX} x2={hoverX} y1={geom.padT} y2={h - geom.padB} stroke="var(--text-mute)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={geom.padL} x2={w - geom.padR} y1={geom.y(shown.close)} y2={geom.y(shown.close)} stroke="var(--text-mute)" strokeWidth="1" strokeDasharray="3 3" />
            <rect x={w - geom.padR + 2} y={geom.y(shown.close) - 8} width={geom.padR - 4} height={16} rx="2" fill="var(--bg-4)" />
            <text x={w - geom.padR + 5} y={geom.y(shown.close) + 3.5} fill="var(--text)" fontSize="10" fontFamily="var(--mono)">{shown.close.toFixed(4)}</text>
          </>}
        </svg>
      )}

      {shown && (
        <div className="chart-ohlc">
          <span>{symbol || ''} · {view.length} bars</span>
          <span>O <b>{shown.open.toFixed(4)}</b></span>
          <span>H <b>{shown.high.toFixed(4)}</b></span>
          <span>L <b>{shown.low.toFixed(4)}</b></span>
          <span>C <b className={shown.close >= shown.open ? 'is-up' : 'is-down'}>{shown.close.toFixed(4)}</b></span>
          <span>{fmtT(shown.epoch)}</span>
        </div>
      )}

      <div className="chart-legend">
        {overlays.includes('ema9') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.ema9 }} />EMA 9</div>}
        {overlays.includes('ema21') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.ema21 }} />EMA 21</div>}
        {overlays.includes('sma50') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.sma50 }} />SMA 50</div>}
        {overlays.includes('bb') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.bb }} />BB 20/2</div>}
        {overlays.includes('st') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.st }} />SuperTrend</div>}
        {overlays.includes('vwap') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.vwap }} />VWAP</div>}
        {overlays.includes('psar') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.psar }} />PSAR</div>}
        {mode === 'heiken' && <div className="legend"><span className="legend__swatch" style={{ background: 'var(--text-dim)' }} />Heiken Ashi</div>}
      </div>

      <div className="chart-tools">
        <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => zoom(1)}>+</button>
        <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => zoom(-1)}>−</button>
        <button type="button" title="Reset zoom" aria-label="Reset zoom" onClick={reset}>⟲</button>
      </div>

      <div className="chart-note">{view.length} bars · {follow ? 'live' : 'history'} · {mode === 'heiken' ? 'Heiken Ashi · ' : ''}{pane === 'rsi' ? 'RSI 14' : pane === 'macd' ? 'MACD 12/26/9' : pane === 'willr' ? 'Williams %R 14' : 'no sub-pane'} · vol overlay</div>
      <div className="chart-hint">drag to pan · scroll / pinch to zoom · double-click to reset</div>
    </div>
  );
}
