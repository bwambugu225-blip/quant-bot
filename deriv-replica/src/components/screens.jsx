import React from 'react';
import { SYMBOLS, isDigitSymbol } from '../lib/marketStore.js';

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

function Stat({ label, value, tone }) {
  return (
    <div className="engine-stat">
      <span className="engine-stat__label">{label}</span>
      <span className={`engine-stat__value${tone ? ` is-${tone}` : ''}`}>{value}</span>
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

function Stepper({ label, value, step = 1, min, max, onChange, decimals = 2, suffix = '' }) {
  const clamp = v => Math.max(min, Math.min(max, +v || 0));
  return (
    <div className="engine-stake">
      <span className="engine-stake__label">{label}</span>
      <button onClick={() => onChange(clamp(value - step))} type="button">−</button>
      <span className="engine-stake__value">{value.toFixed(decimals)}{suffix}</span>
      <button onClick={() => onChange(clamp(value + step))} type="button">+</button>
    </div>
  );
}

// The Automate tab: every automation and trade setting lives here. It is the
// only place the auto-engine, mode, market, martingale and risk limits are
// exposed. Nothing trades until the user presses Start on the selected market.
export function AutomateScreen({ engine, state, onLogin }) {
  const auth = !!state?.auth;
  const running = !!state?.running;
  const mode = state?.tradeMode || 'RISEFALL';
  const isDigit = mode === 'DIGITS';
  const stake = isDigit ? state?.dgStake ?? 1 : state?.rfStake ?? 1;
  const wins = state?.wins ?? 0;
  const losses = state?.losses ?? 0;
  const trades = state?.trades ?? 0;
  const winRate = trades ? Math.round((wins / trades) * 100) : 0;
  const autoMarket = state?.autoMarket || SYMBOLS[0].sym;
  const market = SYMBOLS.find(s => s.sym === autoMarket) || SYMBOLS[0];
  const digitCapable = isDigitSymbol(autoMarket);
  const mart = state?.martingale || {};
  const started = state?.sessionStart;

  const chooseMarket = sym => engine.setMarket(sym);

  return (
    <div className="screen">
      <div className="screen__title">Automate</div>

      {!auth && (
        <div className="automate-banner">
          <span>Log in to run the auto-engine and place trades.</span>
          <button onClick={onLogin} type="button">Log in</button>
        </div>
      )}

      {/* ── Session control ─────────────────────────────────────────── */}
      <div className="menu-section">
        <div className="menu-section__title">Session</div>
        <button
          className={`engine-run${running ? ' is-running' : ''}`}
          onClick={() => (running ? engine.stop() : engine.start())}
          type="button"
          disabled={!auth}
        >
          {running ? '■  STOP AUTO' : '▶  START AUTO'}
        </button>
        <div className="engine-run__meta">
          <span className={`engine-run__dot${running ? ' is-on' : ''}`} />
          {running
            ? `Running on ${market.name}${started ? ` · ${Math.max(0, Math.round((Date.now() - started) / 60000))}m` : ''}`
            : 'Idle — no automated trades'}
        </div>

        <div className="engine-stats">
          <Stat label="Trades" value={trades} />
          <Stat label="Wins" value={wins} />
          <Stat label="Losses" value={losses} />
          <Stat label="Win rate" value={`${winRate}%`} />
          <Stat
            label="P/L"
            value={`${(state?.pnl ?? 0) >= 0 ? '+' : ''}${(state?.pnl ?? 0).toFixed(2)}`}
            tone={(state?.pnl ?? 0) >= 0 ? 'win' : 'loss'}
          />
          <Stat label="Streak" value={state?.consLoss ? `-${state.consLoss}` : '0'} tone={state?.consLoss ? 'loss' : undefined} />
          <Stat label="Best" value={`+${(state?.bestTrade ?? 0).toFixed(2)}`} tone="win" />
          <Stat label="Worst" value={`${(state?.worstTrade ?? 0).toFixed(2)}`} tone="loss" />
        </div>

        <button className="automate-reset" onClick={() => engine.resetSession()} type="button">
          Reset session stats
        </button>
      </div>

      {/* ── Market + strategy ───────────────────────────────────────── */}
      <div className="menu-section">
        <div className="menu-section__title">Market</div>
        <div className="automate-market">
          <div className="automate-market__current">
            <span className="automate-market__name">{market.name}</span>
            <span className="automate-market__sym">{market.sym} · {market.cat}</span>
          </div>
        </div>
        <div className="automate-market__grid">
          {SYMBOLS.map(s => {
            const disabled = isDigit && !isDigitSymbol(s.sym);
            return (
              <button
                key={s.sym}
                className={`automate-market__chip${s.sym === autoMarket ? ' is-active' : ''}`}
                onClick={() => !disabled && chooseMarket(s.sym)}
                disabled={disabled}
                title={disabled ? 'Digits need a Volatility index' : s.name}
                type="button"
              >
                {s.sym}
              </button>
            );
          })}
        </div>
        {isDigit && !digitCapable && (
          <div className="automate-note">Digits require a Volatility index — pick one above.</div>
        )}

        <div className="menu-section__title" style={{ marginTop: 14 }}>Strategy</div>
        <div className="menu-toggle">
          <span>Mode</span>
          <div className="menu-seg">
            {['RISEFALL', 'DIGITS'].map(m => (
              <button
                key={m}
                className={`menu-seg__btn${mode === m ? ' is-active' : ''}`}
                onClick={() => engine.setMode(m)}
                type="button"
                disabled={m === 'DIGITS' && !digitCapable}
              >
                {m === 'RISEFALL' ? 'Rise/Fall' : 'Digits'}
              </button>
            ))}
          </div>
        </div>

        <Stepper
          label={isDigit ? 'Digit stake' : 'Rise/Fall stake'}
          value={stake}
          min={0.35}
          max={200}
          onChange={v => engine.setStake(isDigit ? 'dg' : 'rf', v)}
        />

        <Stepper
          label="Min confidence"
          value={state?.minConfidence ?? 0}
          step={5}
          min={0}
          max={95}
          decimals={0}
          suffix="%"
          onChange={v => engine.setAutomation({ minConfidence: v })}
        />
        <div className="automate-note">Rise/Fall signals below this confidence are skipped.</div>

        <label className="menu-toggle">
          <span>Kelly sizing (Rise/Fall)</span>
          <input
            type="checkbox"
            checked={!!state?.useKelly}
            onChange={e => engine.setAutomation({ useKelly: e.target.checked })}
          />
        </label>
      </div>

      {/* ── Risk management ─────────────────────────────────────────── */}
      <div className="menu-section">
        <div className="menu-section__title">Risk management</div>

        <label className="menu-toggle">
          <span>Martingale</span>
          <input
            type="checkbox"
            checked={!!mart.enabled}
            onChange={e => engine.setMartingale({ enabled: e.target.checked, baseStake: stake })}
          />
        </label>
        {mart.enabled && (
          <>
            <Stepper
              label="Multiplier"
              value={mart.mult ?? 2}
              step={0.5}
              min={1.1}
              max={5}
              onChange={v => engine.setMartingale({ mult: v })}
            />
            <Stepper
              label="Max steps"
              value={mart.maxSteps ?? 6}
              step={1}
              min={1}
              max={12}
              decimals={0}
              onChange={v => engine.setMartingale({ maxSteps: v })}
            />
          </>
        )}

        <Stepper
          label="Take profit"
          value={state?.takeProfit ?? 0}
          step={1}
          min={0}
          max={10000}
          onChange={v => engine.setLimits({ takeProfit: v })}
        />
        <Stepper
          label="Stop loss"
          value={state?.stopLoss ?? 0}
          step={1}
          min={0}
          max={10000}
          onChange={v => engine.setLimits({ stopLoss: v })}
        />
        <Stepper
          label="Max consecutive losses"
          value={state?.maxConsecutiveLosses ?? 8}
          step={1}
          min={0}
          max={50}
          decimals={0}
          onChange={v => engine.setAutomation({ maxConsecutiveLosses: v })}
        />
        <Stepper
          label="Max trades this session"
          value={state?.maxTrades ?? 0}
          step={5}
          min={0}
          max={500}
          decimals={0}
          onChange={v => engine.setAutomation({ maxTrades: v })}
        />
        <div className="automate-note">0 = unlimited. Take profit, stop loss and the trade cap stop the engine automatically.</div>
      </div>
    </div>
  );
}

// Minimal Menu tab: the account essentials plus the usual Deriv menu rows.
export function MenuScreen({ state, onLogin, onLogout, onSwitch, onToast }) {
  const accounts = state?.accounts || [];
  return (
    <div className="screen">
      <div className="screen__title">Menu</div>

      <div className="account-card">
        <div>
          <div className="account-card__type">
            {state?.auth
              ? `${state.accountId} · ${state.accountType === 'real' ? 'Real' : 'Demo'}`
              : 'Not connected'}
          </div>
          <div className="account-card__balance">
            {(state?.balance ?? 0).toFixed(2)} USD
          </div>
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

      {[
        ['Deposit', 'Add funds to your account'],
        ['Withdrawal', 'Withdraw available funds'],
        ['Language', 'English'],
        ['About us', 'Learn more about Deriv'],
      ].map(([label, sub]) => (
        <button key={label} className="menu-row" onClick={() => onToast(`${label} is disabled in this build`)} type="button">
          <span>
            <span className="menu-row__title">{label}</span>
            <span className="menu-row__sub">{sub}</span>
          </span>
          <span className="menu-row__chevron">›</span>
        </button>
      ))}

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

      <div className="screen__footnote">Interface replica · not affiliated with Deriv</div>
    </div>
  );
}
