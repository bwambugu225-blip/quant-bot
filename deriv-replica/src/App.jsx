import React from 'react';
import Header from './components/Header.jsx';
import TradeTypesBar from './components/TradeTypesBar.jsx';
import MarketSelector from './components/MarketSelector.jsx';
import ChartArea from './components/ChartArea.jsx';
import CurrentSpot from './components/CurrentSpot.jsx';
import TradeParameters from './components/TradeParameters.jsx';
import PurchaseButton from './components/PurchaseButton.jsx';
import BottomNav from './components/BottomNav.jsx';
import Positions from './components/Positions.jsx';
import SymbolSheet from './components/SymbolSheet.jsx';
import Sheet from './components/Sheet.jsx';
import { AccountScreen, MenuScreen, Reports, LoginScreen, EnginePanel } from './components/screens.jsx';
import { TRADE_TYPES, findTradeType, isDigitContract } from './lib/contracts.js';
import { SYMBOLS, TF_LIST, isDigitSymbol } from './lib/marketStore.js';
import { addComma } from './lib/format.js';
import { useEngine } from './lib/useEngine.js';

const CURRENCY = 'USD';
// Digit contract types sent to Deriv, keyed by sub-contract id + side index.
const DIGIT_CONTRACT = {
  match_diff: ['DIGITMATCH', 'DIGITDIFF'],
  over_under: ['DIGITOVER', 'DIGITUNDER'],
  even_odd: ['DIGITEVEN', 'DIGITODD'],
};

export default function App() {
  const { engine, state, tick, logs, toast, login, logout, reconnectMarket } = useEngine();

  const [tab, setTab] = React.useState('home');
  const [marketIdx, setMarketIdx] = React.useState(0);
  const [tradeTypeId, setTradeTypeId] = React.useState('Rise/Fall');
  const [subContractId, setSubContractId] = React.useState('rise_fall');
  const [digit, setDigit] = React.useState(5);
  const [durationIdx, setDurationIdx] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [symbolSheet, setSymbolSheet] = React.useState(false);
  const [tradeTypeSheet, setTradeTypeSheet] = React.useState(false);
  const [stakeSheet, setStakeSheet] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  const market = SYMBOLS[marketIdx];
  const parent = findTradeType(tradeTypeId);
  const sub = parent.subtypes.find(s => s.id === subContractId) ?? parent.subtypes[0];
  const isDigit = isDigitContract(subContractId);

  const price = React.useMemo(() => {
    if (tick?.sym === market.sym) return tick.price;
    return engine.store.lastPrice[market.sym] ?? 0;
  }, [tick, market.sym, engine]);
  const lastDigit = React.useMemo(
    () => (tick?.sym === market.sym ? tick.digit : engine.store.lastDigit(market.sym)),
    [tick, market.sym, engine]
  );
  const livePrices = React.useMemo(
    () => (tick && tick.sym === market.sym ? engine.store.livePrices(market.sym) : engine.store.livePrices(market.sym)),
    [tick, market.sym, engine]
  );
  const digHist = engine.store.digHist[market.sym] || [];

  const prevRef = React.useRef(price);
  const up = price >= prevRef.current;
  React.useEffect(() => { prevRef.current = price; }, [price]);

  // Keep the engine's selected market in sync with the UI selection.
  React.useEffect(() => { engine.selectedMarket = market.sym; }, [engine, market.sym]);

  const stake = isDigit ? engine.dgStake : engine.rfStake;
  const payout = React.useMemo(() => {
    if (isDigit) {
      // Real-ish Deriv digit odds for the informational payout figure.
      if (subContractId === 'match_diff') return +(stake * 1.94).toFixed(2);
      if (subContractId === 'even_odd') return +(stake * 1.96).toFixed(2);
      if (subContractId === 'over_under') {
        const p = digit <= 4 ? (9 - digit) / 10 : (digit + 1) / 10;
        return +(stake / p).toFixed(2);
      }
      return +(stake * 1.94).toFixed(2);
    }
    return +(stake * 1.94).toFixed(2);
  }, [stake, isDigit, subContractId, digit]);

  const durations = ['1 tick', '2 ticks', '3 ticks', '5 ticks', '10 ticks'];

  const selectTradeType = id => {
    const t = findTradeType(id);
    setTradeTypeId(id);
    setSubContractId(t.subtypes[0].id);
    setTradeTypeSheet(false);
    setExpanded(false);
    // Selecting a digit trade type flips the engine to digit mode; directional
    // types return it to Rise/Fall signalled trading.
    engine.setMode(isDigitContract(t.subtypes[0].id) ? 'DIGITS' : 'RISEFALL');
  };

  const onTrade = (_action, sideIdx) => {
    if (!state?.auth) { setShowLogin(true); return; }
    if (isDigit) {
      const [over, under] = DIGIT_CONTRACT[subContractId];
      const type = sideIdx === 0 ? over : under === undefined ? over : under;
      const barrier = subContractId === 'match_diff' || subContractId === 'over_under' ? digit : null;
      engine.placeDigitManual(type, barrier);
    } else {
      engine.placeManualRF(sideIdx === 0 ? 'RISE' : 'FALL');
    }
    setExpanded(false);
  };

  const onSelectSymbol = i => {
    setMarketIdx(i);
    engine.selectedMarket = SYMBOLS[i].sym;
    setSymbolSheet(false);
  };

  const openCount = state?.positions?.length ?? 0;

  return (
    <div className="app">
      <Header
        balance={state?.balance ?? 0}
        currency={CURRENCY}
        accountType={state?.accountType}
        connected={state?.auth}
        onAccount={() => setTab('account')}
        onDeposit={() => setShowLogin(true)}
      />

      <main className="app__main">
        {tab === 'home' && (
          <>
            <TradeTypesBar
              selectedId={tradeTypeId}
              onSelect={selectTradeType}
              onViewAll={() => setTradeTypeSheet(true)}
            />
            <div className="home__row">
              <MarketSelector
                display={market.name}
                price={price}
                up={up}
                onOpen={() => setSymbolSheet(true)}
              />
            </div>
            <div className="home__toolbar">
              <TimeframeChips
                value={engine.store.selectedTf || '5s'}
                onChange={tf => { engine.store.setSelectedTf(tf); engine.emit('state', engine.snapshot()); }}
              />
              <button className="home__refresh" onClick={reconnectMarket} type="button" title="Reconnect market feed">⟳</button>
            </div>
            {isDigit && <CurrentSpot price={price} lastDigit={lastDigit} />}
            <ChartArea prices={livePrices} up={up} height={isDigit ? 264 : 300} />

            <EnginePanel
              state={state}
              engine={engine}
              onLogin={() => setShowLogin(true)}
              onSetStake={(kind, v) => engine.setStake(kind, v)}
            />

            <div className="trade-params-dock-wrap">
              <TradeParameters
                tradeTypeId={tradeTypeId}
                subContractId={subContractId}
                onSubContract={id => { setSubContractId(id); engine.setMode(isDigitContract(id) ? 'DIGITS' : 'RISEFALL'); }}
                digit={digit}
                setDigit={setDigit}
                digHist={digHist}
                stake={stake}
                currency={CURRENCY}
                duration={durations[durationIdx]}
                setDuration={setDurationIdx}
                durations={durations}
                payout={payout}
                expanded={expanded}
                onToggle={() => setExpanded(v => !v)}
                onDuration={() => setDurationIdx(i => (i + 1) % durations.length)}
                onStake={() => setStakeSheet(true)}
              />
              <PurchaseButton labels={sub.labels} payout={payout} currency={CURRENCY} onTrade={onTrade} />
            </div>
          </>
        )}

        {tab === 'positions' && (
          <div className="app__scroll">
            <Positions positions={state?.positions ?? []} currency={CURRENCY} />
          </div>
        )}
        {tab === 'reports' && (
          <div className="app__scroll">
            <Reports reports={state?.reports ?? []} currency={CURRENCY} />
          </div>
        )}
        {tab === 'menu' && (
          <div className="app__scroll">
            <MenuScreen logs={logs} engine={engine} onToast={m => engine.toast(m, 'info')} />
          </div>
        )}
        {tab === 'account' && (
          <div className="app__scroll">
            <AccountScreen
              state={state}
              logs={logs}
              onLogin={() => setShowLogin(true)}
              onLogout={() => { engine.stop(); logout(); }}
            />
          </div>
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} openCount={openCount} />

      {symbolSheet && (
        <SymbolSheet
          symbols={SYMBOLS}
          current={marketIdx}
          onSelect={onSelectSymbol}
          onClose={() => setSymbolSheet(false)}
        />
      )}

      {tradeTypeSheet && (
        <Sheet title="Trade types" onClose={() => setTradeTypeSheet(false)}>
          {TRADE_TYPES.map(t => (
            <button
              key={t.id}
              className={`sheet-row${t.id === tradeTypeId ? ' is-selected' : ''}`}
              onClick={() => selectTradeType(t.id)}
              type="button"
            >
              <span className="sheet-row__main">
                <span className="sheet-row__title">{t.label}</span>
                <span className="sheet-row__sub">{t.tooltip}</span>
              </span>
              {t.fire && <span className="sheet-row__fire">🔥</span>}
            </button>
          ))}
        </Sheet>
      )}

      {stakeSheet && (
        <Sheet title="Stake" onClose={() => setStakeSheet(false)}>
          <div className="stake-editor">
            <div className="stake-editor__value">
              {addComma(stake, 2)} {CURRENCY}
            </div>
            <div className="stake-editor__quick">
              {[1, 5, 10, 25, 50, 100].map(v => (
                <button
                  key={v}
                  className="stake-editor__chip"
                  onClick={() => engine.setStake(isDigit ? 'dg' : 'rf', v)}
                  type="button"
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="stake-editor__steppers">
              <button onClick={() => engine.setStake(isDigit ? 'dg' : 'rf', stake - 1)} type="button">− 1.00</button>
              <button onClick={() => engine.setStake(isDigit ? 'dg' : 'rf', stake + 1)} type="button">+ 1.00</button>
              <button onClick={() => engine.setStake(isDigit ? 'dg' : 'rf', stake + 10)} type="button">+ 10.00</button>
            </div>
            <button className="stake-editor__done" onClick={() => setStakeSheet(false)} type="button">Done</button>
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

function TimeframeChips({ value, onChange }) {
  return (
    <div className="tf-chips">
      {TF_LIST.map(tf => (
        <button
          key={tf}
          className={`tf-chip${tf === value ? ' is-active' : ''}`}
          onClick={() => onChange(tf)}
          type="button"
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
