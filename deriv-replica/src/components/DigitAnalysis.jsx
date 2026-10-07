import React from 'react';

// Live last-digit distribution for the selected market, shown above the
// parameter dock for every digit product. Reads the same tick history the
// chart uses: per-digit frequency bars plus hot/cold, even/odd and the χ²
// bias read-out.
export default function DigitAnalysis({ analysis, compact = false }) {
  if (!analysis || analysis.n < 20) {
    return (
      <div className="digit-analysis digit-analysis--empty">
        <span>Collecting ticks for digit analysis… {analysis ? analysis.n : 0}/20</span>
      </div>
    );
  }

  const { now, hottest, coldest, hotPct, coldPct, evenPct, oddPct, eoStreak, eoStreakSide, biased, chi, entropy, freq, n } = analysis;
  const maxF = Math.max(...freq);

  return (
    <div className={`digit-analysis${compact ? ' is-compact' : ''}`}>
      <div className="digit-analysis__head">
        <span className="digit-analysis__title">Last digit analysis</span>
        <span className={`digit-analysis__badge${biased ? ' is-biased' : ''}`}>
          χ² {chi.toFixed(1)} · H {entropy.toFixed(2)}
        </span>
      </div>

      <div className="digit-analysis__dist">
        {freq.map((f, d) => (
          <div key={d} className={`digit-cell${d === now ? ' is-now' : ''}${d === hottest ? ' is-hot' : ''}`}>
            <span className="digit-cell__bar" style={{ height: `${Math.max(6, (f / maxF) * 100)}%` }} />
            <span className="digit-cell__digit">{d}</span>
            <span className="digit-cell__pct">{((f / n) * 100).toFixed(1)}</span>
          </div>
        ))}
      </div>

      <div className="digit-analysis__stats">
        <span><b>Hot</b> {hottest} ({(hotPct * 100).toFixed(1)}%)</span>
        <span><b>Cold</b> {coldest} ({(coldPct * 100).toFixed(1)}%)</span>
        <span><b>Even</b> {(evenPct * 100).toFixed(1)}%</span>
        <span><b>Odd</b> {(oddPct * 100).toFixed(1)}%</span>
        {eoStreak > 1 && <span><b>Streak</b> {eoStreak} {eoStreakSide === 'e' ? 'even' : 'odd'}</span>}
        <span><b>Ticks</b> {n}</span>
      </div>
    </div>
  );
}
