import React from 'react';
import { symbolInfo } from '../lib/symbols.js';

// The auto-scan leaderboard. Ranks every market by how well the running
// strategy would have traded its tape, so the desk can see what the engine is
// choosing between. The top row is the market the next entry prefers.
const fmtScore = v => (Number.isFinite(v) ? v.toFixed(1) : '—');
const fmtPct = v => `${((+v || 0) * 100).toFixed(0)}%`;

export default function ScanBoard({ board = [], autoMarket = null, active = null }) {
  if (!board.length) {
    return <div className="empty">No ranked markets yet — start the bot to scan.</div>;
  }
  const top = board[0];
  const maxAbs = Math.max(1, ...board.map(m => Math.abs(m.score)));
  return (
    <div className="scanboard">
      {board.map((m, i) => {
        const info = symbolInfo(m.sym);
        const isActive = m.sym === active;
        const isPick = m.sym === autoMarket;
        const w = Math.max(2, (Math.abs(m.score) / maxAbs) * 100);
        return (
          <div key={m.sym} className={`scanrow${isActive ? ' is-active' : ''}${isPick ? ' is-pick' : ''}`}>
            <span className="scanrow__rank">{i + 1}</span>
            <span className="scanrow__sym">
              <b>{m.sym}</b>
              <span className="scanrow__name">{info.name}</span>
            </span>
            <span className="scanrow__bar"><span className={`scanrow__fill ${m.score >= 0 ? 'is-up' : 'is-down'}`} style={{ width: `${w}%` }} /></span>
            <span className="scanrow__score">{fmtScore(m.score)}</span>
            <span className="scanrow__meta">{m.count}× · {fmtPct(m.winRate)}</span>
          </div>
        );
      })}
      <div className="scanboard__note">
        Leader: <b>{top.sym}</b> · the engine trades the first market that fires, preferring the highest score.
      </div>
    </div>
  );
}
