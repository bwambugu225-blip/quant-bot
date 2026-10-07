import React from 'react';

// Live last-digit analysis, shown above the parameter dock for every digit
// product. Reads the same tick history the chart uses and renders the
// prediction the engine would actually trade, plus the distribution table.
export default function DigitAnalysis({ analysis, prediction, compact = false }) {
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

      {prediction ? (
        <div className="digit-analysis__pred">
          <div className="digit-analysis__pred-top">
            <span className="digit-analysis__pred-label">{prediction.label}</span>
            <span className="digit-analysis__pred-conf">
              {(prediction.probability * 100).toFixed(1)}% win · edge +{(prediction.edge * 100).toFixed(1)}%
            </span>
          </div>
          <div className="digit-analysis__pred-bar">
            <span style={{ width: `${Math.min(100, prediction.probability * 100)}%` }} />
          </div>
          <div className="digit-analysis__pred-rationale">{prediction.rationale}</div>
        </div>
      ) : (
        <div className="digit-analysis__pred digit-analysis__pred--none">
          No edge above break-even right now — the distribution is within noise.
        </div>
      )}
    </div>
  );
}
