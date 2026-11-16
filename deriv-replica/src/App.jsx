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
import { TIMEFRAMES, TICK_BAR_SIZES } from './lib/marketStore.js';
import { defaultStrategy } from './lib/strategyBuilder.js';
import { CURRENCY, money } from './lib/format.js';

const PANES = [['rsi', 'RSI'], ['macd', 'MACD'], ['willr', 'Williams %R'], ['none', 'None']];
const OVERLAY_SETS = [
  { id: 'trend', label: 'EMA 9/21', overlays: ['ema9', 'ema21'] },
  { id: 'trend+bb', label: 'EMA + BB', overlays: ['ema9', 'ema21', 'bb'] },
  { id: 'st', label: 'SuperTrend', overlays: ['st'] },
  { id: 'psar', label: 'Parabolic SAR', overlays: ['psar'] },
  { id: 'vwap', label: 'VWAP', overlays: ['vwap'] },
  { id: 'all', label: 'All overlays', overlays: ['ema9', 'ema21', 'bb', 'st', 'psar', 'vwap'] },
  { id: 'none', label: 'None', overlays: [] },
];
const CHART_MODES = [['candles', 'Candles'], ['heiken', 'Heiken Ashi'], ['line', 'Line']];
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
  const [barSource, setBarSource] = React.useState('time');  // time | tickbar | tick
  const [tickSize, setTickSize] = React.useState(25);
  const [overlaySet, setOverlaySet] = React.useState('trend+bb');
  const [pane, setPane] = React.useState('rsi');
  const [symOpen, setSymOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [guideOpen, setGuideOpen] = React.useState(false);
  const [backtest, setBacktest] = React.useState(null);

  const strategy = state?.strategy;
  const symbol = state?.selectedSymbol || 'R_75';
  const info = symbolInfo(symbol);
  const tf = state?.selectedTf || '5s';

  // Bootstrap the default strategy once.
  React.useEffect(() => {
    if (state && !state.strategy) engine.setStrategy(defaultStrategy());
  }, [state, engine]);

  const candles = React.useMemo(() => {
    // Three bar sources share the chart: clock-based candles (the engine's
    // trading timeframe), fixed-tick-count bars, and the raw tick line. The
    // tick line turns every price update into a one-tick bar so the existing
    // windowing, crosshair and OHLC readout all keep working unchanged.
    if (barSource === 'tick') {
      const { times, prices } = engine.store.ticks(symbol);
      const n = Math.min(times.length, prices.length);
      const from = Math.max(0, n - 600);
      const out = [];
      for (let i = from; i < n; i++) {
        const p = prices[i];
        out.push({ epoch: times[i], open: p, high: p, low: p, close: p, ticks: 1, volume: 1 });
      }
      return out;
    }
    if (barSource === 'tickbar') return engine.store.tickBars(symbol, tickSize);
    return engine.store.candles(symbol, tf);
  }, [engine, symbol, tf, tick, barSource, tickSize]);
  const digits = React.useMemo(() => engine.store.digits(symbol), [engine, symbol, tick]);
  // The raw tick tape, for the microstructure and AI panels.
  const tickData = React.useMemo(() => engine.store.ticks(symbol), [engine, symbol, tick]);
  const price = tick?.sym === symbol ? tick.price : (engine.store.lastPrice(symbol) ?? null);

  const prev = React.useRef(price);
  const up = price != null && prev.current != null ? price >= prev.current : true;
  React.useEffect(() => { if (price != null) prev.current = price; }, [price]);

  const overlays = OVERLAY_SETS.find(o => o.id === overlaySet)?.overlays ?? [];

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
            <span className="acct__bal">{money(state.balance, state.currency)}</span>
            <span className="acct__cur">{state.currency || CURRENCY}</span>
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
                currency={state?.currency}
              />
            </div>
          ) : view === 'positions' || view === 'reports' || view === 'logs' ? (
            <div className="workspace" style={{ overflow: 'auto' }}>
              {view === 'positions' && <Positions positions={state?.positions ?? []} currency={state?.currency} />}
              {view === 'reports' && <Reports reports={state?.reports ?? []} onReset={() => engine.resetSession()} currency={state?.currency} />}
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
                  <button className={`tf${barSource === 'time' ? ' is-active' : ''}`} onClick={() => setBarSource('time')} type="button" title="Clock-based candles">Time</button>
                  <button className={`tf${barSource === 'tickbar' ? ' is-active' : ''}`} onClick={() => setBarSource('tickbar')} type="button" title="Fixed tick-count bars">Tick bars</button>
                  <button className={`tf${barSource === 'tick' ? ' is-active' : ''}`} onClick={() => setBarSource('tick')} type="button" title="Every tick">Tick chart</button>
                </div>

                {barSource === 'tickbar' ? (
                  <div className="tfbar">
                    {TICK_BAR_SIZES.map(n => (
                      <button key={n} className={`tf${tickSize === n ? ' is-active' : ''}`} onClick={() => setTickSize(n)} type="button">{n}t</button>
                    ))}
                  </div>
                ) : barSource === 'time' ? (
                  <div className="tfbar">
                    {TIMEFRAMES.map(t => (
                      <button key={t.id} className={`tf${tf === t.id ? ' is-active' : ''}`} onClick={() => engine.setTimeframe(t.id)} type="button">{t.label}</button>
                    ))}
                  </div>
                ) : (
                  <div className="tfbar">
                    <span className="tf is-active" title="One bar per tick">Per-tick</span>
                  </div>
                )}

                <div className="tfbar">
                  {CHART_MODES.map(([id, label]) => (
                    <button key={id} className={`tf${chartMode === id ? ' is-active' : ''}`} onClick={() => setChartMode(id)} type="button">{label}</button>
                  ))}
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

              <Chart candles={candles} up={up} overlays={overlays} pane={pane} mode={barSource === 'tick' ? 'line' : chartMode} symbol={symbol} />
            </div>
          )}

          {view === 'trade' && (
            <aside className="dock">
              <Analytics candles={candles} digits={digits} sym={symbol} price={price} prices={tickData.prices} times={tickData.times} />
              <Panel title="Trade" count={state?.auth ? 'ready' : 'login'} defaultOpen>
                <TradeDock
                  auth={!!state?.auth}
                  onLogin={() => setLoginOpen(true)}
                  onTrade={(type, side, value) => engine.placeTrade(type, side, value)}
                  client={client}
                  symbol={symbol}
                  price={price}
                  currency={state?.currency}
                />
              </Panel>
              <Panel title="Session" defaultOpen={false}>
                <div className="rows">
                  <div className="row"><span className="row__k">Trades</span><span className="row__v">{state?.trades ?? 0}</span></div>
                  <div className="row"><span className="row__k">Wins / Losses</span><span className="row__v"><span className="is-up">{state?.wins ?? 0}</span> / <span className="is-down">{state?.losses ?? 0}</span></span></div>
                  <div className="row"><span className="row__k">Net P&L</span><span className={`row__v ${(state?.pnl ?? 0) >= 0 ? 'is-up' : 'is-down'}`}>{(state?.pnl ?? 0) >= 0 ? '+' : ''}{money(state?.pnl ?? 0, state?.currency)}</span></div>
                  <div className="row"><span className="row__k">Best / Worst</span><span className="row__v">{money(state?.bestTrade ?? 0, state?.currency)} / {money(state?.worstTrade ?? 0, state?.currency)}</span></div>
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
            <b>Drag</b> the chart to pan through history, <b>scroll</b> or pinch to zoom,
            and double-click to snap back to the live edge.
          </p>
          <p>
            The bot evaluates the strategy when a candle of its timeframe closes and places the contract
            through the same Deriv proposal path as a manual trade. Every stake, profit and balance is
            shown in Kenyan shillings; the default stake is <b>KES 0.35</b>.
          </p>
        </Modal>
      )}
      {toast && <div className={`toast toast--${toast.kind || 'info'}`}>{toast.msg}</div>}
    </div>
  );
}

