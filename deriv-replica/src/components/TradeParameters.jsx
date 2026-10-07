import React from 'react';
import { SegmentedControlSingleChoice } from '@deriv-com/quill-ui';
import { findTradeType, isDigitContract } from '../lib/contracts.js';
import { addComma, digitDistribution } from '../lib/market.js';

// Deriv's trade-parameter dock. It stacks:
//   1. TradeTypeTabs (sub-contract segmented control)
//   2. LastDigitPrediction (digit-based only)
//   3. Duration + Stake ParamBoxes
// and can collapse to a single-row minimized state.
export default function TradeParameters({
  tradeTypeId,
  subContractId,
  onSubContract,
  digit,
  setDigit,
  market,
  tick,
  stake,
  currency,
  duration,
  payout,
  expanded,
  onToggle,
  onDuration,
  onStake,
}) {
  const parent = findTradeType(tradeTypeId);
  const subs = parent.subtypes;
  const isDigit = isDigitContract(subContractId);

  return (
    <div className="trade-params-dock">
      <button className="trade-params__handle" onClick={onToggle} type="button" aria-label="Toggle parameters">
        <svg width="40" height="4" viewBox="0 0 40 4">
          <rect width="40" height="4" rx="2" fill="var(--color-surface-border, #2a2e39)" />
        </svg>
      </button>

      <div className={`trade-params__options${expanded ? ' is-expanded' : ''}`}>
        {subs.length > 1 && (
          <div className="param-box param-box--segmented">
            <SegmentedControlSingleChoice
              className="param-segmented"
              hasContainerWidth
              options={subs.map(s => ({ label: s.label }))}
              selectedItemIndex={subs.findIndex(s => s.id === subContractId)}
              onChange={i => onSubContract(subs[i].id)}
            />
          </div>
        )}

        {isDigit && (
          <DigitPrediction
            subContractId={subContractId}
            digit={digit}
            setDigit={setDigit}
            market={market}
            tick={tick}
            expanded={expanded}
          />
        )}

        <div className="param-box param-box--field" onClick={onDuration} role="button">
          <span className="param-box__label">Duration</span>
          <span className="param-box__value">{duration}</span>
        </div>

        <div className="param-box param-box--field" onClick={onStake} role="button">
          <span className="param-box__label">Stake</span>
          <span className="param-box__value">
            {addComma(stake, 2)} {currency}
          </span>
        </div>

        <div className="param-box">
          <span className="param-box__label">Payout</span>
          <span className="param-box__value param-box__value--green">
            {addComma(payout, 2)} {currency}
          </span>
        </div>
      </div>
    </div>
  );
}

function DigitPrediction({ subContractId, digit, setDigit, market, tick, expanded }) {
  const { counts, dist } = React.useMemo(() => digitDistribution(market), [market, tick]);
  const max = Math.max(...counts, 1);

  if (expanded) {
    return (
      <div className="param-box param-box--dist">
        <span className="param-box__label">Last digit prediction</span>
        <div className="dist-bars">
          {dist.map((pct, d) => (
            <div key={d} className="dist-bars__col">
              <div className="dist-bars__bar" style={{ height: `${(pct / 30) * 100}%` }} />
              <span className="dist-bars__digit">{d}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="param-box param-box--digit">
      <span className="param-box__label">Last digit prediction</span>
      <div className="digit-picker">
        {dist.map((pct, d) => (
          <button
            key={d}
            className={`digit-picker__cell${d === digit ? ' is-selected' : ''}`}
            onClick={() => setDigit(d)}
            type="button"
          >
            <span className="digit-picker__count">{Math.round(pct)}%</span>
            <span
              className={`digit-picker__bar${counts[d] === max ? ' is-high' : ''}`}
              style={{ height: `${Math.max(6, (counts[d] / max) * 34)}px` }}
            />
            <span className="digit-picker__digit">{d}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
