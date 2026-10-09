import React from 'react';
import Header from './components/Header.jsx';
import TradeTypesBar from './components/TradeTypesBar.jsx';
import MarketSelector from './components/MarketSelector.jsx';
import ChartArea from './components/ChartArea.jsx';
import SmartChartArea from './components/SmartChartArea.jsx';
import ChartErrorBoundary from './components/ChartErrorBoundary.jsx';
import DigitAnalysis from './components/DigitAnalysis.jsx';
import TradeForm from './components/TradeForm.jsx';
import DurationSheet from './components/DurationSheet.jsx';
import NumberSheet from './components/NumberSheet.jsx';
import BarrierSheet from './components/BarrierSheet.jsx';
import BottomNav from './components/BottomNav.jsx';
import Sidebar from './components/Sidebar.jsx';
import Positions from './components/Positions.jsx';
import SymbolSheet from './components/SymbolSheet.jsx';
import Sheet from './components/Sheet.jsx';
import { MenuScreen, Reports, LoginScreen } from './components/screens.jsx';
import { LabelPairedPresentationScreenSmRegularIcon } from '@deriv/quill-icons';
import { SYMBOLS, pipSize } from './lib/marketStore.js';
import { TRADE_TYPES, findTradeType, buildProposal, isDigitContract } from './lib/contracts.js';
import { analyzeDigits } from './lib/digitAnalysis.js';
import { useEngine } from './lib/useEngine.js';
import { usePayout } from './lib/usePayout.js';
import { addComma } from './lib/format.js';

const CURRENCY = 'USD';
const DURATION_BOUNDS = { t: [1, 10], s: [15, 86400], m: [1, 1440], h: [1, 24], d: [1, 365] };
const UNIT_LABELS = { t: 'Ticks', s: 'Seconds', m: 'Minutes', h: 'Hours', d: 'Days' };

export default function App() {
  const { engine, client, state, tick, toast, login, logout, switchAccount } = useEngine();

  const [tab, setTab] = React.useState('trade');
  const [marketIdx, setMarketIdx] = React.useState(0);
  const [type, setType] = React.useState('rise_fall');
  const [side, setSide] = React.useState('up');
  const [sheet, setSheet] = React.useState(null);
  const [typesSheet, setTypesSheet] = React.useState(false);
  const [guide, setGuide] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [language, setLanguage] = React.useState('EN');
  const [dark, setDark] = React.useState(true);

  // Shared form state across every trade type; each type reads the keys it needs.
  const [form, setForm] = React.useState({
    duration: 5, unit: 't', stake: 1, digit: 5, barrier: '+0.10',
    equals: false, growthRate: 0.01, multiplier: 100,
    takeProfit: 0, stopLoss: 0, cancellation: '',
  });
  const set = React.useCallback(patch => setForm(f => ({ ...f, ...patch })), []);

  const market = SYMBOLS[marketIdx];
  const tradeType = findTradeType(type);
  const isDigit = isDigitContract(type);
  const spot = React.useMemo(() => {
    if (tick?.sym === market.sym) return tick.price;
    return engine.store.lastPrice[market.sym] ?? 0;
  }, [tick, market.sym, engine]);
  const livePrices = React.useMemo(() => engine.store.livePrices(market.sym), [tick, market.sym, engine]);

  const prevRef = React.useRef(spot);
  const up = spot >= prevRef.current;
  React.useEffect(() => { prevRef.current = spot; }, [spot]);

  React.useEffect(() => { engine.selectedMarket = market.sym; }, [engine, market.sym]);
  React.useEffect(() => {
    if (!tradeType.durationUnits.includes(form.unit)) {
      set({ unit: tradeType.durationUnits[0] || 't' });
    }
  }, [tradeType, form.unit, set]);

  // Digit analysis runs on the selected market's live tick history.
  const digitAnalysis = React.useMemo(
    () => (isDigit ? analyzeDigits(engine.digitHistory(market.sym)) : null),
    [isDigit, engine, market.sym, tick]
  );

  // Accurate payout, quoted by Deriv for the exact contract the buttons offer.
  const payoutFields = buildProposal(type, side, form, market.sym);
  const payout = usePayout(
    client,
    payoutFields,
    [client, type, side, market.sym, form.duration, form.unit, form.stake, form.digit,
      form.barrier, form.equals, form.growthRate, form.multiplier, form.takeProfit, form.stopLoss, form.cancellation]
  );

  const onTrade = s => {
    setSide(s);
    if (!state?.auth) { setShowLogin(true); return; }
    engine.placeTrade(type, s, form);
  };

  const selectType = id => {
    setType(id);
    setSide('up');
    const t = findTradeType(id);
    if (!t.durationUnits.includes(form.unit)) set({ unit: t.durationUnits[0] || 't' });
    setTypesSheet(false);
  };

  const openCount = state?.positions?.length ?? 0;

  return (
    <div className={`app app--theme-${dark ? 'dark' : 'light'}`}>
      <Sidebar
        tab={tab}
        setTab={setTab}
        openCount={openCount}
        dark={dark}
        onToggleTheme={() => setDark(d => !d)}
        onLanguage={() => setLangOpen(true)}
        onLogin={() => setShowLogin(true)}
        connected={!!state?.auth}
      />

      <div className="app__content">
        <Header
          balance={state?.balance ?? 0}
          currency={CURRENCY}
          accountType={state?.accountType}
          connected={state?.auth}
          accounts={state?.accounts ?? []}
          accountId={state?.accountId}
          onSwitchAccount={id => switchAccount(id)}
          onLogin={() => setShowLogin(true)}
          onAccount={() => setTab('menu')}
          onDeposit={() => setShowLogin(true)}
        />

        <main className="app__main">
          {tab === 'trade' && (
            <div className="trade-screen">
              <div className="trade-types-row">
                <TradeTypesBar type={type} onSelect={selectType} onViewAll={() => setTypesSheet(true)} />
              </div>
              <div className="trade-grid">
                <div className="trade-grid__chart">
                  <div className="home__row">
                    <MarketSelector display={market.name} sym={market.sym} price={spot} up={up} onOpen={() => setSheet('symbol')} />
                    <button className="trade__guide" onClick={() => setGuide(true)} type="button" aria-label="Guide">
                      <LabelPairedPresentationScreenSmRegularIcon fill="currentColor" iconSize="sm" />
                    </button>
                  </div>
                  {client ? (
                    <ChartErrorBoundary fallback={<ChartArea prices={livePrices} up={up} sym={market.sym} />}>
                      <SmartChartArea client={client} sym={market.sym} prices={livePrices} up={up} />
                    </ChartErrorBoundary>
                  ) : (
                    <ChartArea prices={livePrices} up={up} sym={market.sym} />
                  )}
                  {isDigit && (
                    <DigitAnalysis analysis={digitAnalysis} />
                  )}
                </div>
                <div className="trade-grid__params">
                  <div className="trade-form-wrap">
                    <TradeForm
                      type={type}
                      side={side}
                      value={form}
                      set={set}
                      onSheet={setSheet}
                      payout={payout}
                      currency={CURRENCY}
                      canTrade={!!state?.auth}
                      onTrade={onTrade}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'positions' && (
            <div className="app__scroll">
              <Positions positions={state?.positions ?? []} currency={CURRENCY} />
            </div>
          )}
          {tab === 'reports' && (
            <div className="app__scroll">
              <Reports reports={state?.reports ?? []} positions={state?.positions ?? []} currency={CURRENCY} />
            </div>
          )}
          {tab === 'menu' && (
            <div className="app__scroll">
              <MenuScreen
                state={state}
                onLogin={() => setShowLogin(true)}
                onLogout={() => { engine.stop(); logout(); }}
                onSwitch={id => switchAccount(id)}
                onToast={m => engine.toast(m, 'info')}
              />
            </div>
          )}
        </main>

        <BottomNav tab={tab} setTab={setTab} openCount={openCount} />
      </div>

      {sheet === 'symbol' && (
        <SymbolSheet symbols={SYMBOLS} current={marketIdx} onSelect={i => { setMarketIdx(i); engine.selectedMarket = SYMBOLS[i].sym; setSheet(null); }} onClose={() => setSheet(null)} />
      )}

      {sheet === 'duration' && (
        <DurationSheet
          duration={form.duration}
          unit={form.unit}
          allowed={tradeType.durationUnits}
          onChange={(d, u) => set({ duration: d, unit: u })}
          onClose={() => setSheet(null)}
        />
      )}

      {sheet === 'stake' && (
        <NumberSheet
          title="Stake"
          value={form.stake}
          min={0.35}
          max={200}
          step={1}
          quick={[1, 5, 10, 25, 50, 100]}
          suffix={` ${CURRENCY}`}
          onChange={v => set({ stake: v })}
          onClose={() => setSheet(null)}
        />
      )}

      {sheet === 'multiplier' && (
        <Sheet title="Multiplier" onClose={() => setSheet(null)}>
          <div className="duration-editor">
            <div className="duration-editor__quick">
              {tradeType.multipliers.map(m => (
                <button
                  key={m}
                  className={`stake-editor__chip${form.multiplier === m ? ' is-active' : ''}`}
                  onClick={() => { set({ multiplier: m }); setSheet(null); }}
                  type="button"
                >
                  x{m}
                </button>
              ))}
            </div>
          </div>
        </Sheet>
      )}

      {sheet === 'growth' && (
        <NumberSheet
          title="Growth rate"
          value={+(form.growthRate * 100).toFixed(0)}
          min={1}
          max={5}
          step={1}
          quick={[1, 2, 3, 4, 5]}
          suffix="%"
          onChange={v => set({ growthRate: v / 100 })}
          onClose={() => setSheet(null)}
        />
      )}

      {sheet === 'barrier' && (
        <BarrierSheet
          value={form.barrier}
          spot={spot}
          decimals={pipSize(market.sym)}
          onChange={v => set({ barrier: v })}
          onClose={() => setSheet(null)}
        />
      )}

      {sheet === 'takeProfit' && (
        <NumberSheet
          title="Take profit"
          value={form.takeProfit}
          min={0}
          max={10000}
          step={1}
          quick={[10, 25, 50, 100, 250]}
          suffix={` ${CURRENCY}`}
          onChange={v => set({ takeProfit: v })}
          onClose={() => setSheet(null)}
        />
      )}

      {sheet === 'stopLoss' && (
        <NumberSheet
          title="Stop loss"
          value={form.stopLoss}
          min={0}
          max={10000}
          step={1}
          quick={[5, 10, 25, 50, 100]}
          suffix={` ${CURRENCY}`}
          onChange={v => set({ stopLoss: v })}
          onClose={() => setSheet(null)}
        />
      )}

      {typesSheet && (
        <Sheet title="Trade types" onClose={() => setTypesSheet(false)}>
          <div className="types-sheet">
            {TRADE_TYPES.map(t => (
              <button
                key={t.id}
                className={`types-sheet__row${t.id === type ? ' is-active' : ''}`}
                onClick={() => selectType(t.id)}
                type="button"
              >
                <span className="types-sheet__meta">
                  <span className="types-sheet__label">{t.label}</span>
                  <span className="types-sheet__tip">{t.tooltip}</span>
                </span>
                <span className="types-sheet__cat">{t.category.replace('_', ' ')}</span>
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {guide && (
        <Sheet title="Guide" onClose={() => setGuide(false)}>
          <div className="guide">
            <h3 className="guide__title">{tradeType.label}</h3>
            <p className="guide__body">{tradeType.tooltip}</p>
            <dl className="guide__facts">
              <div className="guide__fact">
                <dt>Market</dt><dd>{market.name}</dd>
              </div>
              <div className="guide__fact">
                <dt>Duration</dt><dd>{form.duration} {(UNIT_LABELS[form.unit] || 'Ticks').toLowerCase()}</dd>
              </div>
              <div className="guide__fact">
                <dt>Stake</dt><dd>{addComma(form.stake, 2)} {CURRENCY}</dd>
              </div>
            </dl>
          </div>
        </Sheet>
      )}

      {langOpen && (
        <Sheet title="Language" onClose={() => setLangOpen(false)}>
          <div className="lang-list">
            {[['EN', 'English'], ['PT', 'Português'], ['ES', 'Español'], ['FR', 'Français'], ['DE', 'Deutsch']].map(([code, name]) => (
              <button
                key={code}
                className={`menu-row${language === code ? ' is-active' : ''}`}
                onClick={() => { setLanguage(code); setLangOpen(false); }}
                type="button"
              >
                <span>
                  <span className="menu-row__title">{name}</span>
                  <span className="menu-row__sub">{code}</span>
                </span>
                <span className="menu-row__chevron">{language === code ? '●' : '›'}</span>
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {showLogin && (
        <Sheet title="Log in to Deriv" onClose={() => setShowLogin(false)}>
          <LoginScreen
            onSubmit={async token => { await login(token); setShowLogin(false); }}
            onClose={() => setShowLogin(false)}
          />
        </Sheet>
      )}

      {toast && <div className={`toast toast--${toast.kind || 'info'}`}>{toast.msg}</div>}
    </div>
  );
}
