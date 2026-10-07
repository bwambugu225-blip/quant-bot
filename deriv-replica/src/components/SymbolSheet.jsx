import React from 'react';
import Sheet from './Sheet.jsx';

// Deriv's underlying-asset picker, grouped by asset class.
export default function SymbolSheet({ symbols, current, onSelect, onClose }) {
  const groups = symbols.reduce((acc, s) => {
    const g = s.display.split(' ')[0];
    (acc[g] = acc[g] || []).push(s);
    return acc;
  }, {});

  return (
    <Sheet title="Underlying asset" onClose={onClose}>
      {Object.entries(groups).map(([group, list]) => (
        <div key={group}>
          <div className="symbol-group__title">{group}</div>
          {list.map(s => {
            const idx = symbols.indexOf(s);
            return (
              <button
                key={s.symbol}
                className={`symbol-row${idx === current ? ' is-selected' : ''}`}
                onClick={() => onSelect(idx)}
                type="button"
              >
                <span className="symbol-row__name">{s.display}</span>
                <span className="symbol-row__code">{s.symbol}</span>
              </button>
            );
          })}
        </div>
      ))}
    </Sheet>
  );
}
