// ============================================================
// DIGIT TRADING FORMULA — 1HZ75V
// Mathematical formulas only (no streak/majority counting)
// Derived from exhaustive tick-level backtest (10,000 ticks)
// Best: DIGPROB_t3 — 53.3% WR, 998 trades
// ============================================================

// -----------------------------------------------------------
// DIGIT TRANSITION PROBABILITY (DIGPROB)
// For each digit 0-9, track P(next tick is EVEN | current digit)
// Trade when probability deviates >3% from 50/50 base rate
// -----------------------------------------------------------
function digitProbSignal(hist) {
  // Need at least 20 ticks per digit for stable probabilities
  if (hist.length < 30) return null;

  const currentDigit = hist[hist.length - 1];
  // Count transitions: for each digit, how many times next was even
  const counts = {};
  const evens = {};
  for (let i = 0; i < hist.length - 1; i++) {
    const d = hist[i];
    const nextPar = hist[i + 1] % 2;
    counts[d] = (counts[d] || 0) + 1;
    if (nextPar === 0) evens[d] = (evens[d] || 0) + 1;
  }

  const n = counts[currentDigit] || 0;
  const e = evens[currentDigit] || 0;
  if (n < 20) return null;

  const probEven = e / n;
  // Threshold: 3% deviation from 50%
  if (probEven > 0.53) return { prediction: 'EVEN', confidence: probEven };
  if (probEven < 0.47) return { prediction: 'ODD', confidence: 1 - probEven };
  return null;
}

// -----------------------------------------------------------
// BAYESIAN BETA-BERNOULLI POSTERIOR
// Beta(a, b) prior updated with observed even count in window
// Trade when posterior mean deviates >15% from 50%
// -----------------------------------------------------------
function bayesSignal(hist) {
  const window = 10;
  const a = 5, b = 2; // asymmetric prior favoring even
  const threshold = 0.15;

  if (hist.length < window + 1) return null;

  const recent = hist.slice(-window - 1, -1);
  let evenCnt = 0;
  for (const d of recent) if (d % 2 === 0) evenCnt++;

  const posteriorMean = (a + evenCnt) / (a + b + window);
  const dev = Math.abs(posteriorMean - 0.5);
  if (dev < threshold) return null;

  return {
    prediction: posteriorMean > 0.5 ? 'EVEN' : 'ODD',
    confidence: posteriorMean > 0.5 ? posteriorMean : 1 - posteriorMean,
  };
}

// -----------------------------------------------------------
// ENSEMBLE: prefer DIGPROB (higher WR), fall back to BAYES
// -----------------------------------------------------------
function evaluateDigitStrategy(hist) {
  // hist: array of last N digit values (0-9)

  const dp = digitProbSignal(hist);
  if (dp) return { signal: dp.prediction, confidence: dp.confidence, method: 'DIGPROB' };

  const bs = bayesSignal(hist);
  if (bs) return { signal: bs.prediction, confidence: bs.confidence, method: 'BAYES' };

  return null;
}
