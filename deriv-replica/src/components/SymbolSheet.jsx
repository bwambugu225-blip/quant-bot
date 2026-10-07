import React from 'react';

export default function SymbolSheet({ symbols, current, onSelect, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Underlying asset</div>
        {symbols.map((s, i) => (
          <div
            key={s.symbol}
            className={`sheet-row${i === current ? ' selected' : ''}`}
            onClick={() => onSelect(i)}
          >
            <span>{s.display}</span>
            <span className="sub">{s.symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
