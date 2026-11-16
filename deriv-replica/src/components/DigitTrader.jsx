// Digit autotrader panel: Over/Under and Even/Odd.
//
// These two products settle on the last digit of the tick price, so the panel
// is a digit readout plus the few knobs the trader needs — which product, the
// window it measures, and how large a deviation from the baseline it demands
// before it will enter. The bar chart is the same 10-digit distribution the
// analytics column draws; here each digit is shaded by whether it wins the
// selected side, so the trade and the picture agree.
import React from 'react';
import { DIGIT_MODES, DIGIT_WINDOWS, digitMode } from '../lib/digitTrader.js';
import { CURRENCY, stakeLabel, stakeInKes, stakeFromKes, minStakeKes, money } from '../lib/format.js';

const pct = v => `${(v * 100).toFixed(1)}%`;

export default function DigitTrader({ config, read, onConfig, onStart, onStop, running, risk, onRisk, currency, symbol, digitSymbol }) {
  const cfg = { ...config };
  const mode = digitMode(cfg.mode);
  const set = patch => onConfig(patch);
  const setRisk = patch => onRisk({ ...risk, ...patch });
  if (!config || !risk) return <div className="empty">Loading digit autotrader…</div>;

  const counts = read?.counts || new Array(10).fill(0);
  const n = read?.n || 0;
  const max = Math.max(1, ...counts);
  const signal = read?.signal;
  const rates = read?.rates;
  // Which digits win the side the trader would take — the shading follows the
  // decision, so a bar's colour explains the entry rather than decorating it.
  const pick = signal?.side || cfg.side;
  const winsDigit = d => {
    if (mode.id === 'even_odd') return pick === 'down' ? d % 2 === 1 : d % 2 === 0;
    const b = Math.max(0, Math.min(9, Math.floor(cfg.barrier)));
    if (pick === 'down') return d < b;
    return d > b;
  };

  const stakeKes = stakeInKes(risk.stake, currency);
  const minKes = minStakeKes(currency);

  return (
    <div className="builder">
      <div className="builder__bar">
        <span className="pill">{mode.label} autotrader</span>
        <select className="sel" value={cfg.mode} onChange={e => set({ mode: e.target.value })}>
          {DIGIT_MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
        <select className="sel" value={cfg.side} onChange={e => set({ side: e.target.value })}>
          <option value="auto">Auto (best side)</option>
          <option value="up">{mode.upLabel} only</option>
          <option value="down">{mode.downLabel} only</option>
        </select>
        <div className="topbar__spacer" />
        {running
          ? <button className="btn btn--down" onClick={onStop} type="button">Stop bot</button>
          : <button className="btn btn--primary" onClick={onStart} type="button" title="Trade the digit read on the selected market">Start bot</button>}
      </div>

      <div className="builder__scroll">
        {!digitSymbol && (
          <div className="notice is-warn">
            Digit contracts are only offered on the synthetic indices. Select one in the market picker to trade {mode.label}.
          </div>
        )}

        <div className="section-title">Live digit read — {symbol} · last {n} ticks</div>
        <div className="digits">
          {counts.map((c, d) => (
            <div className="digit" key={d}>
              <div className={`digit__bar${winsDigit(d) ? ' is-hot' : ''}`}
                style={{ height: `${Math.max(4, (c / max) * 100)}%` }} title={`${d}: ${((c / Math.max(1, n)) * 100).toFixed(1)}%`} />
              <span className="digit__lbl">{d}</span>
            </div>
          ))}
        </div>

        {!n && <div className="empty" style={{ marginTop: 8 }}>Importing ticks…</div>}
        {n > 0 && (
          <div className="rows" style={{ marginTop: 10 }}>
            <Row k={`${mode.upLabel} win rate`} v={`${pct(rates.up.rate)} vs ${pct(rates.up.base)} base`}
              cls={rates.up.edge >= cfg.minEdge && rates.up.z >= cfg.minZ ? 'is-up' : ''} />
            <Row k={`${mode.downLabel} win rate`} v={`${pct(rates.down.rate)} vs ${pct(rates.down.base)} base`}
              cls={rates.down.edge >= cfg.minEdge && rates.down.z >= cfg.minZ ? 'is-up' : ''} />
            <Row k="Edge (z-score)" v={`${(rates.up.edge * 100).toFixed(1)}% (${rates.up.z.toFixed(2)}) / ${(rates.down.edge * 100).toFixed(1)}% (${rates.down.z.toFixed(2)})`} />
            <Row k="Distribution χ² (9 df)" v={read ? read.bias.chi2.toFixed(1) : '—'} cls={read && read.bias.chi2 > 16.9 ? 'is-up' : ''} />
          </div>
        )}

        <div className="section-title">Decision</div>
        {signal ? (
          <div className="notice is-up">
            <b>{mode.label} · {signal.label}</b> — {pct(signal.rate)} on {signal.sample} ticks against a {pct(signal.base)} baseline
            {signal.barrier != null ? `, barrier ${signal.barrier}` : ''}. Edge {(signal.edge * 100).toFixed(1)}%, z {signal.z.toFixed(2)}.
          </div>
        ) : (
          <div className="notice">
            {n < 20 ? 'Waiting for a full window…' : 'Standing aside — no side clears the edge gate. This is the expected read on a fair digit stream.'}
          </div>
        )}

        <div className="section-title">Trader settings</div>
        <div className="risk-grid">
          {mode.barrier && (
            <label className="field"><span className="field__lbl">Barrier digit (0–9)</span>
              <input type="number" min="0" max="9" value={cfg.barrier}
                onChange={e => set({ barrier: Math.max(0, Math.min(9, +e.target.value)) })} /></label>
          )}
          <label className="field"><span className="field__lbl">Sample window (ticks)</span>
            <select value={cfg.window} onChange={e => set({ window: +e.target.value })}>
              {DIGIT_WINDOWS.map(w => <option key={w} value={w}>{w}</option>)}
            </select></label>
          <label className="field"><span className="field__lbl">Min edge</span>
            <input type="number" min="0" max="0.5" step="0.01" value={cfg.minEdge}
              onChange={e => set({ minEdge: Math.max(0, +e.target.value) })} /></label>
          <label className="field"><span className="field__lbl">Min z-score</span>
            <input type="number" min="0" max="6" step="0.1" value={cfg.minZ}
              onChange={e => set({ minZ: Math.max(0, +e.target.value) })} /></label>
          <label className="field"><span className="field__lbl">Duration (ticks)</span>
            <input type="number" min="1" max="10" value={cfg.duration}
              onChange={e => set({ duration: Math.max(1, Math.min(10, +e.target.value)) })} /></label>
        </div>
        <p style={{ color: 'var(--text-mute)', fontSize: 11, marginTop: 6 }}>
          {mode.tooltip} Entries are re-measured every window and only placed when a side clears both gates.
          Deriv prices these contracts against a fair digit stream, so a measured edge is a statement about the
          recent sample — not a forecast. The trader stands aside when the sample says nothing.
        </p>

        <div className="section-title">Risk &amp; money management</div>
        <div className="risk-grid">
          <label className="field"><span className="field__lbl">{stakeLabel()}</span>
            <input type="number" min={minKes} step="0.01" value={stakeKes}
              onChange={e => setRisk({ stake: stakeFromKes(+e.target.value, currency) })} /></label>
          <label className="field"><span className="field__lbl">Take profit ({CURRENCY})</span>
            <input type="number" min="0" value={risk.takeProfit} onChange={e => setRisk({ takeProfit: +e.target.value })} /></label>
          <label className="field"><span className="field__lbl">Stop loss ({CURRENCY})</span>
            <input type="number" min="0" value={risk.stopLoss} onChange={e => setRisk({ stopLoss: +e.target.value })} /></label>
          <label className="field"><span className="field__lbl">Max trades (0 = ∞)</span>
            <input type="number" min="0" value={risk.maxTrades} onChange={e => setRisk({ maxTrades: +e.target.value })} /></label>
          <label className="field"><span className="field__lbl">Max consecutive losses</span>
            <input type="number" min="0" value={risk.maxLosses} onChange={e => setRisk({ maxLosses: +e.target.value })} /></label>
          <label className="field"><span className="field__lbl">Martingale multiplier</span>
            <input type="number" min="1.1" max="5" step="0.1" value={risk.martMult} onChange={e => setRisk({ martMult: +e.target.value })} disabled={!risk.martingale} /></label>
          <label className="field"><span className="field__lbl">Martingale steps</span>
            <input type="number" min="1" max="8" value={risk.martSteps} onChange={e => setRisk({ martSteps: +e.target.value })} disabled={!risk.martingale} /></label>
          <label className="check" style={{ alignSelf: 'end' }}>
            <input type="checkbox" checked={!!risk.martingale} onChange={e => setRisk({ martingale: e.target.checked })} />
            Martingale on loss
          </label>
        </div>
      </div>
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
