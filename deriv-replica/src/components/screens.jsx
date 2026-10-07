import React from 'react';

// Tab screens and the control panels for the live engine. Kept in one module so
// the simple, stateless screens don't clutter the component tree.

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

export function LoginScreen({ onSubmit, onClose }) {
  const [token, setToken] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = async e => {
    e.preventDefault();
    if (!token.trim()) { setError('Paste an API token from app.deriv.com/account/api-token'); return; }
    setBusy(true); setError('');
    try {
      await onSubmit(token);
    } catch (err) {
      setError(err?.message || 'Login failed — check your token');
      setBusy(false);
    }
  };

  return (
    <form className="login-form" onSubmit={submit}>
      <p className="login-form__hint">
        Paste a Deriv API token (with Read + Trade scope) to connect your account. Market
        data streams without logging in; trading requires a token.
      </p>
      <input
        className="login-form__input"
        type="password"
        placeholder="Deriv API token"
        value={token}
        onChange={e => setToken(e.target.value)}
        disabled={busy}
        autoFocus
      />
      {error && <div className="login-form__error">{error}</div>}
      <button className="login-form__submit" type="submit" disabled={busy}>
        {busy ? 'Connecting…' : 'Log in'}
      </button>
      <button className="login-form__cancel" type="button" onClick={onClose}>Cancel</button>
    </form>
  );
}

// Compact engine control strip. Shown under Menu (kept off the trading page).
export function EngineControls({ state, engine, onLogin }) {
  const running = !!state?.running;
  const auth = !!state?.auth;
  const isDigit = engine.tradeMode === 'DIGITS';
  const stake = isDigit ? state?.dgStake ?? 1 : state?.rfStake ?? 1;

  return (
    <div className="engine-panel">
      <div className="engine-panel__row">
        <span className={`engine-dot${auth ? ' is-on' : ''}`} />
        <span className="engine-panel__status">
          {auth ? `${state.accountId} · ${state.accountType.toUpperCase()}` : 'Not connected'}
        </span>
        {!auth && <button className="engine-panel__login" onClick={onLogin} type="button">Log in</button>}
      </div>

      <div className="engine-panel__row engine-panel__row--controls">
        <div className="engine-stake">
          <span className="engine-stake__label">Stake</span>
          <button onClick={() => engine.setStake(isDigit ? 'dg' : 'rf', stake - 1)} type="button">−</button>
          <span className="engine-stake__value">{stake.toFixed(2)}</span>
          <button onClick={() => engine.setStake(isDigit ? 'dg' : 'rf', stake + 1)} type="button">+</button>
        </div>
        <button
          className={`engine-run${running ? ' is-running' : ''}`}
          onClick={() => (running ? engine.stop() : engine.start())}
          type="button"
        >
          {running ? 'STOP AUTO' : 'START AUTO'}
        </button>
      </div>

      <div className="engine-stats">
        <Stat label="Mode" value={state?.tradeMode || 'RISEFALL'} />
        <Stat label="Trades" value={state?.trades ?? 0} />
        <Stat label="Wins" value={state?.wins ?? 0} />
        <Stat label="Losses" value={state?.losses ?? 0} />
        <Stat label="P/L" value={`${(state?.pnl ?? 0) >= 0 ? '+' : ''}${(state?.pnl ?? 0).toFixed(2)}`} tone={(state?.pnl ?? 0) >= 0 ? 'win' : 'loss'} />
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className="engine-stat">
      <span className="engine-stat__label">{label}</span>
      <span className={`engine-stat__value${tone ? ` is-${tone}` : ''}`}>{value}</span>
    </div>
  );
}

export function LogConsole({ logs }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);
  return (
    <div className="log-console" ref={ref}>
      {logs.length === 0 && <div className="log-console__empty">No activity yet.</div>}
      {logs.map((l, i) => (
        <div key={i} className={`log-line log-line--${l.k || 'i'}`}>
          <span className="log-line__time">{new Date(l.at).toLocaleTimeString()}</span>
          <span className="log-line__msg">{l.t}</span>
        </div>
      ))}
    </div>
  );
}

export function Reports({ reports, currency = 'USD' }) {
  if (!reports.length) {
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
      {reports.map(p => (
        <div key={p.id} className="report-row">
          <div>
            <div className="report-row__type">{p.action} · {p.strategy}</div>
            <div className="report-row__sub">{p.symbol} · {p.time}</div>
          </div>
          <div className="report-row__right">
            <span className="report-row__stake">{Number(p.stake || 0).toFixed(2)} {currency}</span>
            <span className={`report-row__pnl ${p.profit >= 0 ? 'is-win' : 'is-loss'}`}>
              {p.profit >= 0 ? '+' : ''}{p.profit.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MenuScreen({ engine, state, onLogin, onToast }) {
  const [mode, setMode] = React.useState(engine.tradeMode);
  const [mart, setMart] = React.useState(engine.martingale.enabled);
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

      <div className="menu-section">
        <div className="menu-section__title">Trading engine</div>
        <EngineControls state={state} engine={engine} onLogin={onLogin} />
        <div className="menu-toggle">
          <span>Mode</span>
          <div className="menu-seg">
            {['RISEFALL', 'DIGITS'].map(m => (
              <button
                key={m}
                className={`menu-seg__btn${mode === m ? ' is-active' : ''}`}
                onClick={() => { setMode(m); engine.setMode(m); }}
                type="button"
              >
                {m === 'RISEFALL' ? 'Rise/Fall' : 'Digits'}
              </button>
            ))}
          </div>
        </div>
        <label className="menu-toggle">
          <span>Martingale</span>
          <input
            type="checkbox"
            checked={mart}
            onChange={e => { setMart(e.target.checked); engine.setMartingale({ enabled: e.target.checked }); }}
          />
        </label>
      </div>

      {rows.map(([label, sub2]) => (
        <button key={label} className="menu-row" onClick={() => onToast(`${label} is disabled in this build`)} type="button">
          <span>
            <span className="menu-row__title">{label}</span>
            <span className="menu-row__sub">{sub2}</span>
          </span>
          <span className="menu-row__chevron">›</span>
        </button>
      ))}
    </div>
  );
}

export function AccountScreen({ state, logs, onLogin, onLogout, onSwitch }) {
  const accounts = state?.accounts || [];
  return (
    <div className="screen">
      <div className="screen__title">My account</div>
      <div className="account-card">
        <div>
          <div className="account-card__type">
            {state?.auth ? `${state.accountId} · ${state.accountType}` : 'Not connected'}
          </div>
          <div className="account-card__balance">{(state?.balance ?? 0).toFixed(2)} USD</div>
        </div>
      </div>

      {accounts.length > 1 && (
        <>
          <div className="screen__section-title">Switch account</div>
          {accounts.map(a => {
            const isDemo = a.account.startsWith('VR') || a.isDemo;
            const active = a.account === state?.accountId;
            return (
              <button
                key={a.account}
                className={`menu-row${active ? ' is-active' : ''}`}
                onClick={() => !active && onSwitch(a.account)}
                type="button"
              >
                <span>
                  <span className="menu-row__title">{isDemo ? 'Demo' : 'Real'} · {a.account}</span>
                  <span className="menu-row__sub">{(a.balance ?? 0).toFixed(2)} {a.currency || 'USD'}</span>
                </span>
                <span className="menu-row__chevron">{active ? '●' : '›'}</span>
              </button>
            );
          })}
        </>
      )}

      {state?.auth ? (
        <button className="menu-row" onClick={onLogout} type="button">
          <span>
            <span className="menu-row__title">Log out</span>
            <span className="menu-row__sub">Close the Deriv connection</span>
          </span>
          <span className="menu-row__chevron">›</span>
        </button>
      ) : (
        <button className="menu-row" onClick={onLogin} type="button">
          <span>
            <span className="menu-row__title">Log in</span>
            <span className="menu-row__sub">Connect with a Deriv API token</span>
          </span>
          <span className="menu-row__chevron">›</span>
        </button>
      )}

      <div className="screen__section-title">Console</div>
      <LogConsole logs={logs} />
      <div className="screen__footnote">Interface replica · not affiliated with Deriv</div>
    </div>
  );
}
