import React from 'react';

// Tab screens for the replica. Kept in one module so the simple, stateless
// screens don't clutter the component tree.

export function EmptyState({ title, body }) {
  return (
    <div className="screen screen--centered">
      <div className="screen__empty-icon" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="10" y="16" width="44" height="32" rx="6" stroke="var(--text-disabled)" strokeWidth="2" />
          <path d="M18 40l8-9 6 6 8-11 6 7" stroke="var(--text-disabled)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="screen__empty-title">{title}</div>
      <p className="screen__empty-body">{body}</p>
    </div>
  );
}

export function Reports({ positions, currency = 'USD' }) {
  const settled = positions.filter(p => p.status !== 'open');
  if (!settled.length) {
    return (
      <EmptyState
        title="No reports yet"
        body="Your settled contracts will appear here once a trade has been resolved."
      />
    );
  }
  return (
    <div className="screen">
      <div className="screen__title">Reports</div>
      {settled.map(p => (
        <div key={p.id} className="report-row">
          <div>
            <div className="report-row__type">{p.sideLabel}</div>
            <div className="report-row__sub">{p.symbol}</div>
          </div>
          <div className="report-row__right">
            <span className="report-row__stake">{p.stake.toFixed(2)} {currency}</span>
            <span className={`report-row__pnl ${p.pnl >= 0 ? 'is-win' : 'is-loss'}`}>
              {p.pnl >= 0 ? '+' : ''}{p.pnl.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MenuScreen({ onToast }) {
  const rows = [
    ['Deposit', 'Add funds to your account'],
    ['Withdrawal', 'Withdraw available funds'],
    ['Account settings', 'Personal details and security'],
    ['Language', 'English'],
    ['About us', 'Learn more about Deriv'],
  ];
  return (
    <div className="screen">
      <div className="screen__title">Menu</div>
      {rows.map(([label, sub]) => (
        <button
          key={label}
          className="menu-row"
          onClick={() => onToast(`${label} is disabled in this demo`)}
          type="button"
        >
          <span>
            <span className="menu-row__title">{label}</span>
            <span className="menu-row__sub">{sub}</span>
          </span>
          <span className="menu-row__chevron">›</span>
        </button>
      ))}
    </div>
  );
}

export function AccountScreen({ balance, currency = 'USD', onToast }) {
  return (
    <div className="screen">
      <div className="screen__title">My account</div>
      <div className="account-card">
        <div>
          <div className="account-card__type">Demo account</div>
          <div className="account-card__balance">{balance.toFixed(2)} {currency}</div>
        </div>
      </div>
      <button className="menu-row" onClick={() => onToast('Account switching is disabled in this demo')} type="button">
        <span>
          <span className="menu-row__title">Switch account</span>
          <span className="menu-row__sub">Move between Demo and Real</span>
        </span>
        <span className="menu-row__chevron">›</span>
      </button>
      <button className="menu-row" onClick={() => onToast('API token management is disabled in this demo')} type="button">
        <span>
          <span className="menu-row__title">API token</span>
          <span className="menu-row__sub">Manage your Deriv API access</span>
        </span>
        <span className="menu-row__chevron">›</span>
      </button>
      <div className="screen__footnote">Interface replica · not affiliated with Deriv</div>
    </div>
  );
}
