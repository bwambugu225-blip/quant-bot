import React from 'react';
import { SYMBOLS, symbolInfo, pipSize } from '../lib/symbols.js';

// A live ticker tape across the top of the workspace. It reads the same store
// the chart does, so the price shown here is the price the strategy sees. Each
// row carries the session change (open of the imported window vs the live
// price), coloured like every other up/down reading in the app. The track
// auto-scrolls as a marquee when it overflows and pauses on hover.
export default function TickerTape({ store, tick, onSelect, selected }) {
  const rows = React.useMemo(() => {
    return SYMBOLS.map(s => {
      const info = symbolInfo(s.sym);
      const price = store.lastPrice(s.sym);
      const open = store.openPrice(s.sym);
      const chg = open && price ? ((price - open) / open) * 100 : null;
      return { sym: s.sym, name: info.name, price, chg };
    }).filter(r => r.price != null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, tick]);

  const empty = rows.length === 0;
  // Duplicate the set so the marquee wraps seamlessly.
  const list = empty ? [] : [...rows, ...rows];

  return (
    <div className="tape">
      <span className="tape__label">Live tape</span>
      <div className={`tape__track${empty ? '' : ' is-scrolling'}`}>
        {empty && <span className="tape__item" style={{ color: 'var(--text-mute)' }}>Connecting to the market feed…</span>}
        {list.map((r, i) => {
          const dec = pipSize(r.sym);
          const cls = r.chg == null ? 'is-flat' : r.chg > 0 ? 'is-up' : r.chg < 0 ? 'is-down' : 'is-flat';
          return (
            <button
              key={`${r.sym}-${i}`}
              className="tape__item"
              onClick={() => onSelect?.(r.sym)}
              title={r.name}
              type="button"
              style={{ border: 0, background: 'transparent', outline: selected === r.sym ? '1px solid var(--accent)' : 'none' }}
            >
              <span className="tape__sym">{r.sym}</span>
              <span className="tape__px">{r.price.toFixed(dec)}</span>
              <span className={`tape__chg ${cls}`}>
                {r.chg == null ? '—' : `${r.chg >= 0 ? '+' : ''}${r.chg.toFixed(2)}%`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

