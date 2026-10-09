import React from 'react';
import { TRADE_TYPES } from '../lib/contracts.js';

// The compact product strip above the chart — exactly how Deriv's mobile
// Trade tab lists the popular trade types. Each contract carries its own bot
// button (the small robot) so the whole suite can be traded automatically
// without leaving the strip; "View all" opens the full catalogue sheet.
function BotIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M8 1.2a.9.9 0 0 1 .9.9v.6h1.35A2.75 2.75 0 0 1 13 5.45v3.1A2.75 2.75 0 0 1 10.25 11.3h-4.5A2.75 2.75 0 0 1 3 8.55v-3.1A2.75 2.75 0 0 1 5.75 2.7H7.1v-.6a.9.9 0 0 1 .9-.9Zm-2.4 4.9a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Zm4.8 0a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1ZM6.1 12.6h3.8a.7.7 0 0 1 0 1.4H6.1a.7.7 0 0 1 0-1.4Z" />
    </svg>
  );
}

export default function TradeTypesBar({ type, onSelect, onViewAll, onBot, botType }) {
  const visible = TRADE_TYPES.filter(t => !t.hidden && t.popular);
  return (
    <div className="tt-bar" role="tablist">
      {visible.map(t => (
        <div key={t.id} className={`tt-item${t.id === type ? ' is-active' : ''}`}>
          <button
            role="tab"
            aria-selected={t.id === type}
            className={`tt-chip${t.id === type ? ' is-active' : ''}`}
            onClick={() => onSelect(t.id)}
            type="button"
          >
            {t.label}
          </button>
          <button
            className={`tt-bot${t.id === botType ? ' is-on' : ''}`}
            onClick={() => onBot(t.id)}
            type="button"
            aria-label={`Automate ${t.label}`}
            title={t.id === botType ? 'Stop auto-trading' : `Auto-trade ${t.label}`}
          >
            <BotIcon />
          </button>
        </div>
      ))}
      <button className="tt-chip tt-chip--all" onClick={onViewAll} type="button">
        View all
      </button>
    </div>
  );
}
