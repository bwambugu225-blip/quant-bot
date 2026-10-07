import React, { useMemo } from 'react';

// Tick-line chart styled to match Deriv's dark chart surface: coral/green/red
// accent line, faint grid, and a live price dot at the leading edge.
export default function ChartArea({ market, tick, up, height = 300 }) {
  const W = 480;
  const H = 320;
  const PAD = 18;

  const { path, area, min, max, lastX, lastY } = useMemo(() => {
    const ticks = market.ticks.slice(-160);
    const quotes = ticks.map(t => t.quote);
    const lo = Math.min(...quotes);
    const hi = Math.max(...quotes);
    const span = hi - lo || 1;
    const px = i => PAD + (i / Math.max(1, ticks.length - 1)) * (W - PAD * 2);
    const py = q => PAD + (1 - (q - lo) / span) * (H - PAD * 2);
    let d = '';
    ticks.forEach((t, i) => {
      d += `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(t.quote).toFixed(1)} `;
    });
    const a = `${d} L${px(ticks.length - 1).toFixed(1)},${H - PAD} L${PAD},${H - PAD} Z`;
    return {
      path: d.trim(),
      area: a,
      min: lo,
      max: hi,
      lastX: px(ticks.length - 1),
      lastY: py(ticks[ticks.length - 1].quote),
    };
  }, [tick, market]);

  const lineColor = up ? 'var(--buy)' : '#ec3f3f';

  return (
    <div className="chart-area" style={{ height }}>
      <svg className="chart-area__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? '#4bb4b3' : '#ec3f3f'} stopOpacity="0.22" />
            <stop offset="100%" stopColor={up ? '#4bb4b3' : '#ec3f3f'} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={PAD}
            x2={W - PAD}
            y1={PAD + (i / 4) * (H - PAD * 2)}
            y2={PAD + (i / 4) * (H - PAD * 2)}
            stroke="#20242f"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="url(#chartFill)" />
        <path d={path} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lastX} cy={lastY} r="4" fill={lineColor} />
        <circle cx={lastX} cy={lastY} r="8" fill={lineColor} opacity="0.25" />
        <text x={PAD} y={PAD - 4} fill="#5c616d" fontSize="10" fontFamily="IBM Plex Mono, monospace">
          {max.toFixed(market.decimals)}
        </text>
        <text x={PAD} y={H - PAD + 12} fill="#5c616d" fontSize="10" fontFamily="IBM Plex Mono, monospace">
          {min.toFixed(market.decimals)}
        </text>
      </svg>
    </div>
  );
}
