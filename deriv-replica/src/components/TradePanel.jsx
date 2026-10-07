import React, { useMemo } from 'react';
import {
  TradeTypesUpsAndDownsRiseIcon,
  TradeTypesUpsAndDownsFallIcon,
  TradeTypesDigitsOverIcon,
  TradeTypesDigitsUnderIcon,
  TradeTypesDigitsMatchesIcon,
  TradeTypesDigitsDiffersIcon,
} from '@deriv/quill-icons';
import { digitDistribution } from '../lib/market.js';

export default function TradePanel({
  tradeTab,
  setTradeTab,
  contractType,
  setContractType,
  stake,
  setStake,
  duration,
  setDuration,
  timeframes,
  digit,
  setDigit,
  market,
  tick,
  payout,
}) {
  const dist = useMemo(() => digitDistribution(market), [tick, market]);

  return (
    <div className="trade-panel">
      <div className="trade-tabs">
        <button className={`trade-tab${tradeTab === 0 ? ' active' : ''}`} onClick={() => setTradeTab(0)}>
          Rise/Fall
        </button>
        <button className={`trade-tab${tradeTab === 1 ? ' active' : ''}`} onClick={() => setTradeTab(1)}>
          Digits
        </button>
      </div>

      <div className="panel-scroll">
        {tradeTab === 0 && <RiseFall contractType={contractType} setContractType={setContractType} />}
        {tradeTab === 1 && (
          <Digits
            contractType={contractType}
            setContractType={setContractType}
            digit={digit}
            setDigit={setDigit}
            dist={dist}
          />
        )}

        <div className="field-label">Duration</div>
        <div className="contract-row">
          {timeframes.map(tf => (
            <button
              key={tf}
              className={`contract-chip${duration === tf ? ' selected' : ''}`}
              onClick={() => setDuration(tf)}
              style={{ minWidth: 44 }}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="grid-2">
          <div className="stat-box">
            <div className="lbl">Stake</div>
            <div className="stepper">
              <button onClick={() => setStake(s => Math.max(0.35, +(s - 1).toFixed(2)))}>−</button>
              <input
                value={stake}
                onChange={e => setStake(Math.max(0, Number(e.target.value) || 0))}
                inputMode="decimal"
              />
              <button onClick={() => setStake(s => +(s + 1).toFixed(2))}>+</button>
            </div>
          </div>
          <div className="stat-box">
            <div className="lbl">Payout</div>
            <div className="val green">${payout.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiseFall({ contractType, setContractType }) {
  const types = [
    { id: 'rise_fall', label: 'Rise/Fall', Icon: TradeTypesUpsAndDownsRiseIcon },
  ];
  return (
    <>
      <div className="field-label">Trade type</div>
      <div className="contract-row">
        <button
          className={`contract-chip${contractType === 'rise_fall' ? ' selected' : ''}`}
          onClick={() => setContractType('rise_fall')}
        >
          <TradeTypesUpsAndDownsRiseIcon className="chip-ico" width={20} height={20} fill="currentColor" />
          Rise/Fall
        </button>
      </div>
    </>
  );
}

function Digits({ contractType, setContractType, digit, setDigit, dist }) {
  const maxCount = Math.max(...dist.counts, 1);
  const minCount = Math.min(...dist.counts);
  const maxCountReal = Math.max(...dist.counts);

  const opts = [
    { id: 'digit_over', label: 'Over', Icon: TradeTypesDigitsOverIcon },
    { id: 'digit_under', label: 'Under', Icon: TradeTypesDigitsUnderIcon },
    { id: 'digit_match', label: 'Matches', Icon: TradeTypesDigitsMatchesIcon },
    { id: 'digit_diff', label: 'Differs', Icon: TradeTypesDigitsDiffersIcon },
  ];

  const needDigit = contractType === 'digit_over' || contractType === 'digit_under' || contractType === 'digit_match' || contractType === 'digit_diff';

  return (
    <>
      <div className="field-label">Trade type</div>
      <div className="contract-row">
        {opts.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`contract-chip${contractType === id ? ' selected' : ''}`}
            onClick={() => setContractType(id)}
          >
            <Icon className="chip-ico" width={20} height={20} fill="currentColor" />
            {label}
          </button>
        ))}
      </div>

      <div className="field-label">Last digit prediction</div>
      <div className="digit-pick">
        {Array.from({ length: 10 }, (_, d) => (
          <button
            key={d}
            className={digit === d ? 'selected' : ''}
            onClick={() => setDigit(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="field-label">Digit distribution</div>
      <div className="dist">
        {dist.dist.map((pct, d) => {
          const h = maxCountReal ? (dist.counts[d] / maxCountReal) * 100 : 0;
          const cls = dist.counts[d] === maxCountReal ? 'hi' : dist.counts[d] === minCount ? 'lo' : 'mid';
          return (
            <div key={d} className="dist-col" title={`${d}: ${pct.toFixed(1)}%`}>
              <div className={`dist-bar ${cls}`} style={{ height: `${Math.max(6, h)}%` }} />
              <span className="dist-digit">{d}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
