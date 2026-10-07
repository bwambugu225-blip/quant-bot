import React, { useMemo } from 'react';
import { decimalsFor } from '../lib/marketStore.js';

// Tick-line chart styled to match Deriv's dark chart surface: coral/green/red
// accent line, faint grid, and a live price dot at the leading edge. Rendered
// from the real live price buffer supplied by the engine.
export default function ChartArea({ prices, up, sym, height = null }) {
  const W = 480;
  const H = 320;
  const PAD = 18;

  const { path, area, min, max, lastX, lastY, decimals } = useMemo(() => {
    const arr = (prices || []).slice(-160);
    if (arr.length < 2) {
      return { path: '', area: '', min: 0, max: 0, lastX: PAD, lastY: H / 2, decimals: 2 };
    }
    const lo = Math.min(...arr);
    const hi = Math.max(...arr);
    const span = hi - lo || 1;
    const px = i => PAD + (i / Math.max(1, arr.length - 1)) * (W - PAD * 2);
    const py = q => PAD + (1 - (q - lo) / span) * (H - PAD * 2);
    let d = '';
    arr.forEach((q, i) => { d += `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(q).toFixed(1)} `; });
    const a = `${d} L${px(arr.length - 1).toFixed(1)},${H - PAD} L${PAD},${H - PAD} Z`;
    return {
      path: d.trim(), area: a, min: lo, max: hi,
      lastX: px(arr.length - 1), lastY: py(arr[arr.length - 1]),
      decimals: decimalsFor(sym),
    };
  }, [prices, sym]);

  const lineColor = up ? 'var(--buy)' : '#ec3f3f';

  return (
    <div className="chart-area" style={height ? { height } : undefined}>
      <svg className="chart-area__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? '#4bb4b3' : '#ec3f3f'} stopOpacity="0.22" />
            <stop offset="100%" stopColor={up ? '#4bb4b3' : '#ec3f3f'} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1={PAD} x2={W - PAD} y1={PAD + (i / 4) * (H - PAD * 2)} y2={PAD + (i / 4) * (H - PAD * 2)} stroke="#20242f" strokeWidth="1" />
        ))}
        {path && <path d={area} fill="url(#chartFill)" />}
        {path && <path d={path} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
        {path && <circle cx={lastX} cy={lastY} r="4" fill={lineColor} />}
        {path && <circle cx={lastX} cy={lastY} r="8" fill={lineColor} opacity="0.25" />}
        {path && (
          <>
            <text x={PAD} y={PAD - 4} fill="#5c616d" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              {max.toFixed(decimals)}
            </text>
            <text x={PAD} y={H - PAD + 12} fill="#5c616d" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              {min.toFixed(decimals)}
            </text>
          </>
        )}
        {!path && (
          <text x={W / 2} y={H / 2} textAnchor="middle" fill="#5c616d" fontSize="12">
            Waiting for live ticks…
          </text>
        )}
      </svg>
    </div>
  );
}
