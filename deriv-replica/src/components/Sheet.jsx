import React from 'react';

// Shared bottom sheet used by the symbol picker, trade-type catalogue and
// stake editor. Slides up from the bottom, Deriv-style.
export default function Sheet({ title, onClose, children }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet__handle" />
        <div className="sheet__header">
          <span className="sheet__title">{title}</span>
          <button className="sheet__close" onClick={onClose} type="button" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  );
}
