import React from 'react';
import { addComma } from '../lib/format.js';

export function Positions({ positions }) {
  if (!positions.length) return <div className="empty">No open positions</div>;
  return (
    <table className="tbl">
      <thead>
        <tr><th>Contract</th><th>Market</th><th>Stake</th><th>Entry</th><th>Status</th></tr>
      </thead>
      <tbody>
        {positions.map(p => (
          <tr key={p.id}>
            <td className="dim">{p.contractType}</td>
            <td>{p.symbol}</td>
            <td>{addComma(p.stake)}</td>
            <td>{p.entry != null ? p.entry.toFixed(p.decimals ?? 4) : '—'}</td>
            <td><span className="pill">open</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Reports({ reports, onReset }) {
  const wins = reports.filter(r => r.won).length;
  const pnl = reports.reduce((a, r) => a + r.profit, 0);
  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <Stat k="Trades" v={reports.length} />
        <Stat k="Win rate" v={reports.length ? `${((wins / reports.length) * 100).toFixed(1)}%` : '—'} />
        <Stat k="Net P&L" v={`${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}`} cls={pnl >= 0 ? 'is-up' : 'is-down'} />
        <button className="btn" style={{ marginLeft: 'auto' }} onClick={onReset} type="button">Reset session</button>
      </div>
      {!reports.length ? <div className="empty">No closed trades yet</div> : (
        <table className="tbl">
          <thead>
            <tr><th>Time</th><th>Market</th><th>Contract</th><th>Strategy</th><th>Stake</th><th>P/L</th><th>Balance</th></tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td className="dim">{r.time}</td>
                <td>{r.symbol}</td>
                <td className="dim">{r.action}</td>
                <td className="dim">{r.strategy}</td>
                <td>{addComma(r.stake)}</td>
                <td className={r.profit >= 0 ? 'is-up' : 'is-down'}>{r.profit >= 0 ? '+' : ''}{r.profit.toFixed(2)}</td>
                <td>{addComma(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Stat({ k, v, cls = '' }) {
  return (
    <div className="stat" style={{ minWidth: 110 }}>
      <div className="stat__k">{k}</div>
      <div className={`stat__v ${cls}`}>{v}</div>
    </div>
  );
}

export function Logs({ logs }) {
  if (!logs.length) return <div className="empty">No log entries</div>;
  return (
    <div className="logs">
      {logs.slice(-200).reverse().map((l, i) => (
        <div className={`log-line k-${l.k || 'i'}`} key={i}>
          <span className="t">{new Date(l.at).toLocaleTimeString()}</span>
          <span>{l.t}</span>
        </div>
      ))}
    </div>
  );
}
