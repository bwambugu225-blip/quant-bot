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
import { AccountScreen, MenuScreen, Reports } from './components/screens.jsx';
import { TRADE_TYPES, findTradeType, isDigitContract } from './lib/contracts.js';
import { SYMBOLS, createMarket, digitPayout, payoutFor, formatPrice, addComma } from './lib/market.js';

const CURRENCY = 'USD';
const DURATIONS = ['1 tick', '5 ticks', '1 minute', '5 minutes'];

let nextId = 1;

export default function App() {
  const [tab, setTab] = React.useState('home');
  const [marketIdx, setMarketIdx] = React.useState(0);
  const [tradeTypeId, setTradeTypeId] = React.useState('Rise/Fall');
  const [subContractId, setSubContractId] = React.useState('rise_fall');
  const [digit, setDigit] = React.useState(5);
  const [stake, setStake] = React.useState(10);
  const [durationIdx, setDurationIdx] = React.useState(0);
  const [balance, setBalance] = React.useState(10000);
  const [expanded, setExpanded] = React.useState(false);
  const [symbolSheet, setSymbolSheet] = React.useState(false);
  const [tradeTypeSheet, setTradeTypeSheet] = React.useState(false);
  const [stakeSheet, setStakeSheet] = React.useState(false);
  const [positions, setPositions] = React.useState([]);
  const [toast, setToast] = React.useState(null);

  const market = React.useMemo(() => createMarket(SYMBOLS[marketIdx]), [marketIdx]);
  const [tick, setTick] = React.useState(market.last());

  React.useEffect(() => {
    setTick(market.last());
    const id = setInterval(() => setTick(market.next()), 1000);
    return () => clearInterval(id);
  }, [market]);

  const parent = findTradeType(tradeTypeId);
  const sub = parent.subtypes.find(s => s.id === subContractId) ?? parent.subtypes[0];
  const isDigit = isDigitContract(subContractId);
  const labels = sub.labels;
  const payout = isDigit
    ? digitPayout(stake, sub.id, sub.id === 'over_under' ? digit : null, true)
    : payoutFor(stake, sub.id);
  const price = tick?.quote ?? market.last()?.quote ?? 0;
  const prevRef = React.useRef(price);
  const up = price >= prevRef.current;
  React.useEffect(() => {
    prevRef.current = price;
  }, [price]);

  const openCount = positions.filter(p => p.status === 'open').length;

  const selectTradeType = id => {
    const t = findTradeType(id);
    setTradeTypeId(id);
    setSubContractId(t.subtypes[0].id);
    setTradeTypeSheet(false);
    setExpanded(false);
  };

  const onTrade = (_action, sideIdx) => {
    const entry = formatPrice(price, market.decimals);
    const sideLabel = labels[sideIdx] ?? labels[0];
    const id = nextId++;
    const newPos = {
      id,
      type: sub.id,
      sideIdx,
      symbol: market.display,
      stake,
      payout,
      entry,
      sideLabel,
      status: 'open',
      pnl: null,
      openedAt: Date.now(),
    };
    setPositions(ps => [newPos, ...ps]);
    setBalance(b => +(b - stake).toFixed(2));
    setExpanded(false);
    setToast(`${sideLabel} · ${addComma(stake, 2)} ${CURRENCY} @ ${entry}`);
    setTimeout(() => setToast(null), 2600);

    // Resolve the contract shortly after: subsequent ticks decide win/loss.
    const duration = 3000 + Math.floor(Math.random() * 3000);
    setTimeout(() => {
      const settled = market.last()?.quote ?? price;
      const rose = settled >= Number(entry.replace(/,/g, ''));
      const won = isDigit ? Math.random() > 0.45 : sideIdx === 0 ? rose : !rose;
      const pnl = won ? +(payout - stake).toFixed(2) : -stake;
      setPositions(ps =>
        ps.map(p => (p.id === id ? { ...p, status: won ? 'won' : 'lost', pnl } : p))
      );
      setBalance(b => +(b + (won ? payout : 0)).toFixed(2));
      setToast(won ? `Contract ${id} won · +${addComma(payout - stake, 2)} ${CURRENCY}` : `Contract ${id} lost`);
      setTimeout(() => setToast(null), 2600);
    }, duration);
  };

  const onToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="app">
      <Header
        balance={balance}
        currency={CURRENCY}
        onAccount={() => setTab('account')}
        onDeposit={() => onToast('Deposits are disabled in this demo')}
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
              <MarketSelector market={market} price={price} up={up} onOpen={() => setSymbolSheet(true)} />
            </div>
            {isDigit && <CurrentSpot market={market} price={price} />}
            <ChartArea market={market} tick={tick} up={up} height={isDigit ? 264 : 300} />

            <div className="trade-params-dock-wrap">
              <TradeParameters
                tradeTypeId={tradeTypeId}
                subContractId={subContractId}
                onSubContract={setSubContractId}
                digit={digit}
                setDigit={setDigit}
                market={market}
                tick={tick}
                stake={stake}
                currency={CURRENCY}
                duration={DURATIONS[durationIdx]}
                setDuration={setDurationIdx}
                durations={DURATIONS}
                payout={payout}
                expanded={expanded}
                onToggle={() => setExpanded(v => !v)}
                onDuration={() => setDurationIdx(i => (i + 1) % DURATIONS.length)}
                onStake={() => setStakeSheet(true)}
              />
              <PurchaseButton labels={labels} payout={payout} currency={CURRENCY} onTrade={onTrade} />
            </div>
          </>
        )}

        {tab === 'positions' && (
          <div className="app__scroll">
            <Positions positions={positions} currency={CURRENCY} />
          </div>
        )}
        {tab === 'reports' && (
          <div className="app__scroll">
            <Reports positions={positions} currency={CURRENCY} />
          </div>
        )}
        {tab === 'menu' && (
          <div className="app__scroll">
            <MenuScreen onToast={onToast} />
          </div>
        )}
        {tab === 'account' && (
          <div className="app__scroll">
            <AccountScreen balance={balance} currency={CURRENCY} onToast={onToast} />
          </div>
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} openCount={openCount} />

      {symbolSheet && (
        <SymbolSheet
          symbols={SYMBOLS}
          current={marketIdx}
          onSelect={i => {
            setMarketIdx(i);
            setSymbolSheet(false);
          }}
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
                <button key={v} className="stake-editor__chip" onClick={() => setStake(v)} type="button">
                  {v}
                </button>
              ))}
            </div>
            <div className="stake-editor__steppers">
              <button onClick={() => setStake(s => Math.max(0.35, +(s - 1).toFixed(2)))} type="button">− 1.00</button>
              <button onClick={() => setStake(s => +(s + 1).toFixed(2))} type="button">+ 1.00</button>
              <button onClick={() => setStake(s => +(s + 10).toFixed(2))} type="button">+ 10.00</button>
            </div>
            <button className="stake-editor__done" onClick={() => setStakeSheet(false)} type="button">Done</button>
          </div>
        </Sheet>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
