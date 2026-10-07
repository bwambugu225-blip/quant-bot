import React from 'react';
import { addComma } from '../lib/format.js';
import { findTradeType } from '../lib/contracts.js';

// Trade-tab parameter dock. Renders exactly the inputs the selected product
// needs: Rise/Fall gets duration + stake + "allow equals"; Higher/Lower and
// Touch get a price barrier; digit products get a last-digit barrier;
// Accumulators get a growth rate; Multipliers get a multiplier and risk
// controls. `value` is the shared form state owned by App.

const UNIT_LABELS = { t: 'Ticks', s: 'Seconds', m: 'Minutes', h: 'Hours', d: 'Days' };

function Field({ label, value, onClick, accent }) {
  return (
    <button className="param-box param-box--field" onClick={onClick} type="button">
      <span className="param-box__label">{label}</span>
      <span className={`param-box__value${accent ? ' param-box__value--accent' : ''}`}>{value}</span>
    </button>
  );
}

export default function TradeForm({ type, side, value, set, onSheet, payout, currency, canTrade, onTrade }) {
  const t = findTradeType(type);
  const has = k => t.inputs.includes(k);
  const twoSided = t.sides.length > 1;
  const activeSide = side || 'up';
  const upLabel = t.sides[0];
  const downLabel = t.sides[1] || t.sides[0];

  return (
    <div className="trade-form">
      {has('duration') && (
        <div className="trade-form__row">
          <Field
            label="Duration"
            value={`${value.duration} ${(UNIT_LABELS[value.unit] || 'Ticks').toLowerCase()}`}
            onClick={() => onSheet('duration')}
          />
          <Field
            label="Stake"
            value={`${addComma(value.stake, 2)} ${currency}`}
            onClick={() => onSheet('stake')}
          />
          <div className="param-box">
            <span className="param-box__label">Payout</span>
            <span className="param-box__value param-box__value--green">
              {payout == null ? '—' : `${addComma(payout, 2)} ${currency}`}
            </span>
          </div>
        </div>
      )}

      {!has('duration') && (
        <div className="trade-form__row">
          <Field
            label="Stake"
            value={`${addComma(value.stake, 2)} ${currency}`}
            onClick={() => onSheet('stake')}
          />
          {has('multiplier') && (
            <Field
              label="Multiplier"
              value={`x${value.multiplier}`}
              accent
              onClick={() => onSheet('multiplier')}
            />
          )}
          {has('growthRate') && (
            <Field
              label="Growth rate"
              value={`${(value.growthRate * 100).toFixed(0)}%`}
              accent
              onClick={() => onSheet('growth')}
            />
          )}
          <div className="param-box">
            <span className="param-box__label">Payout</span>
            <span className="param-box__value param-box__value--green">
              {payout == null ? '—' : `${addComma(payout, 2)} ${currency}`}
            </span>
          </div>
        </div>
      )}

      {has('digit') && (
        <div className="digit-picker">
          <span className="digit-picker__label">
            {type === 'over_under' ? 'Last digit prediction' : 'Last digit'}
          </span>
          <div className="digit-picker__row">
            {Array.from({ length: 10 }, (_, d) => (
              <button
                key={d}
                className={`digit-picker__btn${value.digit === d ? ' is-active' : ''}`}
                onClick={() => set({ digit: d })}
                type="button"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {has('barrier') && (
        <button className="barrier-field" onClick={() => onSheet('barrier')} type="button">
          <span className="barrier-field__label">Barrier</span>
          <span className="barrier-field__value">{value.barrier}</span>
          <span className="barrier-field__hint">± offset from the current spot</span>
        </button>
      )}

      {has('risk') && (
        <div className="trade-form__row">
          <Field
            label="Take profit"
            value={value.takeProfit > 0 ? `+${addComma(value.takeProfit, 2)}` : 'Not set'}
            onClick={() => onSheet('takeProfit')}
          />
          <Field
            label="Stop loss"
            value={value.stopLoss > 0 ? `-${addComma(value.stopLoss, 2)}` : 'Not set'}
            onClick={() => onSheet('stopLoss')}
          />
        </div>
      )}

      {has('equals') && (
        <label className="trade-form__equals">
          <span>
            <span className="trade-form__equals-title">Allow equals</span>
            <span className="trade-form__equals-sub">Win if the exit spot equals the entry spot</span>
          </span>
          <input type="checkbox" checked={value.equals} onChange={e => set({ equals: e.target.checked })} />
        </label>
      )}

      {has('cancellation') && (
        <div className="trade-form__unit">
          <span className="trade-form__unit-label">Deal cancellation</span>
          <div className="menu-seg menu-seg--wide">
            {[['', 'None'], ['5m', '5m'], ['10m', '10m'], ['15m', '15m'], ['30m', '30m'], ['60m', '60m']].map(([v, l]) => (
              <button
                key={l}
                className={`menu-seg__btn${(value.cancellation || '') === v ? ' is-active' : ''}`}
                onClick={() => set({ cancellation: v })}
                type="button"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="trade-form__actions">
        {twoSided ? (
          <>
            <button
              className={`purchase-button purchase-button--rise${activeSide === 'up' ? ' is-selected' : ''}`}
              onClick={() => onTrade('up')}
              type="button"
              disabled={!canTrade}
            >
              <span className="purchase-button__inner">
                <span>{upLabel}</span>
                <span>{payout == null ? '—' : `${addComma(payout, 2)} ${currency}`}</span>
              </span>
            </button>
            <button
              className={`purchase-button purchase-button--fall${activeSide === 'down' ? ' is-selected' : ''}`}
              onClick={() => onTrade('down')}
              type="button"
              disabled={!canTrade}
            >
              <span className="purchase-button__inner">
                <span>{downLabel}</span>
                <span>{payout == null ? '—' : `${addComma(payout, 2)} ${currency}`}</span>
              </span>
            </button>
          </>
        ) : (
          <button
            className="purchase-button purchase-button--single purchase-button--rise"
            onClick={() => onTrade('up')}
            type="button"
            disabled={!canTrade}
          >
            <span className="purchase-button__inner">
              <span>{t.sides[0]}</span>
              <span>{payout == null ? '—' : `${addComma(payout, 2)} ${currency}`}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
