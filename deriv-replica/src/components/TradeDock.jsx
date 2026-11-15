import React from 'react';
import { TRADE_TYPES, findTradeType } from '../lib/contracts.js';
import { addComma } from '../lib/format.js';

const UNITS = [['t', 'Ticks'], ['s', 'Seconds'], ['m', 'Minutes'], ['h', 'Hours']];

// Manual trade placement. The same proposal path the bot uses, driven by hand.
export default function TradeDock({ auth, onLogin, onTrade, symbol, price, payout }) {
  const [type, setType] = React.useState('rise_fall');
  const [side, setSide] = React.useState('up');
  const [stake, setStake] = React.useState(1);
  const [duration, setDuration] = React.useState(5);
  const [unit, setUnit] = React.useState('t');
  const [digit, setDigit] = React.useState(5);

  const t = findTradeType(type);
  const hasDuration = t.inputs.includes('duration');
  const hasDigit = t.inputs.includes('digit');

  React.useEffect(() => {
    if (!t.durationUnits.includes(unit)) setUnit(t.durationUnits[0] || 't');
  }, [t, unit]);

  const value = { stake, duration, unit, digit, barrier: '+0.10', barrier2: '-0.10', equals: false, multiplier: 100, selectedTick: 1 };
  const place = s => {
    if (!auth) { onLogin(); return; }
    onTrade(type, s, value);
  };

  return (
    <div className="form">
      <div>
        <div className="form__lbl">Contract type</div>
        <select className="sel" style={{ width: '100%', marginTop: 4 }} value={type}
          onChange={e => { setType(e.target.value); setSide('up'); }}>
          {TRADE_TYPES.map(tt => <option key={tt.id} value={tt.id}>{tt.label}</option>)}
        </select>
      </div>

      <div>
        <div className="form__lbl">Direction</div>
        <div className="seg" style={{ marginTop: 4 }}>
          <button className={side === 'up' ? 'is-active' : ''} onClick={() => setSide('up')} type="button">{t.sides[0]}</button>
          <button className={side === 'down' ? 'is-active' : ''} onClick={() => setSide('down')} type="button">{t.sides[1]}</button>
        </div>
      </div>

      {hasDigit && (
        <div>
          <div className="form__lbl">Last digit</div>
          <div className="seg" style={{ marginTop: 4 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
              <button key={d} className={digit === d ? 'is-active' : ''} onClick={() => setDigit(d)} type="button" style={{ minWidth: 26 }}>{d}</button>
            ))}
          </div>
        </div>
      )}

      {hasDuration && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <label className="field"><span className="field__lbl">Duration</span>
            <input type="number" min="1" value={duration} onChange={e => setDuration(+e.target.value)} /></label>
          <label className="field"><span className="field__lbl">Unit</span>
            <select value={unit} onChange={e => setUnit(e.target.value)}>
              {UNITS.filter(([u]) => t.durationUnits.includes(u)).map(([u, l]) => <option key={u} value={u}>{l}</option>)}
            </select></label>
        </div>
      )}

      <label className="field"><span className="field__lbl">Stake (USD)</span>
        <input type="number" min="0.35" step="0.01" value={stake} onChange={e => setStake(+e.target.value)} /></label>

      <div className="payout"><span>Market</span><b>{symbol}</b></div>
      <div className="payout"><span>Spot</span><b>{price != null ? price.toFixed(4) : '—'}</b></div>
      <div className="payout"><span>Est. payout</span><b>{payout != null ? `${addComma(payout)} USD` : '—'}</b></div>

      <div className="trade-btns">
        <button className="btn btn--up" onClick={() => place('up')} type="button">{t.sides[0]}</button>
        <button className="btn btn--down" onClick={() => place('down')} type="button">{t.sides[1]}</button>
      </div>
      <p style={{ color: 'var(--text-mute)', fontSize: 11, margin: 0 }}>{t.tooltip}</p>
    </div>
  );
}
