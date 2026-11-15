import React from 'react';
import { emaSeries, smaSeries, bollingerSeries, rsiSeries, macdSeries, closes } from '../lib/indicators.js';

// A dependency-free SVG chart: candles or line, with optional EMA/SMA/Bollinger
// overlays and an RSI/MACD sub-pane. It renders from the same candles the engine
// trades, so what is drawn is what the strategy sees.
const OVERLAY_COLORS = { ema9: '#3b82f6', ema21: '#f0a020', sma50: '#8b5cf6', bbUpper: '#4b5563', bbLower: '#4b5563' };

function useSize(ref) {
  const [size, setSize] = React.useState({ w: 800, h: 420 });
  React.useEffect(() => {
    if (!ref.current) return undefined;
    const el = ref.current;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth || 800, h: el.clientHeight || 420 });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth || 800, h: el.clientHeight || 420 });
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export default function Chart({ candles, up, overlays = ['ema9', 'ema21', 'bb'], pane = 'rsi', mode = 'candles' }) {
  const wrapRef = React.useRef(null);
  const { w, h } = useSize(wrapRef);

  const view = React.useMemo(() => {
    const n = Math.min(candles.length, 200);
    return candles.slice(-n);
  }, [candles]);

  const geom = React.useMemo(() => {
    const padL = 8, padR = 56, padT = 8, padB = 20;
    const paneH = pane === 'none' ? 0 : Math.round((h - padT - padB) * 0.24);
    const mainH = h - padT - padB - paneH - (paneH ? 8 : 0);
    const plotW = Math.max(10, w - padL - padR);
    if (view.length < 2) return null;

    const cl = closes(view);
    let lo = Infinity, hi = -Infinity;
    view.forEach(k => { lo = Math.min(lo, k.low); hi = Math.max(hi, k.high); });
    const bb = overlays.includes('bb') ? bollingerSeries(cl, 20, 2) : null;
    if (bb) bb.upper.forEach(v => { if (v != null) hi = Math.max(hi, v); });
    if (bb) bb.lower.forEach(v => { if (v != null) lo = Math.min(lo, v); });
    const pad = (hi - lo) * 0.06 || 1;
    hi += pad; lo -= pad;
    const x = i => padL + (i / (view.length - 1)) * plotW;
    const y = v => padT + (1 - (v - lo) / (hi - lo)) * mainH;

    const ema9 = overlays.includes('ema9') ? emaSeries(cl, 9) : null;
    const ema21 = overlays.includes('ema21') ? emaSeries(cl, 21) : null;
    const sma50 = overlays.includes('sma50') ? smaSeries(cl, 50) : null;

    const pathOf = (series) => {
      let d = '';
      series.forEach((v, i) => { if (v == null) return; d += (d ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); });
      return d;
    };

    let paneGeom = null;
    if (paneH) {
      const py = v => padT + mainH + 8 + (1 - v / 100) * paneH;
      const rsi = pane === 'rsi' ? rsiSeries(cl, 14) : null;
      const macd = pane === 'macd' ? macdSeries(cl) : null;
      let pPath = '', sPath = '', hist = [];
      if (rsi) pPath = pathOf(rsi);
      if (macd) {
        const vals = [...macd.macd, ...macd.signal].filter(v => v != null);
        const lo2 = Math.min(...vals), hi2 = Math.max(...vals);
        const my = v => padT + mainH + 8 + (1 - (v - lo2) / ((hi2 - lo2) || 1)) * paneH;
        pPath = '';
        macd.macd.forEach((v, i) => { if (v == null) return; pPath += (pPath ? 'L' : 'M') + x(i).toFixed(1) + ' ' + my(v).toFixed(1); });
        macd.signal.forEach((v, i) => { if (v == null) return; sPath += (sPath ? 'L' : 'M') + x(i).toFixed(1) + ' ' + my(v).toFixed(1); });
        hist = macd.hist.map((v, i) => ({ v, i, y: v == null ? null : my(v) }));
        paneGeom = { pPath, sPath, hist, mid: my(0), height: paneH, top: padT + mainH + 8 };
      } else {
        paneGeom = { pPath, sPath, hist: [], mid: py(50), height: paneH, top: padT + mainH + 8 };
      }
    }

    return { padL, padR, padT, padB, plotW, mainH, lo, hi, x, y, ema9, ema21, sma50, bb, pathOf, paneGeom };
  }, [view, w, h, overlays, pane]);

  const last = view[view.length - 1];
  const priceY = geom && last ? geom.y(last.close) : null;

  return (
    <div className="chartwrap" ref={wrapRef}>
      {geom && (
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          {[0, 0.25, 0.5, 0.75, 1].map(f => {
            const y = geom.padT + f * geom.mainH;
            const price = geom.hi - f * (geom.hi - geom.lo);
            return (
              <g key={f}>
                <line x1={geom.padL} x2={w - geom.padR} y1={y} y2={y} stroke="#1b2230" strokeWidth="1" />
                <text x={w - geom.padR + 6} y={y + 3} fill="#5f6b85" fontSize="10" fontFamily="monospace">{price.toFixed(4)}</text>
              </g>
            );
          })}

          {mode === 'candles' ? view.map((k, i) => {
            const bull = k.close >= k.open;
            const color = bull ? 'var(--up)' : 'var(--down)';
            const bw = Math.max(1.5, (geom.plotW / view.length) * 0.62);
            const cx = geom.x(i);
            const yo = geom.y(k.open), yc = geom.y(k.close);
            return (
              <g key={k.epoch + '-' + i}>
                <line x1={cx} x2={cx} y1={geom.y(k.high)} y2={geom.y(k.low)} stroke={color} strokeWidth="1" />
                <rect x={cx - bw / 2} y={Math.min(yo, yc)} width={bw} height={Math.max(1, Math.abs(yc - yo))} fill={color} />
              </g>
            );
          }) : (
            <path d={view.map((k, i) => `${i ? 'L' : 'M'}${geom.x(i).toFixed(1)} ${geom.y(k.close).toFixed(1)}`).join(' ')} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
          )}

          {geom.bb && <>
            <path d={geom.pathOf(geom.bb.upper)} fill="none" stroke={OVERLAY_COLORS.bbUpper} strokeWidth="1" strokeDasharray="3 3" />
            <path d={geom.pathOf(geom.bb.lower)} fill="none" stroke={OVERLAY_COLORS.bbLower} strokeWidth="1" strokeDasharray="3 3" />
          </>}
          {geom.ema9 && <path d={geom.pathOf(geom.ema9)} fill="none" stroke={OVERLAY_COLORS.ema9} strokeWidth="1.3" />}
          {geom.ema21 && <path d={geom.pathOf(geom.ema21)} fill="none" stroke={OVERLAY_COLORS.ema21} strokeWidth="1.3" />}
          {geom.sma50 && <path d={geom.pathOf(geom.sma50)} fill="none" stroke={OVERLAY_COLORS.sma50} strokeWidth="1.3" />}

          {priceY != null && <>
            <line x1={geom.padL} x2={w - geom.padR} y1={priceY} y2={priceY} stroke={up ? 'var(--up)' : 'var(--down)'} strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
            <rect x={w - geom.padR + 2} y={priceY - 8} width={geom.padR - 4} height={16} rx="3" fill={up ? 'var(--up)' : 'var(--down)'} />
            <text x={w - geom.padR + 6} y={priceY + 3} fill="#04231a" fontSize="10" fontWeight="700" fontFamily="monospace">{last.close.toFixed(4)}</text>
          </>}

          {geom.paneGeom && <>
            <line x1={geom.padL} x2={w - geom.padR} y1={geom.paneGeom.mid} y2={geom.paneGeom.mid} stroke="#2d374d" strokeWidth="1" strokeDasharray="3 3" />
            {geom.paneGeom.hist.map((bar, i) => bar.y == null ? null : (
              <rect key={i} x={geom.x(bar.i) - 1} y={Math.min(bar.y, geom.paneGeom.mid)} width="2" height={Math.abs(bar.y - geom.paneGeom.mid)} fill={bar.v >= 0 ? 'var(--up)' : 'var(--down)'} opacity="0.5" />
            ))}
            <path d={geom.paneGeom.pPath} fill="none" stroke={pane === 'rsi' ? 'var(--accent-2)' : 'var(--accent)'} strokeWidth="1.2" />
            {geom.paneGeom.sPath && <path d={geom.paneGeom.sPath} fill="none" stroke="var(--warn)" strokeWidth="1.2" />}
          </>}
        </svg>
      )}
      <div className="chart-overlay">
        {overlays.includes('ema9') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.ema9 }} />EMA 9</div>}
        {overlays.includes('ema21') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.ema21 }} />EMA 21</div>}
        {overlays.includes('sma50') && <div className="legend"><span className="legend__swatch" style={{ background: OVERLAY_COLORS.sma50 }} />SMA 50</div>}
        {overlays.includes('bb') && <div className="legend"><span className="legend__swatch" style={{ background: '#4b5563' }} />Bollinger 20/2</div>}
      </div>
      <div className="chart-note">
        {view.length} candles · {pane === 'rsi' ? 'RSI 14' : pane === 'macd' ? 'MACD 12/26/9' : 'no sub-pane'}
      </div>
    </div>
  );
}
