import React from 'react';
import Sheet from './Sheet.jsx';

// Duration bounds per unit. Ticks are capped at 10 for synthetic Rise/Fall;
// the time-based units follow Deriv's intraday limits.
const BOUNDS = {
  t: [1, 10],
  s: [15, 86400],
  m: [1, 1440],
  h: [1, 24],
  d: [1, 365],
};
const QUICK = {
  t: [1, 2, 3, 5, 10],
  s: [15, 30, 60, 120, 300],
  m: [1, 2, 3, 5, 10],
  h: [1, 2, 4, 8, 12],
  d: [1, 2, 3, 7, 30],
};
const UNITS = { t: 'Ticks', s: 'Seconds', m: 'Minutes', h: 'Hours', d: 'Days' };

export default function DurationSheet({ duration, unit, allowed, onChange, onClose }) {
  const units = allowed && allowed.length ? allowed : ['t', 's', 'm', 'h', 'd'];
  const [u, setU] = React.useState(units.includes(unit) ? unit : units[0]);
  const [value, setValue] = React.useState(duration);
  const [lo, hi] = BOUNDS[u] || BOUNDS.t;

  const commit = (nextU = u, nextValue = value) => {
    const [a, b] = BOUNDS[nextU] || BOUNDS.t;
    const clamped = Math.max(a, Math.min(b, Math.round(+nextValue) || a));
    onChange(clamped, nextU);
    setValue(clamped);
    setU(nextU);
  };

  return (
    <Sheet title="Duration" onClose={onClose}>
      <div className="duration-editor">
        {units.length > 1 && (
          <div className="duration-editor__units">
            {units.map(x => (
              <button
                key={x}
                className={`duration-editor__unit${u === x ? ' is-active' : ''}`}
                onClick={() => commit(x, QUICK[x] ? QUICK[x][0] : 1)}
                type="button"
              >
                {UNITS[x] || x}
              </button>
            ))}
          </div>
        )}

        <div className="duration-editor__input-row">
          <button onClick={() => commit(u, value - 1)} type="button">−</button>
          <input
            className="duration-editor__input"
            type="number"
            value={value}
            min={lo}
            max={hi}
            onChange={e => setValue(e.target.value)}
            onBlur={() => commit()}
          />
          <button onClick={() => commit(u, +value + 1)} type="button">+</button>
        </div>
        <div className="duration-editor__hint">Allowed range: {lo}–{hi} {(UNITS[u] || '').toLowerCase()}</div>

        <div className="duration-editor__quick">
          {(QUICK[u] || [1, 2, 5, 10]).map(v => (
            <button key={v} className="stake-editor__chip" onClick={() => commit(u, v)} type="button">
              {v}
            </button>
          ))}
        </div>

        <button className="stake-editor__done" onClick={onClose} type="button">Done</button>
      </div>
    </Sheet>
  );
}
