import React from 'react';
import { formatMoney } from '../lib/market.js';

export default function Header({ balance, onDeposit }) {
  return (
    <header className="app-header">
      <span className="brand-mark">
        Deriv<span className="brand-dot">.</span>
      </span>
      <div className="header-right">
        <div className="account-chip">
          <span className="avatar">VR</span>
          <span className="acct-type">Demo</span>
        </div>
        <div className="balance-group">
          <span className="bal">{formatMoney(balance)}</span>
          <span className="ccy">USD</span>
        </div>
        <button className="deposit-btn" onClick={onDeposit}>Deposit</button>
      </div>
    </header>
  );
}
