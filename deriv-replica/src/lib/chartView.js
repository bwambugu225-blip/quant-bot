// Pure windowing math for the chart's pan/zoom view. Kept out of the component
// so the behaviour is testable without a DOM: the component only turns these
// results into a slice of the candle buffer.

export const MIN_BARS = 20;
export const MAX_BARS = 600;
export const DEFAULT_BARS = 120;

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Bars the user is allowed to see, bounded by what the buffer actually holds.
export function maxBars(total) {
  return clamp(total || DEFAULT_BARS, MIN_BARS, MAX_BARS);
}

// Resolve the visible window: `follow` pins the right edge to the live candle,
// otherwise the window ends at `endIdx` (clamped so it never runs off the tape).
export function visibleWindow({ total, bars, endIdx, follow }) {
  const cap = maxBars(total);
  const visBars = clamp(bars, MIN_BARS, cap);
  const end = follow ? total : clamp(endIdx, Math.min(visBars, total), total);
  const start = Math.max(0, end - visBars);
  return { start, end, bars: visBars, follow: end >= total };
}

// Zoom about a fractional anchor [0..1] so the bar under the cursor stays put.
// While following the live edge the right edge is pinned instead, so zooming
// never scrolls the newest candle out of view.
export function zoomWindow({ total, bars, end, follow, anchor = 1, factor }) {
  const cap = maxBars(total);
  const visBars = clamp(bars, MIN_BARS, cap);
  const nb = clamp(Math.round(visBars * factor), MIN_BARS, cap);
  if (follow) return { bars: nb, end: total, follow: true };
  const frac = clamp(anchor, 0, 1);
  const base = end - visBars;
  const anchorAbs = base + frac * (visBars - 1);
  const ne = clamp(Math.round(anchorAbs - frac * (nb - 1) + nb), Math.min(nb, total), total);
  return { bars: nb, end: ne, follow: ne >= total };
}

// Drag by `dxPx` pixels; a positive delta moves the view back in time.
export function panWindow({ total, bars, end, dxPx, barWidth }) {
  const cap = maxBars(total);
  const visBars = clamp(bars, MIN_BARS, cap);
  const delta = Math.round(dxPx / Math.max(1, barWidth));
  const ne = clamp(end - delta, Math.min(visBars, total), total);
  return { end: ne, follow: ne >= total };
}
