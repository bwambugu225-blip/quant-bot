import React from 'react';
import Sheet from './Sheet.jsx';

// Generic numeric bottom sheet — stake, multiplier, growth rate and the
// take-profit / stop-loss controls all share this.
export default function NumberSheet({
  title, value, min = 0, max = 100000, step = 1, decimals = 2,
  quick = [], prefix = '', suffix = '', onChange, onClose,
}) {
  const clamp = v => Math.max(min, Math.min(max, +v || 0));
  const [v, setV] = React.useState(value);

  const commit = next => { const c = clamp(next); setV(c); onChange(c); };

  return (
    <Sheet title={title} onClose={onClose}>
      <div className="duration-editor">
        <div className="duration-editor__input-row">
          <button onClick={() => commit(v - step)} type="button">−</button>
          <input
            className="duration-editor__input"
            type="number"
            value={v}
            min={min}
            max={max}
            step={step}
            onChange={e => setV(e.target.value)}
            onBlur={() => commit(v)}
          />
          <button onClick={() => commit(+v + step)} type="button">+</button>
        </div>
        <div className="duration-editor__hint">Allowed range: {prefix}{min}–{prefix}{max}{suffix}</div>

        {quick.length > 0 && (
          <div className="duration-editor__quick">
            {quick.map(q => (
              <button key={q} className="stake-editor__chip" onClick={() => commit(q)} type="button">
                {prefix}{q}{suffix}
              </button>
            ))}
          </div>
        )}

        <button className="stake-editor__done" onClick={onClose} type="button">Done</button>
      </div>
    </Sheet>
  );
}
