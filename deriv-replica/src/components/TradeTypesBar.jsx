import React from 'react';
import { Chip } from '@deriv-com/quill-ui';
import { TRADE_TYPES } from '../lib/contracts.js';

// Deriv's horizontal trade-type selector. "View all" opens the full catalogue
// sheet (DTrader shows the popular types inline and the rest behind it).
export default function TradeTypesBar({ selectedId, onSelect, onViewAll }) {
  const popular = TRADE_TYPES.filter(t => t.popular);
  return (
    <div className="trade-types-bar">
      {popular.map(t => (
        <Chip.Selectable
          key={t.id}
          label={t.label}
          selected={t.id === selectedId}
          onClick={() => onSelect(t.id)}
        />
      ))}
      <button className="trade-types-bar__view-all" onClick={onViewAll} type="button">
        View all
      </button>
    </div>
  );
}
