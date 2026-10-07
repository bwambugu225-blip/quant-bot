import React from 'react';
import { LegacyChevronDown1pxIcon } from '@deriv/quill-icons';
import { decimalsFor } from '../lib/marketStore.js';

// Deriv's market selector row: asset icon, asset name with a chevron, and the
// live price which tints green/red on the tick direction.
export default function MarketSelector({ display, price, up, onOpen }) {
  const decimals = decimalsFor(price);
  return (
    <button className="market-selector" onClick={onOpen} type="button">
      <span className="market-selector__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M2 12.5 6 8l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="market-selector__info">
        <span className="market-selector__label">
          {display}
          <LegacyChevronDown1pxIcon fill="currentColor" iconSize="xs" />
        </span>
        <span className="market-selector__price" style={{ color: up ? 'var(--buy)' : 'var(--sell)' }}>
          {Number(price || 0).toFixed(decimals)}
        </span>
      </span>
    </button>
  );
}
