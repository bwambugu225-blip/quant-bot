import test from 'node:test';
import assert from 'node:assert/strict';
import { MIN_BARS, MAX_BARS, DEFAULT_BARS, maxBars, visibleWindow, zoomWindow, panWindow } from '../src/lib/chartView.js';

test('maxBars clamps the zoom-out limit to what the buffer holds', () => {
  assert.equal(maxBars(1000), MAX_BARS);
  assert.equal(maxBars(150), 150);
  assert.equal(maxBars(5), MIN_BARS);
  assert.equal(maxBars(0), DEFAULT_BARS);
});

test('visibleWindow follows the live edge by default', () => {
  const w = visibleWindow({ total: 600, bars: DEFAULT_BARS, endIdx: 0, follow: true });
  assert.equal(w.end, 600);
  assert.equal(w.start, 600 - DEFAULT_BARS);
  assert.equal(w.bars, DEFAULT_BARS);
  assert.equal(w.follow, true);
});

test('visibleWindow holds a panned-back window and clamps it inside the tape', () => {
  const w = visibleWindow({ total: 600, bars: 120, endIdx: 300, follow: false });
  assert.equal(w.end, 300);
  assert.equal(w.start, 180);
  assert.equal(w.follow, false);

  const low = visibleWindow({ total: 600, bars: 120, endIdx: 10, follow: false });
  assert.equal(low.end, 120, 'window cannot run off the start of the tape');

  const high = visibleWindow({ total: 600, bars: 120, endIdx: 999, follow: false });
  assert.equal(high.end, 600);
  assert.equal(high.follow, true, 'pushing past the live edge resumes follow');
});

test('visibleWindow never shows fewer than MIN_BARS or more than the buffer', () => {
  const tiny = visibleWindow({ total: 600, bars: 3, endIdx: 0, follow: true });
  assert.equal(tiny.bars, MIN_BARS);
  const big = visibleWindow({ total: 90, bars: 400, endIdx: 0, follow: true });
  assert.equal(big.bars, 90);
  assert.equal(big.start, 0);
});

test('zoomWindow keeps the anchored bar in place when zooming a panned-back view', () => {
  // Following the live edge: the right edge stays pinned regardless of anchor.
  const live = zoomWindow({ total: 600, bars: 120, end: 600, follow: true, anchor: 0, factor: 1 / 1.2 });
  assert.equal(live.bars, 100);
  assert.equal(live.end, 600, 'live edge stays pinned');
  assert.equal(live.follow, true);

  // Panned back: anchor the middle and the bar under the cursor stays put.
  const before = { total: 600, bars: 120, end: 400, follow: false };
  const mid = zoomWindow({ ...before, anchor: 0.5, factor: 1 / 2 });
  assert.equal(mid.bars, 60);
  const barBefore = (before.end - before.bars) + 0.5 * (before.bars - 1);
  const barAfter = (mid.end - mid.bars) + 0.5 * (mid.bars - 1);
  assert.ok(Math.abs(barAfter - barBefore) <= 1, 'anchored bar drifts by at most one');
});

test('zoomWindow clamps to MIN_BARS and to the buffer size', () => {
  const in1 = zoomWindow({ total: 600, bars: 24, end: 600, follow: true, anchor: 1, factor: 1 / 10 });
  assert.equal(in1.bars, MIN_BARS);
  const out = zoomWindow({ total: 90, bars: 80, end: 90, follow: true, anchor: 1, factor: 10 });
  assert.equal(out.bars, 90);
});

test('panWindow moves back in time for a positive drag and clamps at both ends', () => {
  const back = panWindow({ total: 600, bars: 120, end: 600, dxPx: 100, barWidth: 10 });
  assert.equal(back.end, 590);
  assert.equal(back.follow, false);

  const toStart = panWindow({ total: 600, bars: 120, end: 300, dxPx: 100000, barWidth: 10 });
  assert.equal(toStart.end, 120, 'cannot pan past the start');

  const toLive = panWindow({ total: 600, bars: 120, end: 300, dxPx: -100000, barWidth: 10 });
  assert.equal(toLive.end, 600);
  assert.equal(toLive.follow, true);
});

test('a full pan-then-zoom cycle stays inside the tape', () => {
  let s = { total: 600, bars: DEFAULT_BARS, endIdx: 600, follow: true };
  let w = visibleWindow(s);
  for (let i = 0; i < 30; i++) {
    const p = panWindow({ total: s.total, bars: w.bars, end: w.end, dxPx: 80, barWidth: 8 });
    w = visibleWindow({ total: s.total, bars: w.bars, endIdx: p.end, follow: p.follow });
    assert.ok(w.start >= 0 && w.end <= s.total, 'window stays in range while panning');
  }
  for (let i = 0; i < 30; i++) {
    const z = zoomWindow({ total: s.total, bars: w.bars, end: w.end, follow: w.follow, anchor: 0.3, factor: 1.3 });
    w = visibleWindow({ total: s.total, bars: z.bars, endIdx: z.end, follow: z.follow });
    assert.ok(w.start >= 0 && w.end <= s.total, 'window stays in range while zooming');
    assert.ok(w.bars >= MIN_BARS && w.bars <= MAX_BARS, 'bar count stays within bounds');
  }
});
