import React from 'react';
import Sheet from './Sheet.jsx';

// Price-barrier editor. Deriv intraday barriers are relative to the current
// spot, entered as a signed offset ("+0.075"); we keep the sign and let the
// user dial the magnitude.
export default function BarrierSheet({ value, spot, decimals = 2, onChange, onClose }) {
  const magnitude = Math.abs(parseFloat(value) || 0.01);
  const [mag, setMag] = React.useState(magnitude.toFixed(decimals));
  const step = Math.pow(10, -decimals);

  const commit = next => {
    const m = Math.max(step, +next || step);
    setMag(m.toFixed(decimals));
    onChange(`+${m.toFixed(decimals)}`);
  };

  return (
    <Sheet title="Barrier" onClose={onClose}>
      <div className="duration-editor">
        <div className="duration-editor__hint">
          Relative offset from the current spot{spot ? ` (${spot})` : ''}. Deriv quotes intraday barriers as a signed offset.
        </div>
        <div className="duration-editor__input-row">
          <button onClick={() => commit(+mag - step * 5)} type="button">−</button>
          <input
            className="duration-editor__input"
            type="number"
            step={step}
            value={mag}
            onChange={e => setMag(e.target.value)}
            onBlur={() => commit(mag)}
          />
          <button onClick={() => commit(+mag + step * 5)} type="button">+</button>
        </div>
        <div className="duration-editor__quick">
          {[0.01, 0.05, 0.1, 0.25, 0.5, 1].map(q => (
            <button key={q} className="stake-editor__chip" onClick={() => commit(q)} type="button">
              +{q.toFixed(2)}
            </button>
          ))}
        </div>
        <button className="stake-editor__done" onClick={onClose} type="button">Done</button>
      </div>
    </Sheet>
  );
}
