import React from 'react';
import { formatMoney } from '../lib/market.js';

const TYPE_LABEL = {
  rise_fall: 'Rise/Fall',
  digit_over: 'Digit Over',
  digit_under: 'Digit Under',
  digit_match: 'Digit Matches',
  digit_diff: 'Digit Differs',
};

export default function Positions({ positions }) {
  if (!positions.length) {
    return (
      <div className="screen">
        <div className="empty-state">
          <StandaloneClockGlyph />
          <div className="es-title">No open positions</div>
          <div className="es-body">
            You have no open positions. Your positions and contracts will appear here once you place a trade.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      {positions.map(p => (
        <div key={p.id} className="pos-card">
          <div className="pos-head">
            <div>
              <div className="pos-type">{TYPE_LABEL[p.type] ?? p.type}</div>
              <div className="pos-sym">{p.symbol} · {p.id}</div>
            </div>
            <span className={`pos-status ${p.status}`}>
              {p.status === 'open' ? 'Open' : p.status === 'won' ? 'Won' : 'Lost'}
            </span>
          </div>
          <div className="pos-grid">
            <div className="pos-cell">
              <div className="k">Stake</div>
              <div className="v">{formatMoney(p.stake)}</div>
            </div>
            <div className="pos-cell">
              <div className="k">Potential payout</div>
              <div className="v">{formatMoney(p.payout)}</div>
            </div>
            <div className="pos-cell">
              <div className="k">Entry spot</div>
              <div className="v">{p.entry}</div>
            </div>
            <div className="pos-cell">
              <div className="k">{p.status === 'open' ? 'Side' : 'Profit/Loss'}</div>
              <div className="v" style={{ color: p.pnl > 0 ? '#4bb4b3' : p.pnl < 0 ? '#ec3f3f' : undefined }}>
                {p.status === 'open' ? (p.side === 'buy' ? 'Rise' : 'Fall') : formatMoney(p.pnl || 0)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StandaloneClockGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
