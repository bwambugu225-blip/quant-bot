import React from 'react';
import Sheet from './Sheet.jsx';

const GROUP_LABELS = { VOL: 'Volatility Indices', VOL1S: 'Volatility 1s Indices', STEP: 'Step Index', TREND: 'Bull/Bear' };

// Deriv's underlying-asset picker, grouped by asset class.
export default function SymbolSheet({ symbols, current, onSelect, onClose }) {
  const groups = symbols.reduce((acc, s) => {
    (acc[s.cat] = acc[s.cat] || []).push(s);
    return acc;
  }, {});

  return (
    <Sheet title="Underlying asset" onClose={onClose}>
      {Object.entries(groups).map(([group, list]) => (
        <div key={group}>
          <div className="symbol-group__title">{GROUP_LABELS[group] || group}</div>
          {list.map(s => {
            const idx = symbols.indexOf(s);
            return (
              <button
                key={s.sym}
                className={`symbol-row${idx === current ? ' is-selected' : ''}`}
                onClick={() => onSelect(idx)}
                type="button"
              >
                <span className="symbol-row__name">{s.name}</span>
                <span className="symbol-row__code">{s.sym}</span>
              </button>
            );
          })}
        </div>
      ))}
    </Sheet>
  );
}
