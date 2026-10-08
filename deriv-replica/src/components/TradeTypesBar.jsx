import React from 'react';
import { TRADE_TYPES } from '../lib/contracts.js';

// The compact, horizontally-scrollable product strip above the chart — exactly
// how Deriv's mobile Trade tab lists trade types. "View all" opens the full
// catalogue sheet.
export default function TradeTypesBar({ type, onSelect, onViewAll }) {
  return (
    <div className="tt-bar" role="tablist">
      {TRADE_TYPES.filter(t => !t.hidden).map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={t.id === type}
          className={`tt-chip${t.id === type ? ' is-active' : ''}`}
          onClick={() => onSelect(t.id)}
          type="button"
        >
          {t.label}
        </button>
      ))}
      <button className="tt-chip tt-chip--all" onClick={onViewAll} type="button">
        View all
      </button>
    </div>
  );
}
