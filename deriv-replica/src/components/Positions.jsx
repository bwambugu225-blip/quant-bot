import React from 'react';
import { addComma } from '../lib/format.js';
import { EmptyState } from './screens.jsx';

// Deriv's Positions tab for open contracts, with a per-contract detail grid.
export default function Positions({ positions, currency = 'USD' }) {
  if (!positions.length) {
    return (
      <EmptyState
        title="No open positions"
        body="You have no open positions. Your positions and contracts will appear here once you place a trade."
      />
    );
  }

  return (
    <div className="screen">
      <div className="screen__title">Open positions</div>
      {positions.map(p => (
        <div key={p.id} className="position-card">
          <div className="position-card__head">
            <div>
              <div className="position-card__type">{p.sideLabel || p.contractType}</div>
              <div className="position-card__sym">{p.symbol}</div>
            </div>
            <span className="position-card__status position-card__status--open">Open</span>
          </div>
          <div className="position-card__grid">
            <div className="position-card__cell">
              <span className="position-card__k">Stake</span>
              <span className="position-card__v">{addComma(p.stake, 2)} {currency}</span>
            </div>
            <div className="position-card__cell">
              <span className="position-card__k">Entry spot</span>
              <span className="position-card__v">{p.entry ?? '—'}</span>
            </div>
            <div className="position-card__cell">
              <span className="position-card__k">Contract ID</span>
              <span className="position-card__v">{p.id}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
