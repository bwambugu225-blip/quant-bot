import React from 'react';
import { SYMBOLS, isDigitSymbol } from '../lib/marketStore.js';
import { AUTO_FAMILIES, DIGIT_PRODUCTS, findAutoContract, contractsForFamily, ACCURACY_LEVELS } from '../lib/autoStrategies.js';

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

function Stepper({ label, value, step = 1, min, max, onChange, decimals = 2, suffix = '', compact = false }) {
  const clamp = v => Math.max(min, Math.min(max, +v || 0));
  return (
    <div className={`engine-stake${compact ? ' engine-stake--compact' : ''}`}>
      <span className="engine-stake__label">{label}</span>
      <button onClick={() => onChange(clamp(value - step))} type="button">−</button>
      <span className="engine-stake__value">{value.toFixed(decimals)}{suffix}</span>
      <button onClick={() => onChange(clamp(value + step))} type="button">+</button>
    </div>
  );
}

// The Automate tab. Automation is pinned to one contract; the contract decides
// the strategy, and the strategy picks its own duration/barrier/digit defaults.
// Only the two decisions that actually change the outcome are on screen: how
// much to stake and how strict to be. Everything else lives under Advanced.
export function AutomateScreen({ engine, state, onLogin }) {
  const auth = !!state?.auth;
  const running = !!state?.running;
  const contractKey = state?.autoContractKey || 'CALL';
  const entry = findAutoContract(contractKey);
  const p = state?.params || {};
  const universal = !!state?.universal;
  const minConf = state?.universalMinConf ?? 80;
  const uni = state?.universalScan || [];
  const up = state?.universalParams || {};
  const uniMarkets = state?.universalSymbols || SYMBOLS.map(s => s.sym);
  const uniPreferred = state?.universalMarkets || null;
  const autoMarket = state?.autoMarket || SYMBOLS[0].sym;
  const market = SYMBOLS.find(s => s.sym === autoMarket) || SYMBOLS[0];

  const [family, setFamily] = React.useState(entry.family);
  const [product, setProduct] = React.useState(
    entry.kind === 'match' || entry.kind === 'diff' ? 'match_diff'
      : entry.kind === 'even' || entry.kind === 'odd' ? 'even_odd'
        : 'over_under'
  );
  const [barrier, setBarrier] = React.useState(
    entry.kind === 'over' || entry.kind === 'under' || entry.kind === 'match' || entry.kind === 'diff'
      ? entry.barrier : 3
  );
  const [advanced, setAdvanced] = React.useState(false);
  const [uniMoney, setUniMoney] = React.useState(false);

  // Live scanner board: refresh when a scan pass publishes, so the ranking
  // moves on screen without a full engine-state round trip.
  const [scan, setScan] = React.useState(state?.scan || []);
  const exec = state?.exec;
  React.useEffect(() => {
    const onScan = rows => setScan(rows || []);
    engine.on('scan', onScan);
    setScan(engine.scanner?.top(8) || state?.scan || []);
    return () => {
      engine._listeners.scan = (engine._listeners.scan || []).filter(fn => fn !== onScan);
    };
  }, [engine]);

  // Keep the selectors in step when the engine switches contract elsewhere.
  React.useEffect(() => { setFamily(entry.family); }, [entry.family]);
  React.useEffect(() => {
    if (entry.kind === 'match' || entry.kind === 'diff') setProduct('match_diff');
    else if (entry.kind === 'even' || entry.kind === 'odd') setProduct('even_odd');
    else if (entry.kind) setProduct('over_under');
    if (entry.kind) setBarrier(entry.barrier);
  }, [entry.kind, entry.barrier]);

  const familyContracts = contractsForFamily(family);
  const set = patch => engine.setParams(patch);

  // Digit products need a side (Over/Under, Match/Diff) before a barrier.
  const digitKey = (prod, side, b) => {
    if (prod === 'even_odd') return side === 'odd' ? 'DIGITODD' : 'DIGITEVEN';
    if (prod === 'over_under') return `${side === 'under' ? 'DIGITUNDER' : 'DIGITOVER'}:${b}`;
    return `${side === 'diff' ? 'DIGITDIFF' : 'DIGITMATCH'}:${b}`;
  };

  const chooseFamily = id => {
    setFamily(id);
    if (id === entry.family) return;
    if (id === 'digits') { setProduct('over_under'); setBarrier(3); engine.setContract('DIGITOVER:3'); }
    else {
      const first = contractsForFamily(id)[0];
      if (first) engine.setContract(first.key);
    }
  };
  const chooseProduct = id => {
    setProduct(id);
    if (id === 'even_odd') engine.setContract('DIGITEVEN');
    else if (id === 'over_under') engine.setContract(`DIGITOVER:${barrier}`);
    else engine.setContract(`DIGITMATCH:${barrier}`);
  };

  const activeSide = entry.kind === 'under' || entry.kind === 'diff' || entry.kind === 'odd' ? 'down' : 'up';

  const wins = state?.wins ?? 0;
  const losses = state?.losses ?? 0;
  const trades = state?.trades ?? 0;
  const winRate = trades ? Math.round((wins / trades) * 100) : 0;
  const started = state?.sessionStart;

  const unitLabel = { t: 'ticks', s: 'sec', m: 'min', h: 'hr', d: 'days' };
  const unitOptions = entry.typeId === 'vanillas' ? ['d', 'h', 'm', 's'] : ['t', 's', 'm', 'h'];

  return (
    <div className="screen">
      <div className="screen__title">Automate</div>

      {!auth && (
        <div className="automate-banner">
          <span>Log in to run the auto-engine and place trades.</span>
          <button onClick={onLogin} type="button">Log in</button>
        </div>
      )}

      {/* ── Run + session stats ─────────────────────────────────────── */}
      <div className="automate-run">
        <button
          className={`engine-run${running ? ' is-running' : ''}${state?.startPending ? ' is-warming' : ''}`}
          onClick={() => (running ? engine.stop() : engine.start())}
          type="button"
          disabled={!auth}
        >
          {running ? '■  STOP' : state?.startPending ? '◌  WARMING' : '▶  START'}
        </button>
        <div className="automate-run__status">
          <span className={`engine-run__dot${running ? ' is-on' : ''}${state?.startPending ? ' is-warm' : ''}`} />
          <span className="automate-run__label">
            {running
              ? `${entry.label} · ${autoMarket}${started ? ` · ${Math.max(0, Math.round((Date.now() - started) / 60000))}m` : ''}`
              : state?.startPending
                ? `Warming up — ${state?.warmup?.have ?? 0}/${state?.warmup?.need ?? 100} ticks loaded, starts automatically`
                : state?.warmup && !state.warmup.ready
                  ? `Loading market data — ${state.warmup.have}/${state.warmup.need} ticks`
                  : 'Idle — nothing is trading'}
          </span>
        </div>
      </div>

      <div className="engine-stats">
        <Stat label="Trades" value={trades} />
        <Stat label="Wins" value={wins} />
        <Stat label="Losses" value={losses} />
        <Stat label="Win rate" value={`${winRate}%`} tone={winRate >= 60 ? 'win' : undefined} />
        <Stat label="P/L" value={`${(state?.pnl ?? 0) >= 0 ? '+' : ''}${(state?.pnl ?? 0).toFixed(2)}`} tone={(state?.pnl ?? 0) >= 0 ? 'win' : 'loss'} />
        <Stat label="Streak" value={state?.consLoss ? `-${state.consLoss}` : '0'} tone={state?.consLoss ? 'loss' : undefined} />
        <Stat label="Best" value={`+${(state?.bestTrade ?? 0).toFixed(2)}`} tone="win" />
        <Stat label="Worst" value={`${(state?.worstTrade ?? 0).toFixed(2)}`} tone="loss" />
      </div>

      {/* ── Universal AI: any market, any contract, auto duration ───── */}
      <div className={`menu-section universal${universal ? ' is-on' : ''}`}>
        <div className="menu-section__title">Universal AI</div>
        <label className="menu-toggle">
          <span>Scan every market &amp; contract</span>
          <input
            type="checkbox"
            checked={universal}
            onChange={e => engine.setUniversal(e.target.checked)}
          />
        </label>
        <div className="automate-note">
          {universal
            ? `Every index is scored against every contract at several auto-picked durations. It trades at most once every ~5s — and only when the best reading still clears ${minConf}% on the live tape. Nothing is forced on a timer: a quiet market simply produces no trades.`
            : 'Off. The engine trades the single contract selected below. Turn this on to let it choose the contract, the market and the duration itself.'}
        </div>

        {universal && (
          <>
            <div className="menu-toggle">
              <span>Minimum confidence</span>
              <div className="menu-seg">
                {[70, 80, 90].map(v => (
                  <button
                    key={v}
                    className={`menu-seg__btn${minConf === v ? ' is-active' : ''}`}
                    onClick={() => engine.setUniversalMinConf(v)}
                    type="button"
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>

            <div className="engine-stats">
              <Stat label="Qualifying" value={uni.length} />
              <Stat label="Markets" value={uniMarkets.length} />
              <Stat label="Passes" value={state?.universalPasses ?? 0} />
              <Stat label="Scan p95" value={exec?.p95 != null ? `${exec.p95}ms` : '—'} />
            </div>

            {/* Preferred markets — narrow the AI to the indices you want. */}
            <div className="menu-toggle">
              <span>Preferred markets</span>
              <button
                className="automate-mini"
                onClick={() => engine.clearUniversalMarkets()}
                type="button"
                disabled={!uniPreferred}
              >
                All
              </button>
            </div>
            <div className="automate-note">
              {uniPreferred
                ? `Trading ${uniMarkets.length} of ${SYMBOLS.length} markets — ${uniMarkets.join(', ')}. Tap a chip to add or remove it.`
                : `Trading every market (${SYMBOLS.length}). Tap a chip to narrow the AI to just the markets you pick.`}
            </div>
            <div className="automate-market__grid">
              {SYMBOLS.map(s => (
                <button
                  key={s.sym}
                  className={`automate-market__chip${uniPreferred && uniPreferred.includes(s.sym) ? ' is-active' : ''}`}
                  onClick={() => engine.toggleUniversalMarket(s.sym)}
                  title={s.name}
                  type="button"
                >
                  {s.sym}
                </button>
              ))}
            </div>

            {/* Stake, martingale and risk caps for the AI itself. */}
            <button className="automate-advanced" onClick={() => setUniMoney(m => !m)} type="button">
              {uniMoney ? '▾' : '▸'} Money management
            </button>
            {uniMoney && (
              <>
                <Stepper
                  label="Base stake"
                  value={up.stake ?? 1}
                  min={0.35}
                  max={200}
                  onChange={v => engine.setUniversalParams({ stake: v })}
                />
                <label className="menu-toggle">
                  <span>Martingale</span>
                  <input
                    type="checkbox"
                    checked={!!up.martingale}
                    onChange={e => engine.setUniversalParams({ martingale: e.target.checked })}
                  />
                </label>
                {up.martingale && (
                  <>
                    <Stepper
                      label="Multiplier"
                      value={up.martMult ?? 2}
                      step={0.5}
                      min={1.1}
                      max={5}
                      onChange={v => engine.setUniversalParams({ martMult: v })}
                    />
                    <Stepper
                      label="Max steps"
                      value={up.martSteps ?? 3}
                      step={1}
                      min={1}
                      max={12}
                      decimals={0}
                      onChange={v => engine.setUniversalParams({ martSteps: v })}
                    />
                    <div className="automate-note">
                      After a loss the next stake is multiplied by {up.martMult ?? 2}, up to{' '}
                      {up.martSteps ?? 3} step{(up.martSteps ?? 3) === 1 ? '' : 's'} — a run of{' '}
                      {up.martSteps ?? 3} losses caps the ladder. A win resets it to the base stake.
                    </div>
                  </>
                )}
                <Stepper label="Take profit" value={up.takeProfit ?? 0} step={1} min={0} max={10000} onChange={v => engine.setUniversalParams({ takeProfit: v })} />
                <Stepper label="Stop loss" value={up.stopLoss ?? 0} step={1} min={0} max={10000} onChange={v => engine.setUniversalParams({ stopLoss: v })} />
                <Stepper label="Max consecutive losses" value={up.maxLosses ?? 0} step={1} min={0} max={50} decimals={0} onChange={v => engine.setUniversalParams({ maxLosses: v })} />
                <Stepper label="Max trades this session" value={up.maxTrades ?? 0} step={5} min={0} max={500} decimals={0} onChange={v => engine.setUniversalParams({ maxTrades: v })} />
                <div className="automate-note">0 = unlimited. Take profit, stop loss and the trade cap stop the engine automatically.</div>
              </>
            )}

            {uni.length > 0 ? (
              <div className="scanner-board">
                <div className="scanner-board__head">
                  <span>Best opportunities</span>
                  <span>{minConf}%+</span>
                </div>
                {uni.map((r, i) => (
                  <div key={`${r.key}-${r.sym}-${r.dur}`} className="scanner-row scanner-row--static">
                    <span className="scanner-row__rank">{i + 1}</span>
                    <span className="scanner-row__sym">{r.label}</span>
                    <span className="scanner-row__mid">{r.sym} · {r.dur}</span>
                    <span className="scanner-row__val scanner-row__val--win">{r.conf}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="automate-note">
                {state?.warmup && !state.warmup.ready
                  ? 'Loading market data…'
                  : `No reading currently clears ${minConf}%. The engine is waiting rather than forcing a trade.`}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Contract ────────────────────────────────────────────────── */}
      <div className="menu-section">
        <div className="menu-section__title">Contract</div>
        <div className="automate-tabs">
          {AUTO_FAMILIES.map(f => (
            <button
              key={f.id}
              className={`automate-tab${family === f.id ? ' is-active' : ''}`}
              onClick={() => chooseFamily(f.id)}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>

        {family === 'digits' ? (
          <>
            <div className="automate-tabs automate-tabs--sub">
              {DIGIT_PRODUCTS.map(d => (
                <button
                  key={d.id}
                  className={`automate-tab${product === d.id ? ' is-active' : ''}`}
                  onClick={() => chooseProduct(d.id)}
                  type="button"
                >
                  {d.label}
                </button>
              ))}
            </div>
            {product !== 'even_odd' && (
              <div className="automate-barrier">
                <span className="automate-barrier__label">Barrier</span>
                <div className="automate-barrier__row">
                  {(product === 'over_under' ? [0,1,2,3,4,5,6,7,8] : [0,1,2,3,4,5,6,7,8,9]).map(b => {
                    const isCurrent = (entry.kind === 'over' || entry.kind === 'under'
                      || entry.kind === 'match' || entry.kind === 'diff') && entry.barrier === b;
                    return (
                      <button
                        key={b}
                        className={`automate-barrier__btn${isCurrent ? ' is-active' : ''}`}
                        onClick={() => { setBarrier(b); engine.setContract(digitKey(product, product === 'match_diff' ? 'match' : 'over', b)); }}
                        type="button"
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="automate-sides">
              {(product === 'even_odd' ? ['even', 'odd'] : product === 'over_under' ? ['over', 'under'] : ['match', 'diff']).map(side => (
                <button
                  key={side}
                  className={`automate-side${activeSide === (side === 'under' || side === 'diff' || side === 'odd' ? 'down' : 'up') ? ' is-active' : ''}`}
                  onClick={() => engine.setContract(digitKey(product, side, barrier))}
                  type="button"
                >
                  {side === 'even' ? 'Even' : side === 'odd' ? 'Odd' : side === 'over' ? `Over ${barrier}` : side === 'under' ? `Under ${barrier}` : side === 'match' ? `Matches ${barrier}` : `Differs ${barrier}`}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="automate-contracts">
            {familyContracts.map(c => (
              <button
                key={c.key}
                className={`automate-contract${contractKey === c.key ? ' is-active' : ''}`}
                onClick={() => engine.setContract(c.key)}
                type="button"
              >
                <span className="automate-contract__label">{c.label}</span>
                <span className="automate-contract__note">{c.note}</span>
              </button>
            ))}
          </div>
        )}

        <div className="automate-selected">
          <span className="automate-selected__label">{entry.label}</span>
          <span className="automate-selected__win">{entry.winNote}</span>
          <span className="automate-selected__note">{entry.note}</span>
        </div>
      </div>

      {/* ── Market: multi-market scanner ────────────────────────────── */}
      <div className="menu-section">
        <div className="menu-section__title">Market</div>
        <label className="menu-toggle">
          <span>Multi-market scanner</span>
          <input
            type="checkbox"
            checked={state?.autoSwitch !== false}
            onChange={e => engine.setAutoSwitch(e.target.checked)}
          />
        </label>
        <div className="automate-note">
          {state?.autoSwitch !== false
            ? 'Every eligible market is scored on each pass and the trade is taken on whichever one is strongest right now — so the strategy chooses where to trade, not just when.'
            : 'Scanner off — the engine trades the manually selected market only.'}
        </div>

        <div className="automate-market__current">
          <span className="automate-market__name">{market.name}</span>
          <span className="automate-market__sym">
            {market.sym} · {market.cat}
            {exec && exec.p50 != null ? ` · exec p50 ${exec.p50}ms` : ''}
          </span>
        </div>

        {state?.autoSwitch !== false && scan.length > 0 && (
          <div className="scanner-board">
            <div className="scanner-board__head">
              <span>Live scan</span>
              <span>{state?.scanCount ?? 0} passes{exec?.p95 != null ? ` · p95 ${exec.p95}ms` : ''}</span>
            </div>
            {scan.map((r, i) => (
              <button
                key={r.sym}
                className={`scanner-row${r.sym === autoMarket ? ' is-active' : ''}`}
                onClick={() => engine.setMarket(r.sym)}
                type="button"
              >
                <span className="scanner-row__rank">{i + 1}</span>
                <span className="scanner-row__sym">{r.sym}</span>
                <span className="scanner-row__bar">
                  <span
                    className="scanner-row__fill"
                    style={{ width: `${Math.max(4, Math.min(100, ((r.score ?? 0) / 120) * 100))}%` }}
                  />
                </span>
                <span className="scanner-row__val">
                  {r.conf != null ? `${r.conf}%` : r.score != null ? `${Math.round(r.score)}` : '—'}
                </span>
              </button>
            ))}
          </div>
        )}

        {state?.autoSwitch === false && (
          <div className="automate-market__grid">
            {SYMBOLS.map(s => {
              const disabled = entry.digitFamily && !isDigitSymbol(s.sym);
              return (
                <button
                  key={s.sym}
                  className={`automate-market__chip${s.sym === autoMarket ? ' is-active' : ''}`}
                  onClick={() => !disabled && engine.setMarket(s.sym)}
                  disabled={disabled}
                  title={disabled ? 'Digits need a Volatility index' : s.name}
                  type="button"
                >
                  {s.sym}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Strategy: the two decisions that matter ─────────────────── */}
      <div className="menu-section">
        <div className="menu-section__title">Strategy</div>

        <Stepper
          label="Stake"
          value={p.stake ?? 1}
          min={0.35}
          max={200}
          onChange={v => set({ stake: v })}
        />

        <div className="menu-toggle">
          <span>Accuracy</span>
          <div className="menu-seg">
            {ACCURACY_LEVELS.map(l => (
              <button
                key={l.id}
                className={`menu-seg__btn${(p.accuracy || 'max') === l.id ? ' is-active' : ''}`}
                onClick={() => set({ accuracy: l.id })}
                type="button"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="automate-note">
          Max trades least but wins most — it waits for a signal that clears break-even by a wide,
          statistically significant margin. Duration, barrier and digit are set per contract.
        </div>

        <button className="automate-advanced" onClick={() => setAdvanced(a => !a)} type="button">
          {advanced ? '▾' : '▸'} Advanced
        </button>

        {advanced && (
          <>
            <Stepper
              label="Min confidence"
              value={p.minConf ?? 85}
              step={5}
              min={0}
              max={95}
              decimals={0}
              suffix="%"
              onChange={v => set({ minConf: v })}
            />
            {entry.digitFamily && (
              <>
                <Stepper
                  label="Min edge"
                  value={(p.minEdge ?? 0.045) * 100}
                  step={0.5}
                  min={0}
                  max={20}
                  decimals={1}
                  suffix="%"
                  onChange={v => set({ minEdge: v / 100 })}
                />
                <Stepper
                  label="Sample window"
                  value={p.window ?? 0}
                  step={10}
                  min={0}
                  max={400}
                  decimals={0}
                  suffix={p.window ? ' ticks' : ' (auto)'}
                  onChange={v => set({ window: v })}
                />
              </>
            )}
            {entry.inputs.includes('duration') && (
              <>
                <Stepper
                  label="Duration"
                  value={p.duration ?? 1}
                  min={1}
                  max={entry.typeId === 'vanillas' ? 365 : 10}
                  decimals={0}
                  suffix={` ${unitLabel[p.unit] || 'ticks'}`}
                  onChange={v => set({ duration: v })}
                />
                <div className="menu-toggle">
                  <span>Duration unit</span>
                  <div className="menu-seg">
                    {unitOptions.map(u => (
                      <button
                        key={u}
                        className={`menu-seg__btn${(p.unit || 't') === u ? ' is-active' : ''}`}
                        onClick={() => set({ unit: u, duration: u === 't' ? Math.min(p.duration ?? 5, 10) : (p.duration ?? 5) })}
                        type="button"
                      >
                        {unitLabel[u]}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {entry.inputs.includes('barrier') && (
              <div className="engine-stake engine-stake--compact">
                <span className="engine-stake__label">Barrier</span>
                <input
                  className="engine-stake__input"
                  value={p.barrier ?? '+0.10'}
                  onChange={e => set({ barrier: e.target.value })}
                  spellCheck={false}
                />
              </div>
            )}
            {entry.inputs.includes('barrier2') && (
              <div className="engine-stake engine-stake--compact">
                <span className="engine-stake__label">Low barrier</span>
                <input
                  className="engine-stake__input"
                  value={p.barrier2 ?? '-0.10'}
                  onChange={e => set({ barrier2: e.target.value })}
                  spellCheck={false}
                />
              </div>
            )}
            {entry.inputs.includes('selectedTick') && (
              <div className="menu-toggle">
                <span>Selected tick</span>
                <div className="menu-seg">
                  {[1, 2, 3, 4, 5].map(t => (
                    <button
                      key={t}
                      className={`menu-seg__btn${(p.selectedTick ?? 3) === t ? ' is-active' : ''}`}
                      onClick={() => set({ selectedTick: t })}
                      type="button"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {entry.inputs.includes('growthRate') && (
              <Stepper
                label="Growth rate"
                value={(p.growthRate ?? 0.01) * 100}
                step={1}
                min={1}
                max={5}
                decimals={0}
                suffix="%"
                onChange={v => set({ growthRate: v / 100 })}
              />
            )}
            {entry.inputs.includes('multiplier') && (
              <div className="menu-toggle">
                <span>Multiplier</span>
                <div className="menu-seg">
                  {[10, 20, 50, 100, 200, 500].map(m => (
                    <button
                      key={m}
                      className={`menu-seg__btn${(p.multiplier ?? 100) === m ? ' is-active' : ''}`}
                      onClick={() => set({ multiplier: m })}
                      type="button"
                    >
                      x{m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="menu-toggle">
              <span>Martingale</span>
              <input type="checkbox" checked={!!p.martingale} onChange={e => set({ martingale: e.target.checked })} />
            </label>
            {p.martingale && (
              <>
                <Stepper label="Multiplier" value={p.martMult ?? 2} step={0.5} min={1.1} max={5} onChange={v => set({ martMult: v })} />
                <Stepper label="Max steps" value={p.martSteps ?? 3} step={1} min={1} max={12} decimals={0} onChange={v => set({ martSteps: v })} />
              </>
            )}

            <Stepper label="Take profit" value={p.takeProfit ?? 0} step={1} min={0} max={10000} onChange={v => set({ takeProfit: v })} />
            <Stepper label="Stop loss" value={p.stopLoss ?? 0} step={1} min={0} max={10000} onChange={v => set({ stopLoss: v })} />
            <Stepper label="Max consecutive losses" value={p.maxLosses ?? 3} step={1} min={0} max={50} decimals={0} onChange={v => set({ maxLosses: v })} />
            <Stepper label="Max trades this session" value={p.maxTrades ?? 0} step={5} min={0} max={500} decimals={0} onChange={v => set({ maxTrades: v })} />
            <div className="automate-note">0 = unlimited. Take profit, stop loss and the trade cap stop the engine automatically.</div>
          </>
        )}

        <button className="automate-reset" onClick={() => engine.resetSession()} type="button">
          Reset session stats
        </button>
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
