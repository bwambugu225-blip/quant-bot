import React from 'react';
import { addComma } from '../lib/market.js';
import { EmptyState } from './screens.jsx';

// Deriv's Positions tab for open contracts, with a per-contract detail grid.
export default function Positions({ positions, currency = 'USD' }) {
  const open = positions.filter(p => p.status === 'open');
  if (!open.length) {
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
      {open.map(p => (
        <div key={p.id} className="position-card">
          <div className="position-card__head">
            <div>
              <div className="position-card__type">{p.sideLabel}</div>
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
              <span className="position-card__k">Potential payout</span>
              <span className="position-card__v position-card__v--green">{addComma(p.payout, 2)} {currency}</span>
            </div>
            <div className="position-card__cell">
              <span className="position-card__k">Entry spot</span>
              <span className="position-card__v">{p.entry}</span>
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
