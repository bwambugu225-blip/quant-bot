import React from 'react';
import {
  INDICATORS, OPERATORS, defaultParamsFor, describeStrategy, validateStrategy, STRATEGY_TEMPLATES,
} from '../lib/strategyBuilder.js';
import { TIMEFRAMES } from '../lib/marketStore.js';
import { CURRENCY, DEFAULT_STAKE, kes, stakeLabel } from '../lib/format.js';

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
export default function StrategyBuilder({ strategy, onChange, onBacktest, onStart, onStop, running, backtest, symbols, onSymbol }) {
  if (!strategy) return <div className="empty">No strategy loaded</div>;
  const s = strategy;
  const errors = validateStrategy(s);
  const set = patch => onChange({ ...s, ...patch });

  const loadTemplate = i => {
    const t = STRATEGY_TEMPLATES[i]();
    t.id = uid();
    onChange(t);
  };

  return (
    <div className="builder">
      <div className="builder__bar">
        <input className="builder__name" value={s.name} onChange={e => set({ name: e.target.value })} placeholder="Strategy name" />
        <select className="sel" value={s.timeframe} onChange={e => set({ timeframe: e.target.value })}>
          {TIMEFRAMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <select className="sel" value="" onChange={e => { if (e.target.value !== '') loadTemplate(+e.target.value); }}>
          <option value="">Load template…</option>
          <option value="0">EMA cross + trend filter</option>
          <option value="1">RSI reversal</option>
          <option value="2">Bollinger breakout</option>
          <option value="3">SuperTrend follow</option>
        </select>
        <button className="btn" onClick={onBacktest} type="button">Run backtest</button>
        <button className={`btn ${running ? '' : 'btn--primary'}`} onClick={running ? onStop : onStart} type="button">
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
        <div className="risk-grid">
          <label className="field"><span className="field__lbl">Duration</span>
            <input type="number" min="1" value={s.action?.duration ?? 5} onChange={e => set({ action: { ...s.action, duration: +e.target.value } })} />
          </label>
          <label className="field"><span className="field__lbl">Unit</span>
            <select value={s.action?.durationUnit || 't'} onChange={e => set({ action: { ...s.action, durationUnit: e.target.value } })}>
              <option value="t">Ticks</option><option value="s">Seconds</option><option value="m">Minutes</option>
            </select>
          </label>
        </div>

        <div className="section-title">Risk &amp; money management</div>
        <RiskEditor risk={s.risk} onChange={risk => set({ risk })} />

        <div className="section-title">Preview</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6, padding: 10, background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
          {describeStrategy(s)}
        </div>

        {backtest && (
          <>
            <div className="section-title">Backtest — {symbols?.find(x => x.sym === s.__sym)?.name || 'current market'}</div>
            {backtest.error ? <div className="empty">{backtest.error}</div> : <BacktestResult r={backtest} />}
          </>
        )}
      </div>
    </div>
  );
}

function RiskEditor({ risk, onChange }) {
  const set = patch => onChange({ ...risk, ...patch });
  return (
    <div className="risk-grid">
      <label className="field"><span className="field__lbl">{stakeLabel()}</span>
        <input type="number" min={DEFAULT_STAKE} step="0.01" value={risk.stake} onChange={e => set({ stake: +e.target.value })} /></label>
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

function BacktestResult({ r }) {
  const stats = [
    ['Trades', r.count, ''],
    ['Win rate', `${(r.winRate * 100).toFixed(1)}%`, r.winRate >= 0.5 ? 'is-up' : 'is-down'],
    ['Net P&L', `${r.pnl >= 0 ? '+' : ''}${kes(r.pnl)}`, r.pnl >= 0 ? 'is-up' : 'is-down'],
    ['Profit factor', r.profitFactor === Infinity ? '∞' : r.profitFactor, r.profitFactor >= 1 ? 'is-up' : 'is-down'],
    ['Expectancy', kes(r.expectancy), r.expectancy >= 0 ? 'is-up' : 'is-down'],
    ['Max drawdown', kes(r.maxDrawdown), 'is-down'],
    ['Sharpe (est.)', r.sharpe, r.sharpe >= 0 ? 'is-up' : 'is-down'],
    ['End equity', kes(r.equity), r.equity >= r.startEquity ? 'is-up' : 'is-down'],
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
                  <td className={t.profit >= 0 ? 'is-up' : 'is-down'}>{t.profit >= 0 ? '+' : ''}{kes(t.profit)}</td>
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
