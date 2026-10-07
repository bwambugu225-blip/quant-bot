import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createMarket, SYMBOLS, formatMoney, payoutFor, lastDigit } from './lib/market.js';
import Header from './components/Header.jsx';
import SymbolSheet from './components/SymbolSheet.jsx';
import Chart from './components/Chart.jsx';
import TradePanel from './components/TradePanel.jsx';
import PurchaseButtons from './components/PurchaseButtons.jsx';
import BottomNav from './components/BottomNav.jsx';
import Positions from './components/Positions.jsx';
import Settings from './components/Settings.jsx';

const TIMEFRAMES = ['1t', '1m', '2m', '5m', '15m', '30m', '1h', '1d'];

export default function App() {
  const [symbolIdx, setSymbolIdx] = useState(4);
  const [symbolSheetOpen, setSymbolSheetOpen] = useState(false);
  const [marketTick, setMarketTick] = useState(0);
  const [tab, setTab] = useState(0);
  const [tradeTab, setTradeTab] = useState(0); // 0 rise/fall, 1 digits
  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState('1t');
  const [digit, setDigit] = useState(5);
  const [contractType, setContractType] = useState('rise_fall'); // rise_fall | digit_over | ...
  const [positions, setPositions] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [balance, setBalance] = useState(10000);

  const marketRef = useRef(createMarket(SYMBOLS[symbolIdx]));
  const [market, setMarket] = useState(marketRef.current);

  useEffect(() => {
    marketRef.current = createMarket(SYMBOLS[symbolIdx]);
    setMarket(marketRef.current);
    setMarketTick(t => t + 1);
  }, [symbolIdx]);

  useEffect(() => {
    const id = setInterval(() => {
      marketRef.current.next();
      setMarketTick(t => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [market]);

  const last = market.last();
  const prev = market.ticks[market.ticks.length - 2];
  const up = !prev || last.quote >= prev.quote;

  const payout = useMemo(() => payoutFor(stake, contractType), [stake, contractType]);

  const pushToast = msg => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  };

  const placeTrade = side => {
    const isBuy = side === 'buy';
    const entry = market.last().quote;
    const type = contractType;
    const id = `C-${Math.floor(1000000 + Math.random() * 8999999)}`;
    const pos = {
      id,
      type,
      symbol: market.display,
      stake,
      payout,
      entry,
      side,
      status: 'open',
      openedAt: Date.now(),
      digit,
    };
    setPositions(p => [pos, ...p]);
    setBalance(b => +(b - stake).toFixed(2));
    pushToast(`${isBuy ? 'Rise' : 'Fall'} trade placed · ${formatMoney(stake)}`);

    // Settle after a short simulated contract window.
    setTimeout(() => {
      const exit = marketRef.current.last().quote;
      const won = type.startsWith('digit')
        ? evalDigit(type, digit, lastDigit(exit, marketRef.current.decimals))
        : isBuy
        ? exit >= entry
        : exit <= entry;
      const pnl = won ? payout - stake : -stake;
      setPositions(p =>
        p.map(x => (x.id === id ? { ...x, status: won ? 'won' : 'lost', pnl, exit } : x))
      );
      if (won) setBalance(b => +(b + payout).toFixed(2));
      pushToast(won ? `Contract ${id} won · +${formatMoney(pnl)}` : `Contract ${id} lost · ${formatMoney(pnl)}`);
    }, 12000);
  };

  return (
    <div className="app-shell">
      <Header
        balance={balance}
        onDeposit={() => pushToast('Deposit is disabled in this demo')}
      />

      <div className="symbol-bar">
        <button className="symbol-btn" onClick={() => setSymbolSheetOpen(true)}>
          {market.display} <span className="chev">▾</span>
        </button>
        <span className="price-tag" style={{ color: up ? '#4bb4b3' : '#ec3f3f' }}>
          {last.quote.toLocaleString('en-US', { minimumFractionDigits: market.decimals, maximumFractionDigits: market.decimals })}
        </span>
      </div>

      <Chart market={market} tick={marketTick} up={up} />

      {tab === 0 && (
        <>
          <TradePanel
            tradeTab={tradeTab}
            setTradeTab={t => {
              setTradeTab(t);
              setContractType(t === 0 ? 'rise_fall' : 'digit_over');
            }}
            contractType={contractType}
            setContractType={setContractType}
            stake={stake}
            setStake={setStake}
            duration={duration}
            setDuration={setDuration}
            timeframes={TIMEFRAMES}
            digit={digit}
            setDigit={setDigit}
            market={market}
            tick={marketTick}
            payout={payout}
          />
          <PurchaseButtons
            contractType={contractType}
            payout={payout}
            stake={stake}
            onTrade={placeTrade}
          />
        </>
      )}

      {tab === 1 && <Positions positions={positions} />}
      {tab === 2 && <Account balance={balance} onToast={pushToast} />}
      {tab === 3 && <Settings onToast={pushToast} />}

      <BottomNav tab={tab} setTab={setTab} openCount={positions.filter(p => p.status === 'open').length} />

      {symbolSheetOpen && (
        <SymbolSheet
          symbols={SYMBOLS}
          current={symbolIdx}
          onSelect={i => {
            setSymbolIdx(i);
            setSymbolSheetOpen(false);
          }}
          onClose={() => setSymbolSheetOpen(false)}
        />
      )}

      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className="toast">{t.msg}</div>
        ))}
      </div>
    </div>
  );
}

function evalDigit(type, digit, lastD) {
  switch (type) {
    case 'digit_over': return lastD > digit;
    case 'digit_under': return lastD < digit;
    case 'digit_match': return lastD === digit;
    case 'digit_diff': return lastD !== digit;
    default: return false;
  }
}

function Account({ balance, onToast }) {
  return (
    <div className="screen">
      <div className="sheet-title" style={{ padding: '0 0 12px' }}>My account</div>
      <div className="stat-box" style={{ marginBottom: 12 }}>
        <div className="lbl">Demo account balance</div>
        <div className="val">${balance.toFixed(2)} USD</div>
      </div>
      <div className="sheet-row" onClick={() => onToast('Account switching is disabled in this demo')}>
        <div>
          <div>Switch account</div>
          <div className="sub">Move between Demo and Real</div>
        </div>
      </div>
      <div className="sheet-row" onClick={() => onToast('API token management is disabled in this demo')}>
        <div>
          <div>API token</div>
          <div className="sub">Manage your Deriv API access</div>
        </div>
      </div>
      <div className="sheet-row" onClick={() => onToast('This is a Deriv interface replica for demonstration')}>
        <div>
          <div>About</div>
          <div className="sub">Interface replica · not affiliated with Deriv</div>
        </div>
      </div>
    </div>
  );
}
