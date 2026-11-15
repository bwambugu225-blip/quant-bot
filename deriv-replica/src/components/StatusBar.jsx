import React from 'react';
import { addComma } from '../lib/format.js';

// Bottom status bar — the desk's own instrumentation. It reports the health of
// the live stream (state, tick rate, freshness, reconnect count), the execution
// latency and the session P&L, so a stalled feed or a slow venue is visible
// without opening a log.
export default function StatusBar({ state, health, symbol }) {
  const m = health || state?.market;
  const age = m?.age;
  const fresh = age != null && age < 3000;
  const stale = age != null && age > 10000;

  const connState = m?.connected ? (stale ? 'quiet' : 'live') : (m?.state === 'retrying' || m?.state === 'connecting' ? 'reconnecting' : 'offline');
  const connCls = connState === 'live' ? 'is-up' : connState === 'offline' ? 'is-down' : 'is-warn';
  const connDot = connState === 'live' ? 'is-live' : connState === 'offline' ? 'is-err' : 'is-warn';

  const pnl = state?.pnl ?? 0;
  const rate = m?.rate != null ? m.rate.toFixed(1) : '—';
  const lat = state?.exec?.p50;

  return (
    <div className="statusbar">
      <div className="statusbar__item">
        <span className={`dot ${connDot} ${connState === 'live' ? 'is-pulse' : ''}`} />
        <span className="statusbar__k">FEED</span>
        <span className={connCls} style={{ textTransform: 'uppercase' }}>{connState}</span>
      </div>

      <div className="statusbar__item">
        <span className="statusbar__k">SYMBOL</span>
        <b>{symbol}</b>
      </div>

      <div className="statusbar__item">
        <span className="statusbar__k">RATE</span>
        <b>{rate}</b>
        <span className="statusbar__k">t/s</span>
      </div>

      <div className="statusbar__item">
        <span className="statusbar__k">TICK AGE</span>
        <b className={stale ? 'is-warn' : fresh ? 'is-up' : ''}>
          {age == null ? '—' : age < 1000 ? `${age} ms` : `${(age / 1000).toFixed(1)} s`}
        </b>
      </div>

      <div className="statusbar__item">
        <span className="statusbar__k">TICKS</span>
        <b>{addComma(m?.ticks ?? 0, 0)}</b>
      </div>

      <div className="statusbar__item">
        <span className="statusbar__k">RECONN</span>
        <b className={m?.reconnects ? 'is-warn' : ''}>{m?.reconnects ?? 0}</b>
      </div>

      <div className="statusbar__spacer" />

      <div className="statusbar__item">
        <span className="statusbar__k">EXEC p50</span>
        <b>{lat != null ? `${lat} ms` : '—'}</b>
      </div>

      <div className="statusbar__item">
        <span className="statusbar__k">WARM-UP</span>
        <b>{state?.warmup?.have ?? 0}/{state?.warmup?.need ?? 0}</b>
      </div>

      <div className="statusbar__item">
        <span className="statusbar__k">SESSION P&L</span>
        <b className={pnl > 0 ? 'is-up' : pnl < 0 ? 'is-down' : ''}>
          {pnl >= 0 ? '+' : ''}{addComma(pnl)}
        </b>
      </div>

      <div className="statusbar__item">
        <span className="statusbar__k">W/L</span>
        <b><span className="is-up">{state?.wins ?? 0}</span>/<span className="is-down">{state?.losses ?? 0}</span></b>
      </div>
    </div>
  );
}
