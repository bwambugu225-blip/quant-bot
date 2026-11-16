import React from 'react';
import {
  emaSeries, smaSeries, bollingerSeries, rsiSeries, macdSeries, closes, superTrendSeries,
  vwapSeries, psarSeries, heikenAshi, williamsRSeries,
} from '../lib/indicators.js';
import { DEFAULT_BARS, clamp, visibleWindow, zoomWindow, panWindow } from '../lib/chartView.js';
import { operandSeries, INDICATORS } from '../lib/strategyBuilder.js';
import { STUDY_COLORS } from '../lib/studies.js';

// A dependency-free SVG chart: candles, Heiken Ashi or line, with optional
// EMA/SMA/Bollinger/SuperTrend/VWAP/Parabolic-SAR overlays, a volume histogram
// and any number of indicator studies.
//
// A "study" is an indicator the user added to the chart. Price-scale studies
// (moving averages, bands, PSAR) draw over the candles; every other study gets
// its own pane below, so an oscillator stack is readable at a glance. Study
// values come from the same `operandSeries` resolver the strategy builder uses,
// so what is drawn is what a strategy would trade.
//
// The view is a horizontal window over the candle buffer: drag to pan, scroll
// or pinch to zoom. While the window sits at the live edge it follows new
// candles; once the user pans back it holds its place until they return.
const OVERLAY_COLORS = { ema9: '#4c86e0', ema21: '#c8a250', sma50: '#8b7fd4', bb: '#3d4756', st: '#2bb673', vwap: '#d99a3a', psar: '#e0524f' };

// Oscillator studies whose range is fixed, so their pane does not jump as the
// window moves. Everything else auto-scales to the visible series.
const FIXED_RANGE = {
  rsi: [0, 100], stoch: [0, 100], stochRsi: [0, 100], mfi: [0, 100],
  ultimate: [0, 100], aroon: [0, 100], adx: [0, 100], williamsR: [-100, 0],
};

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

const isNum = v => v != null && Number.isFinite(v);

export default function Chart({ candles, up, overlays = ['ema9', 'ema21', 'bb'], pane = 'rsi', mode = 'candles', symbol, studies = [], onRemoveStudy }) {
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

  // Price-scale studies overlay the candles; the rest get their own pane. The
  // series are resolved over the *full* buffer then sliced, so a study's window
  // matches the candles exactly as the user pans.
  const mainStudies = React.useMemo(() => studies.filter(s => s.panel === 'main'), [studies]);
  const subStudies = React.useMemo(() => studies.filter(s => s.panel !== 'main'), [studies]);

  const mainStudySeries = React.useMemo(() => mainStudies.map(study => ({
    study,
    outputs: INDICATORS[study.name].outputs.map(output => ({
      output,
      full: operandSeries(candles, { kind: 'indicator', name: study.name, params: study.params, output }),
    })),
  })), [mainStudies, candles]);

  const subStudySeries = React.useMemo(() => subStudies.map(study => ({
    study,
    outputs: INDICATORS[study.name].outputs.map(output => ({
      output,
      full: operandSeries(candles, { kind: 'indicator', name: study.name, params: study.params, output }),
    })),
  })), [subStudies, candles]);

  const geom = React.useMemo(() => {
    const padL = 8, padR = 62, padT = 30, padB = 22;
    const totalPlot = h - padT - padB;
    const gap = 10;
    // Sub-panes stack below the price plot. The price plot keeps at least 120px,
    // so when the study stack would crowd it out only the first panes are drawn
    // (they are ordered as added; removing one frees a slot).
    const MIN_PANE = 26;
    const maxPanes = Math.max(1, Math.floor((totalPlot - 120) / (MIN_PANE + gap)));
    const legacyPane = pane !== 'none';
    const paneBudget = Math.max(0, maxPanes - (legacyPane ? 1 : 0));
    const subPanes = subStudySeries.slice(0, paneBudget);
    const paneCount = subPanes.length + (legacyPane ? 1 : 0);
    const paneH = paneCount ? clamp(Math.round((totalPlot - 120 - paneCount * gap) / paneCount), MIN_PANE, 90) : 0;
    const mainH = totalPlot - (paneCount ? paneCount * (paneH + gap) : 0);
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
    // Price-scale studies widen the range too.
    mainStudySeries.forEach(s => s.outputs.forEach(o => {
      for (let i = start; i < end; i++) { const v = o.full[i]; if (isNum(v)) { hi = Math.max(hi, v); lo = Math.min(lo, v); } }
    }));
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
    // A study's full series is sliced to the visible window before drawing.
    const studyPath = (full) => {
      let d = '';
      for (let i = start; i < end; i++) {
        const v = full[i];
        if (!isNum(v)) continue;
        d += (d ? 'L' : 'M') + x(i - start).toFixed(1) + ' ' + y(v).toFixed(1);
      }
      return d;
    };

    const maxVol = Math.max(1, ...view.map(k => k.volume ?? k.ticks ?? 0));
    const volY = v => padT + mainH - (v / maxVol) * Math.max(18, mainH * 0.14);

    // ── sub-panes: the legacy quick pane first, then each study ─────────────
    const panes = [];
    const addPane = (spec) => {
      const top = padT + mainH + gap + panes.length * (paneH + gap);
      panes.push({ ...spec, top, height: paneH });
    };
    if (legacyPane) addPane({ kind: 'legacy', pane });
    subPanes.forEach(s => addPane({ kind: 'study', study: s.study, outputs: s.outputs }));

    const panePath = (full, p) => {
      let d = '';
      for (let i = start; i < end; i++) {
        const v = full[i];
        if (!isNum(v)) continue;
        d += (d ? 'L' : 'M') + x(i - start).toFixed(1) + ' ' + p.y(v).toFixed(1);
      }
      return d;
    };

    panes.forEach(p => {
      let lo2, hi2;
      if (p.kind === 'legacy') {
        if (p.pane === 'rsi') { lo2 = 0; hi2 = 100; }
        else if (p.pane === 'willr') { lo2 = -100; hi2 = 0; }
        else { // macd — auto
          const m = macdSeries(cl);
          const vals = [...m.macd, ...m.signal].filter(isNum);
          lo2 = vals.length ? Math.min(...vals) : -1; hi2 = vals.length ? Math.max(...vals) : 1;
        }
      } else {
        const fixed = FIXED_RANGE[p.study.name];
        if (fixed) { [lo2, hi2] = fixed; }
        else {
          let mn = Infinity, mx = -Infinity;
          p.outputs.forEach(o => { for (let i = start; i < end; i++) { const v = o.full[i]; if (isNum(v)) { mn = Math.min(mn, v); mx = Math.max(mx, v); } } });
          if (!Number.isFinite(mn)) { mn = -1; mx = 1; }
          const pad2 = (mx - mn) * 0.08 || 1;
          lo2 = mn - pad2; hi2 = mx + pad2;
        }
      }
      p.lo = lo2; p.hi = hi2;
      p.y = v => p.top + (1 - (v - lo2) / ((hi2 - lo2) || 1)) * p.height;
      p.paths = [];
      if (p.kind === 'legacy') {
        if (p.pane === 'rsi') p.paths.push({ color: '#8b7fd4', d: pathOf(rsiSeries(cl, 14)) });
        else if (p.pane === 'willr') {
          const wy = v => p.top + ((v + 100) / 100) * p.height;
          let d = '';
          williamsRSeries(view, 14).forEach((v, i) => { if (!isNum(v)) return; d += (d ? 'L' : 'M') + x(i).toFixed(1) + ' ' + wy(v).toFixed(1); });
          p.paths.push({ color: 'var(--gold)', d });
        } else {
          const m = macdSeries(cl);
          p.paths.push({ color: 'var(--accent)', d: pathOf(m.macd) });
          p.paths.push({ color: 'var(--gold)', d: pathOf(m.signal) });
          p.hist = m.hist.map((v, i) => ({ v, x: x(i), y: isNum(v) ? p.y(v) : null }));
          p.mid = p.y(0);
        }
        if (p.pane === 'rsi') { p.bandLo = p.y(30); p.bandHi = p.y(70); p.mid = p.y(50); }
        if (p.pane === 'willr') { p.bandLo = p.y(-80); p.bandHi = p.y(-20); p.mid = p.y(-50); }
        p.label = p.pane === 'rsi' ? 'RSI 14' : p.pane === 'willr' ? 'Williams %R 14' : 'MACD 12/26/9';
      } else {
        p.outputs.forEach((o, oi) => {
          const d = panePath(o.full, p);
          if (d) p.paths.push({ color: STUDY_COLORS[oi % STUDY_COLORS.length], d });
        });
        p.label = INDICATORS[p.study.name].label;
      }
    });

    const stLine = st ? st.dir.map((d, i) => (d == null ? null : d === 1 ? st.dn[i] : st.up[i])) : null;

    return { padL, padR, padT, padB, plotW, mainH, lo, hi, x, y, ema9, ema21, sma50, bb, pathOf, studyPath, volY, st, stLine, vwap, psar, panes, mainStudySeries };
  }, [view, drawCandles, w, h, overlays, pane, mainStudySeries, subStudySeries, start, end, subStudies.length]);
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
    // Ignore drags that start on an overlay control (zoom buttons, legend
    // remove buttons), otherwise the pointer capture swallows the click before
    // it reaches the button.
    if (e.target && e.target.closest && e.target.closest('.chart-tools, .chart-legend')) return;
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
  const paneNames = geom ? geom.panes.map(p => p.label).join(' · ') : '';

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

          {geom.mainStudySeries && geom.mainStudySeries.map((s, si) => s.outputs.map((o, oi) => (
            <path key={`ms${si}-${oi}`} d={geom.studyPath(o.full)} fill="none"
              stroke={STUDY_COLORS[(si * 2 + oi) % STUDY_COLORS.length]} strokeWidth="1.2" opacity="0.92" />
          )))}

          {priceY != null && <>
            <line x1={geom.padL} x2={w - geom.padR} y1={priceY} y2={priceY} stroke={up ? 'var(--up)' : 'var(--down)'} strokeWidth="1" strokeDasharray="2 3" opacity="0.75" />
            <rect x={w - geom.padR + 2} y={priceY - 8} width={geom.padR - 4} height={16} rx="2" fill={up ? 'var(--up)' : 'var(--down)'} />
            <text x={w - geom.padR + 5} y={priceY + 3.5} fill="#04150d" fontSize="10" fontWeight="700" fontFamily="var(--mono)">{last.close.toFixed(4)}</text>
          </>}

          {geom.panes.map((p, pi) => (
            <g key={`pane${pi}`}>
              <line x1={geom.padL} x2={w - geom.padR} y1={p.top} y2={p.top} stroke="var(--line)" strokeWidth="1" />
              {p.bandLo != null && <line x1={geom.padL} x2={w - geom.padR} y1={p.bandLo} y2={p.bandLo} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="3 3" />}
              {p.bandHi != null && <line x1={geom.padL} x2={w - geom.padR} y1={p.bandHi} y2={p.bandHi} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="3 3" />}
              {p.mid != null && <line x1={geom.padL} x2={w - geom.padR} y1={p.mid} y2={p.mid} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="3 3" />}
              {p.hist && p.hist.map((bar, i) => bar.y == null ? null : (
                <rect key={`h${i}`} x={bar.x - 1} y={Math.min(bar.y, p.mid)} width="2" height={Math.abs(bar.y - p.mid)} fill={bar.v >= 0 ? 'var(--up)' : 'var(--down)'} opacity="0.5" />
              ))}
              {p.paths.map((path, i) => <path key={`pp${i}`} d={path.d} fill="none" stroke={path.color} strokeWidth="1.2" />)}
              <text x={geom.padL + 2} y={p.top + 10} fill="var(--text-mute)" fontSize="9.5" fontFamily="var(--mono)">{p.label}</text>
              <text x={w - geom.padR + 6} y={p.top + 10} fill="var(--text-mute)" fontSize="9" fontFamily="var(--mono)">{p.hi.toFixed(1)}</text>
              <text x={w - geom.padR + 6} y={p.top + p.height} fill="var(--text-mute)" fontSize="9" fontFamily="var(--mono)">{p.lo.toFixed(1)}</text>
            </g>
          ))}

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
        {mainStudies.map((s, si) => (
          <div className="legend" key={`lg${si}`} title={JSON.stringify(s.params)}>
            <span className="legend__swatch" style={{ background: STUDY_COLORS[(si * 2) % STUDY_COLORS.length] }} />
            {INDICATORS[s.name].label}
            {onRemoveStudy && <button className="legend__x" onClick={() => onRemoveStudy(s)} type="button" title="Remove from chart">×</button>}
          </div>
        ))}
        {subStudies.map((s, si) => (
          <div className="legend" key={`lgs${si}`} title={JSON.stringify(s.params)}>
            <span className="legend__swatch" style={{ background: STUDY_COLORS[si % STUDY_COLORS.length] }} />
            {INDICATORS[s.name].label} ▾
            {onRemoveStudy && <button className="legend__x" onClick={() => onRemoveStudy(s)} type="button" title="Remove from chart">×</button>}
          </div>
        ))}
        {mode === 'heiken' && <div className="legend"><span className="legend__swatch" style={{ background: 'var(--text-dim)' }} />Heiken Ashi</div>}
      </div>

      <div className="chart-tools">
        <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => zoom(1)}>+</button>
        <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => zoom(-1)}>−</button>
        <button type="button" title="Reset zoom" aria-label="Reset zoom" onClick={reset}>⟲</button>
      </div>

      <div className="chart-note">{view.length} bars · {follow ? 'live' : 'history'} · {mode === 'heiken' ? 'Heiken Ashi · ' : ''}{paneNames || 'no sub-pane'} · vol overlay</div>
      <div className="chart-hint">drag to pan · scroll / pinch to zoom · double-click to reset</div>
    </div>
  );
}
