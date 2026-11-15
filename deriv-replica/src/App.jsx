import React from 'react';
import Chart from './components/Chart.jsx';
import Analytics from './components/Analytics.jsx';
import Panel from './components/Panel.jsx';
import StrategyBuilder from './components/StrategyBuilder.jsx';
import TradeDock from './components/TradeDock.jsx';
import TickerTape from './components/TickerTape.jsx';
import StatusBar from './components/StatusBar.jsx';
import { Positions, Reports, Logs } from './components/Tables.jsx';
import { SymbolPicker, LoginModal, Modal } from './components/Modals.jsx';
import { IconChart, IconStrategy, IconPositions, IconReports, IconLog } from './components/icons.jsx';
import { useEngine } from './lib/useEngine.js';
import { SYMBOLS, symbolInfo, pipSize } from './lib/symbols.js';
import { TIMEFRAMES } from './lib/marketStore.js';
import { defaultStrategy } from './lib/strategyBuilder.js';
import { usePayout } from './lib/usePayout.js';
import { addComma } from './lib/format.js';

const PANES = [['rsi', 'RSI'], ['macd', 'MACD'], ['none', 'None']];
const OVERLAY_SETS = [
  { id: 'trend', label: 'EMA 9/21', overlays: ['ema9', 'ema21'] },
  { id: 'trend+bb', label: 'EMA + BB', overlays: ['ema9', 'ema21', 'bb'] },
  { id: 'st', label: 'SuperTrend', overlays: ['st'] },
  { id: 'vwap', label: 'VWAP', overlays: ['vwap'] },
  { id: 'all', label: 'All overlays', overlays: ['ema9', 'ema21', 'bb', 'st', 'vwap'] },
  { id: 'none', label: 'None', overlays: [] },
];
const NAV = [
  ['trade', 'Chart', IconChart],
  ['builder', 'Strategy', IconStrategy],
  ['positions', 'Positions', IconPositions],
  ['reports', 'Reports', IconReports],
  ['logs', 'Log', IconLog],
];

export default function App() {
  const { engine, client, state, tick, logs, toast, health, login, loginWithOAuth, logout, switchAccount } = useEngine();

  const [view, setView] = React.useState('trade');          // trade | builder | positions | reports | logs
  const [chartMode, setChartMode] = React.useState('candles');
  const [overlaySet, setOverlaySet] = React.useState('trend+bb');
  const [pane, setPane] = React.useState('rsi');
  const [symOpen, setSymOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [guideOpen, setGuideOpen] = React.useState(false);
  const [backtest, setBacktest] = React.useState(null);

  const strategy = state?.strategy;
  const symbol = state?.selectedSymbol || 'R_100';
  const info = symbolInfo(symbol);
  const tf = state?.selectedTf || '5s';

  // Bootstrap the default strategy once.
  React.useEffect(() => {
    if (state && !state.strategy) engine.setStrategy(defaultStrategy());
  }, [state, engine]);

  const candles = React.useMemo(() => engine.store.candles(symbol, tf), [engine, symbol, tf, tick]);
  const digits = React.useMemo(() => engine.store.digits(symbol), [engine, symbol, tick]);
  const price = tick?.sym === symbol ? tick.price : (engine.store.lastPrice(symbol) ?? null);

  const prev = React.useRef(price);
  const up = price != null && prev.current != null ? price >= prev.current : true;
  React.useEffect(() => { if (price != null) prev.current = price; }, [price]);

  const overlays = OVERLAY_SETS.find(o => o.id === overlaySet)?.overlays ?? [];

  // Live payout for the manual dock (Rise/Fall, current stake).
  const payout = usePayout(client, { contract_type: 'CALL', underlying_symbol: symbol, amount: 1, basis: 'stake', currency: 'USD', duration: 5, duration_unit: 't' }, [client, symbol]);

  const onBacktest = () => {
    const r = engine.backtest(strategy, symbol);
    setBacktest(r ? { ...r, __sym: symbol } : null);
  };

  const ticks = state?.ticks ?? 0;
  const live = !!state?.auth;

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="brand__mark">Q</span>
          <span className="brand__name">Quant Terminal</span>
          <span className="brand__sub">charts · analytics · strategy</span>
        </div>
        <div className="topbar__tabs">
          {NAV.map(([id, label]) => (
            <button key={id} className={`tab${view === id ? ' is-active' : ''}`} onClick={() => setView(id)} type="button">{label}</button>
          ))}
        </div>
        <div className="topbar__spacer" />
        <div className="conn">
          <span className={`dot ${live ? 'is-live is-pulse' : health?.connected ? 'is-warn' : ''}`} />
          <span>{live ? 'LIVE' : health?.connected ? 'MARKET FEED' : 'CONNECTING'}</span>
          <span style={{ color: 'var(--text-mute)' }}>· {ticks} ticks</span>
        </div>
        {state?.auth ? (
          <div className="acct">
            <span className="acct__bal">{addComma(state.balance)}</span>
            <span className="acct__cur">USD</span>
            <span className={`acct__type ${state.accountType === 'real' ? 'is-real' : ''}`}>{state.accountType}</span>
            {state.accounts?.length > 1 && (
              <select className="sel" value={state.accountId || ''} onChange={e => switchAccount(e.target.value)} style={{ maxWidth: 120 }}>
                {state.accounts.map(a => <option key={a.account} value={a.account}>{a.account} ({a.currency})</option>)}
              </select>
            )}
            <button className="btn btn--ghost btn--sm" onClick={logout} type="button">Log out</button>
          </div>
        ) : (
          <button className="btn btn--primary" style={{ marginLeft: 14 }} onClick={() => setLoginOpen(true)} type="button">Log in</button>
        )}
      </div>

      <TickerTape store={engine.store} tick={tick} selected={symbol} onSelect={s => engine.setSymbol(s)} />

      <div className="body">
        <nav className="rail">
          {NAV.map(([id, label, Icon]) => (
            <button key={id} className={`rail__item${view === id ? ' is-active' : ''}`} onClick={() => setView(id)} title={label} type="button"><Icon /></button>
          ))}
          <div className="rail__sep" />
          <button className="rail__item" title="Guide" onClick={() => setGuideOpen(true)} type="button" style={{ fontSize: 15, fontWeight: 600 }}>?</button>
        </nav>

        <div className="main">
          {view === 'builder' ? (
            <div className="workspace">
              <StrategyBuilder
                strategy={strategy}
                onChange={s => engine.setStrategy(s)}
                onBacktest={onBacktest}
                onStart={() => engine.start()}
                onStop={() => engine.stop()}
                running={!!state?.running}
                backtest={backtest}
                symbols={SYMBOLS}
              />
            </div>
          ) : view === 'positions' || view === 'reports' || view === 'logs' ? (
            <div className="workspace" style={{ overflow: 'auto' }}>
              {view === 'positions' && <Positions positions={state?.positions ?? []} />}
              {view === 'reports' && <Reports reports={state?.reports ?? []} onReset={() => engine.resetSession()} />}
              {view === 'logs' && <Logs logs={logs} />}
            </div>
          ) : (
            <div className="workspace">
              <div className="ctool">
                <button className="symbtn" onClick={() => setSymOpen(true)} type="button">
                  <span className="symbtn__name">{info.name}</span>
                  <span className="symbtn__sym">{symbol}</span>
                  <span className={`symbtn__price ${up ? 'is-up' : 'is-down'}`}>{price != null ? price.toFixed(pipSize(symbol)) : '—'}</span>
                  <span className="symbtn__meta">▼</span>
                </button>

                <div className="tfbar">
                  {TIMEFRAMES.map(t => (
                    <button key={t.id} className={`tf${tf === t.id ? ' is-active' : ''}`} onClick={() => engine.setTimeframe(t.id)} type="button">{t.label}</button>
                  ))}
                </div>

                <div className="tfbar">
                  <button className={`tf${chartMode === 'candles' ? ' is-active' : ''}`} onClick={() => setChartMode('candles')} type="button">Candles</button>
                  <button className={`tf${chartMode === 'line' ? ' is-active' : ''}`} onClick={() => setChartMode('line')} type="button">Line</button>
                </div>

                <div className="tool-sep" />

                <select className="sel" value={overlaySet} onChange={e => setOverlaySet(e.target.value)}>
                  {OVERLAY_SETS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>

                <select className="sel" value={pane} onChange={e => setPane(e.target.value)}>
                  {PANES.map(([id, l]) => <option key={id} value={id}>{l} pane</option>)}
                </select>

                <div className="topbar__spacer" />
                {state?.running && (
                  <span className="pill is-up">BOT · {strategy?.name} · {state.warmup?.have} warm</span>
                )}
                {state?.running
                  ? <button className="btn btn--down btn--sm" onClick={() => engine.stop()} type="button">Stop bot</button>
                  : <button className="btn btn--ghost btn--sm" onClick={() => engine.start()} type="button">Start bot</button>}
              </div>

              <Chart candles={candles} up={up} overlays={overlays} pane={pane} mode={chartMode} symbol={symbol} />
            </div>
          )}

          {view === 'trade' && (
            <aside className="dock">
              <Analytics candles={candles} digits={digits} sym={symbol} price={price} />
              <Panel title="Trade" count={state?.auth ? 'ready' : 'login'} defaultOpen>
                <TradeDock
                  auth={!!state?.auth}
                  onLogin={() => setLoginOpen(true)}
                  onTrade={(type, side, value) => engine.placeTrade(type, side, value)}
                  symbol={symbol}
                  price={price}
                  payout={payout}
                />
              </Panel>
              <Panel title="Session" defaultOpen={false}>
                <div className="rows">
                  <div className="row"><span className="row__k">Trades</span><span className="row__v">{state?.trades ?? 0}</span></div>
                  <div className="row"><span className="row__k">Wins / Losses</span><span className="row__v"><span className="is-up">{state?.wins ?? 0}</span> / <span className="is-down">{state?.losses ?? 0}</span></span></div>
                  <div className="row"><span className="row__k">Net P&L</span><span className={`row__v ${(state?.pnl ?? 0) >= 0 ? 'is-up' : 'is-down'}`}>{(state?.pnl ?? 0) >= 0 ? '+' : ''}{addComma(state?.pnl ?? 0)}</span></div>
                  <div className="row"><span className="row__k">Best / Worst</span><span className="row__v">{(state?.bestTrade ?? 0).toFixed(2)} / {(state?.worstTrade ?? 0).toFixed(2)}</span></div>
                  <div className="row"><span className="row__k">Exec p50 / p95</span><span className="row__v">{state?.exec?.p50 ?? '—'} / {state?.exec?.p95 ?? '—'} ms</span></div>
                  <div className="row"><span className="row__k">Warm-up</span><span className="row__v">{state?.warmup?.have}/{state?.warmup?.need}</span></div>
                </div>
              </Panel>
            </aside>
          )}
        </div>
      </div>

      <StatusBar state={state} health={health} symbol={symbol} />

      {symOpen && <SymbolPicker current={symbol} onSelect={s => engine.setSymbol(s)} onClose={() => setSymOpen(false)} />}
      {loginOpen && (
        <LoginModal
          onToken={login}
          onOAuth={loginWithOAuth}
          onClose={() => setLoginOpen(false)}
        />
      )}
      {guideOpen && (
        <Modal title="Guide" onClose={() => setGuideOpen(false)}>
          <p style={{ color: 'var(--text-dim)', lineHeight: 1.7 }}>
            The terminal imports <b>1000 ticks</b> per market and aggregates them into candles across every
            timeframe from <b>5s</b> to <b>15m</b>. The live tape never stops: the feed reconnects on its own,
            refreshes a stale stream, and reconnects the moment the tab is focused or the network returns.
            The analytics column reads 20+ indicators over the selected timeframe; the digit distribution is
            measured on the raw tick tape.
          </p>
          <p style={{ color: 'var(--text-dim)', lineHeight: 1.7 }}>
            Build a strategy on the <b>Strategy</b> tab: nest AND/OR groups, compare any indicator,
            price field or constant with greater/less, cross-over/under, rising/falling. Run a backtest
            to see how it would have traded the imported history, then <b>Start bot</b> to trade it live.
            The bot evaluates the strategy when a candle of its timeframe closes and places the contract
            through the same Deriv proposal path as a manual trade.
          </p>
        </Modal>
      )}
      {toast && <div className={`toast toast--${toast.kind || 'info'}`}>{toast.msg}</div>}
    </div>
  );
}

