import React from 'react';
import {
  INDICATORS, OPERATORS, defaultParamsFor, describeStrategy, validateStrategy,
  TEMPLATE_MENU, ALL_TEMPLATES,
} from '../lib/strategyBuilder.js';
import { TIMEFRAMES, TICK_BAR_SIZES } from '../lib/marketStore.js';
import { TRADE_TYPES, findTradeType } from '../lib/contracts.js';
import { CURRENCY, stakeLabel, stakeInKes, stakeFromKes, minStakeKes, money } from '../lib/format.js';

const uid = () => Math.random().toString(36).slice(2, 9);

// A blank leaf condition.
export function newCondition() {
  return { left: { kind: 'indicator', name: 'rsi', params: { period: 14 }, output: 'value' }, op: 'gt', right: { kind: 'const', value: 50 } };
}

// ── operand editor: indicator + params + output, price field, or a constant ──
function OperandEditor({ value, onChange }) {
  const kind = value.kind || 'indicator';
  const ind = INDICATORS[value.name];
  const outputs = ind?.outputs || ['value'];
  const params = ind?.params || [];

  const setKind = k => {
    if (k === 'indicator') onChange({ kind: 'indicator', name: value.name || 'rsi', params: value.params || defaultParamsFor(value.name || 'rsi'), output: value.output || 'value' });
    else if (k === 'price') onChange({ kind: 'price', field: 'close' });
    else onChange({ kind: 'const', value: value.value ?? 0 });
  };

  const setName = name => onChange({ kind: 'indicator', name, params: defaultParamsFor(name), output: INDICATORS[name].outputs[0] });

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
      <select className="sel" value={kind} onChange={e => setKind(e.target.value)}>
        <option value="indicator">Indicator</option>
        <option value="price">Price</option>
        <option value="const">Value</option>
      </select>

      {kind === 'indicator' && <>
        <select className="sel" value={value.name} onChange={e => setName(e.target.value)}>
          {Object.entries(INDICATORS).map(([id, i]) => <option key={id} value={id}>{i.label}</option>)}
        </select>
        {outputs.length > 1 && (
          <select className="sel" value={value.output || outputs[0]} onChange={e => onChange({ ...value, output: e.target.value })}>
            {outputs.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
        {params.map(p => (
          <label className="param" key={p.key}>
            <span className="param__lbl">{p.label}</span>
            <input className="num" type="number" min={p.min} max={p.max} value={(value.params || {})[p.key] ?? p.def}
              onChange={e => onChange({ ...value, params: { ...(value.params || {}), [p.key]: +e.target.value } })} />
          </label>
        ))}
      </>}

      {kind === 'price' && (
        <select className="sel" value={value.field || 'close'} onChange={e => onChange({ kind: 'price', field: e.target.value })}>
          {['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'].map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      )}

      {kind === 'const' && (
        <input className="num" type="number" value={value.value ?? 0} onChange={e => onChange({ kind: 'const', value: +e.target.value })} />
      )}
    </div>
  );
}

// ── a single condition row ─────────────────────────────────────────────────
function ConditionRow({ cond, onChange, onRemove }) {
  const op = OPERATORS.find(o => o.id === cond.op) || OPERATORS[0];
  const needsRight = op.arity === 2;
  return (
    <div className="cond">
      <OperandEditor value={cond.left} onChange={left => onChange({ ...cond, left })} />
      <select className="sel" value={cond.op} onChange={e => onChange({ ...cond, op: e.target.value })}>
        {OPERATORS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      {needsRight && <OperandEditor value={cond.right} onChange={right => onChange({ ...cond, right })} />}
      <button className="icon-btn" onClick={onRemove} title="Remove condition" type="button">×</button>
    </div>
  );
}

// ── recursive logic group: AND/OR with nested groups ───────────────────────
function GroupEditor({ group, onChange, onRemove, depth = 0 }) {
  const setChild = (i, child) => {
    const conditions = group.conditions.slice();
    conditions[i] = child;
    onChange({ ...group, conditions });
  };
  const removeChild = i => onChange({ ...group, conditions: group.conditions.filter((_, j) => j !== i) });
  const addCond = () => onChange({ ...group, conditions: [...group.conditions, newCondition()] });
  const addGroup = () => onChange({ ...group, conditions: [...group.conditions, { logic: 'AND', conditions: [newCondition()] }] });

  return (
    <div className={`group${group.logic === 'OR' ? ' group--or' : ''}`} style={{ marginLeft: depth ? 8 : 0 }}>
      <div className="group__head">
        <div className={`logic${group.logic === 'OR' ? ' logic--or' : ''}`}>
          <button type="button" className={group.logic !== 'OR' ? 'is-active' : ''} onClick={() => onChange({ ...group, logic: 'AND' })}>AND</button>
          <button type="button" className={group.logic === 'OR' ? 'is-active' : ''} onClick={() => onChange({ ...group, logic: 'OR' })}>OR</button>
        </div>
        <span style={{ color: 'var(--text-mute)', fontSize: 11 }}>
          {group.logic === 'OR' ? 'any of' : 'all of'} {group.conditions.length} {group.conditions.length === 1 ? 'rule' : 'rules'}
        </span>
        {onRemove && <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={onRemove} title="Remove group" type="button">×</button>}
      </div>

      {group.conditions.map((child, i) => (
        Array.isArray(child.conditions)
          ? <GroupEditor key={i} group={child} depth={depth + 1} onChange={c => setChild(i, c)} onRemove={() => removeChild(i)} />
          : <ConditionRow key={i} cond={child} onChange={c => setChild(i, c)} onRemove={() => removeChild(i)} />
      ))}

      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <button className="add-btn" onClick={addCond} type="button">+ condition</button>
        {depth < 4 && <button className="add-btn" onClick={addGroup} type="button">+ nested group</button>}
      </div>
    </div>
  );
}

// ── main builder ───────────────────────────────────────────────────────────
export default function StrategyBuilder({ strategy, onChange, onBacktest, onStart, onStop, running, backtest, symbols, onSymbol, currency }) {
  if (!strategy) return <div className="empty">No strategy loaded</div>;
  const s = strategy;
  const errors = validateStrategy(s);
  const set = patch => onChange({ ...s, ...patch });

  const loadTemplate = i => {
    const t = ALL_TEMPLATES[i]();
    t.id = uid();
    onChange(t);
  };

  // The entry rule reads either clock candles (the timeframe) or fixed-tick
  // bars: a bar closes every N ticks regardless of the clock, so the signal is
  // a statement about how much the tape actually moved, not about the time.
  const barSource = s.barSize ? 'ticks' : 'time';

  return (
    <div className="builder">
      <div className="builder__bar">
        <input className="builder__name" value={s.name} onChange={e => set({ name: e.target.value })} placeholder="Strategy name" />
        <select className="sel" value={barSource} onChange={e => set({ barSize: e.target.value === 'ticks' ? (s.barSize || TICK_BAR_SIZES[0]) : null })}>
          <option value="time">Time bars</option>
          <option value="ticks">Tick bars</option>
        </select>
        {barSource === 'time' ? (
          <select className="sel" value={s.timeframe} onChange={e => set({ timeframe: e.target.value })}>
            {TIMEFRAMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        ) : (
          <select className="sel" value={s.barSize || TICK_BAR_SIZES[0]} onChange={e => set({ barSize: +e.target.value })}>
            {TICK_BAR_SIZES.map(n => <option key={n} value={n}>{n}-tick bars</option>)}
          </select>
        )}
        <select className="sel" value="" onChange={e => { if (e.target.value !== '') loadTemplate(+e.target.value); }}>
          <option value="">Load template…</option>
          {['Starters', 'Indicator setups'].map(group => (
            <optgroup key={group} label={group}>
              {TEMPLATE_MENU.map((it, idx) => (it.group === group
                ? <option key={it.label} value={idx}>{it.label}</option>
                : null))}
            </optgroup>
          ))}
        </select>
        <button className="btn" onClick={onBacktest} type="button">Run backtest</button>
        <button className={`btn ${running ? '' : 'btn--primary'}`} onClick={running ? onStop : onStart} type="button"
          title="Trade this strategy on the selected market">
          {running ? 'Stop bot' : 'Start bot'}
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: errors.length ? 'var(--down)' : 'var(--up)' }}>
          {errors.length ? errors[0] : 'Strategy valid'}
        </span>
      </div>

      <div className="builder__scroll">
        <div className="section-title">Entry — LONG (buy Rise / Call)</div>
        <GroupEditor group={s.long} onChange={long => set({ long })} />

        <div className="section-title">Entry — SHORT (buy Fall / Put) — optional</div>
        {s.short
          ? <GroupEditor group={s.short} onChange={short => set({ short })} onRemove={() => set({ short: null })} />
          : <button className="add-btn" onClick={() => set({ short: { logic: 'AND', conditions: [newCondition()] } })} type="button">+ add short entry</button>}

        <div className="section-title">Contract</div>
        <ContractEditor action={s.action} onChange={action => set({ action })} />

        <div className="section-title">Risk &amp; money management</div>
        <RiskEditor risk={s.risk} onChange={risk => set({ risk })} currency={currency} />

        <div className="section-title">Preview</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6, padding: 10, background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
          {describeStrategy(s)}
        </div>

        {backtest && (
          <>
            <div className="section-title">Backtest — {symbols?.find(x => x.sym === s.__sym)?.name || 'current market'}</div>
            {backtest.error ? <div className="empty">{backtest.error}</div> : <BacktestResult r={backtest} currency={currency} />}
          </>
        )}
      </div>
    </div>
  );
}

// The contract the strategy trades. Every directional catalogue product is
// available, so the same entry rule can be settled as Rise/Fall, Higher/Lower,
// Touch/No Touch, Even/Odd, Over/Under, Matches/Differs, Multipliers or any
// other call/put-style contract. Only the inputs that product needs are shown;
// a barrier left blank is derived from spot at entry time.
function ContractEditor({ action = {}, onChange }) {
  const set = patch => onChange({ ...action, ...patch });
  const type = action.type || 'rise_fall';
  const t = findTradeType(type);
  const has = k => t.inputs.includes(k);
  const units = (t.durationUnits || []).filter(u => u !== 'd');
  const unitLabels = { t: 'Ticks', s: 'Seconds', m: 'Minutes', h: 'Hours' };
  const changeType = id => {
    const nt = findTradeType(id);
    const nextUnit = nt.durationUnits.includes(action.durationUnit) ? action.durationUnit : (nt.durationUnits[0] || 't');
    onChange({ type: id, duration: action.duration ?? 5, durationUnit: nextUnit, barrier: action.barrier, barrier2: action.barrier2, digit: action.digit ?? 5, selectedTick: action.selectedTick ?? 1, multiplier: action.multiplier ?? 100, equals: !!action.equals });
  };
  return (
    <>
      <div className="risk-grid">
        <label className="field"><span className="field__lbl">Contract type</span>
          <select value={type} onChange={e => changeType(e.target.value)}>
            {TRADE_TYPES.map(tt => <option key={tt.id} value={tt.id}>{tt.label}</option>)}
          </select>
        </label>
        {has('duration') && (
          <label className="field"><span className="field__lbl">Duration</span>
            <input type="number" min="1" value={action.duration ?? 5} onChange={e => set({ duration: +e.target.value })} />
          </label>
        )}
        {has('duration') && units.length > 0 && (
          <label className="field"><span className="field__lbl">Unit</span>
            <select value={action.durationUnit || units[0]} onChange={e => set({ durationUnit: e.target.value })}>
              {units.map(u => <option key={u} value={u}>{unitLabels[u] || u}</option>)}
            </select>
          </label>
        )}
        {has('digit') && (
          <label className="field"><span className="field__lbl">Last digit</span>
            <input type="number" min="0" max="9" value={action.digit ?? 5} onChange={e => set({ digit: Math.max(0, Math.min(9, +e.target.value)) })} />
          </label>
        )}
        {has('barrier') && (
          <label className="field"><span className="field__lbl">Barrier (blank = spot)</span>
            <input type="number" step="any" value={action.barrier ?? ''} onChange={e => set({ barrier: e.target.value === '' ? null : +e.target.value })} />
          </label>
        )}
        {has('barrier2') && (
          <label className="field"><span className="field__lbl">Barrier 2 (blank = ATR)</span>
            <input type="number" step="any" value={action.barrier2 ?? ''} onChange={e => set({ barrier2: e.target.value === '' ? null : +e.target.value })} />
          </label>
        )}
        {has('selectedTick') && (
          <label className="field"><span className="field__lbl">Selected tick</span>
            <input type="number" min="1" max="5" value={action.selectedTick ?? 1} onChange={e => set({ selectedTick: Math.max(1, Math.min(5, +e.target.value)) })} />
          </label>
        )}
        {has('multiplier') && (
          <label className="field"><span className="field__lbl">Multiplier</span>
            <input type="number" min="1" value={action.multiplier ?? 100} onChange={e => set({ multiplier: +e.target.value })} />
          </label>
        )}
        {type === 'rise_fall' && (
          <label className="check" style={{ alignSelf: 'end' }}>
            <input type="checkbox" checked={!!action.equals} onChange={e => set({ equals: e.target.checked })} />
            Allow equals (Rise/Fall Equals)
          </label>
        )}
      </div>
      <p style={{ color: 'var(--text-mute)', fontSize: 11, marginTop: 6 }}>{t.tooltip}</p>
    </>
  );
}

function RiskEditor({ risk, onChange, currency }) {
  const set = patch => onChange({ ...risk, ...patch });
  // The stake is stored in the account's own currency but shown and edited in
  // shillings, matching the trade dock.
  const stakeKes = stakeInKes(risk.stake, currency);
  const minKes = minStakeKes(currency);
  return (
    <div className="risk-grid">
      <label className="field"><span className="field__lbl">{stakeLabel()}</span>
        <input type="number" min={minKes} step="0.01" value={stakeKes}
          onChange={e => set({ stake: stakeFromKes(+e.target.value, currency) })} /></label>
      <label className="field"><span className="field__lbl">Take profit ({CURRENCY})</span>
        <input type="number" min="0" value={risk.takeProfit} onChange={e => set({ takeProfit: +e.target.value })} /></label>
      <label className="field"><span className="field__lbl">Stop loss ({CURRENCY})</span>
        <input type="number" min="0" value={risk.stopLoss} onChange={e => set({ stopLoss: +e.target.value })} /></label>
      <label className="field"><span className="field__lbl">Max trades (0 = ∞)</span>
        <input type="number" min="0" value={risk.maxTrades} onChange={e => set({ maxTrades: +e.target.value })} /></label>
      <label className="field"><span className="field__lbl">Max consecutive losses</span>
        <input type="number" min="0" value={risk.maxLosses} onChange={e => set({ maxLosses: +e.target.value })} /></label>
      <label className="field"><span className="field__lbl">Martingale multiplier</span>
        <input type="number" min="1.1" max="5" step="0.1" value={risk.martMult} onChange={e => set({ martMult: +e.target.value })} disabled={!risk.martingale} /></label>
      <label className="field"><span className="field__lbl">Martingale steps</span>
        <input type="number" min="1" max="8" value={risk.martSteps} onChange={e => set({ martSteps: +e.target.value })} disabled={!risk.martingale} /></label>
      <label className="check" style={{ alignSelf: 'end' }}>
        <input type="checkbox" checked={!!risk.martingale} onChange={e => set({ martingale: e.target.checked })} />
        Martingale on loss
      </label>
    </div>
  );
}

function BacktestResult({ r, currency }) {
  const c = v => money(v, currency);
  const stats = [
    ['Trades', r.count, ''],
    ['Win rate', `${(r.winRate * 100).toFixed(1)}%`, r.winRate >= 0.5 ? 'is-up' : 'is-down'],
    ['Net P&L', `${r.pnl >= 0 ? '+' : ''}${c(r.pnl)}`, r.pnl >= 0 ? 'is-up' : 'is-down'],
    ['Profit factor', r.profitFactor === Infinity ? '∞' : r.profitFactor, r.profitFactor >= 1 ? 'is-up' : 'is-down'],
    ['Expectancy', c(r.expectancy), r.expectancy >= 0 ? 'is-up' : 'is-down'],
    ['Max drawdown', c(r.maxDrawdown), 'is-down'],
    ['Sharpe (est.)', r.sharpe, r.sharpe >= 0 ? 'is-up' : 'is-down'],
    ['End equity', c(r.equity), r.equity >= r.startEquity ? 'is-up' : 'is-down'],
  ];
  return (
    <>
      <div className="bt-stats">
        {stats.map(([k, v, cls]) => (
          <div className="stat" key={k}>
            <div className="stat__k">{k}</div>
            <div className={`stat__v ${cls}`}>{v}</div>
          </div>
        ))}
      </div>
      {r.trades.length > 0 && (
        <div style={{ maxHeight: 220, overflowY: 'auto', marginTop: 12, border: '1px solid var(--line)', borderRadius: 8 }}>
          <table className="tbl">
            <thead><tr><th>#</th><th>Side</th><th>Entry</th><th>Exit</th><th>P/L</th></tr></thead>
            <tbody>
              {r.trades.slice(-40).reverse().map((t, i) => (
                <tr key={i}>
                  <td className="dim">{r.count - i}</td>
                  <td className={t.side === 'up' ? 'is-up' : 'is-down'}>{t.side.toUpperCase()}</td>
                  <td>{t.entry.toFixed(4)}</td>
                  <td>{t.exit.toFixed(4)}</td>
                  <td className={t.profit >= 0 ? 'is-up' : 'is-down'}>{t.profit >= 0 ? '+' : ''}{c(t.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p style={{ color: 'var(--text-mute)', fontSize: 11, marginTop: 8 }}>
        Close-to-close simulation over {r.count} entries; the exit is the close {r.hold} candle(s) after entry.
        Honest limit: this is a proxy for a tick contract, not the exchange's own settlement.
      </p>
    </>
  );
}
