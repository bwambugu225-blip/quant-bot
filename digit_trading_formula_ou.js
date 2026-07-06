// ============================================================
// OVER/UNDER DIGIT TRADING FORMULA — 1HZ75V
// Mathematical formulas only (no streak/majority counting)
// Trigger only on boundary digits 4,5,6 where crossing is possible
// Over = {5,6,7,8,9}, Under = {0,1,2,3,4}
// Best: OU_BAYES_w30_a0.5b5_t15 — 52.7% WR, 283 trades
// ============================================================

// -----------------------------------------------------------
// PARAMETERS
// -----------------------------------------------------------
const OU = {
  // Bayesian Beta(0.5,5) prior — strongly favors Over
  BAYES_WINDOW: 30,
  BAYES_A: 0.5,
  BAYES_B: 5,
  BAYES_TH: 0.15,

  // Warmup ticks before trading
  WARMUP: 30,
};

// Boundary digits where crossing is possible
const BOUNDARY = new Set([4, 5, 6]);
function isBoundary(d) { return BOUNDARY.has(d); }

// -----------------------------------------------------------
// BAYESIAN BETA-BERNOULLI POSTERIOR
// Beta(a,b) prior updated with recent Over count
// Trade when posterior mean deviates >th from 50%
// -----------------------------------------------------------
function bayesSignal(hist) {
  const { WINDOW: w, A: a, B: b, TH: th } = OU.BAYES_WINDOW;
  // Extract just the Over/Under status (0=Under, 1=Over) from digits
  const ou = hist.map(d => d <= 4 ? 0 : 1);

  if (ou.length < w + 1) return null;

  // Check if current (last) digit is boundary
  const currDigit = hist[hist.length - 1];
  if (!isBoundary(currDigit)) return null;

  // Use last w ticks (excluding current) to predict next
  const window = ou.slice(-w - 1, -1);
  const overCnt = window.reduce((s, v) => s + v, 0);
  const postMean = (a + overCnt) / (a + b + w);
  const dev = Math.abs(postMean - 0.5);

  if (dev < th) return null;

  return {
    prediction: postMean > 0.5 ? 'OVER' : 'UNDER',
    confidence: postMean > 0.5 ? postMean : 1 - postMean,
    method: 'BAYES_OU',
  };
}

// -----------------------------------------------------------
// DIGIT TRANSITION PROBABILITY (rolling, out-of-sample)
// P(next=OVER | current_digit) from observed history
// -----------------------------------------------------------
function digitProbSignal(hist) {
  if (hist.length < 30) return null;

  const currDigit = hist[hist.length - 1];
  if (!isBoundary(currDigit)) return null;

  // Rolling transition counts from history (excluding current tick)
  const counts = {};
  const overs = {};
  for (let i = 0; i < hist.length - 1; i++) {
    const d = hist[i];
    const nextOver = hist[i + 1] > 4 ? 1 : 0;
    counts[d] = (counts[d] || 0) + 1;
    if (nextOver) overs[d] = (overs[d] || 0) + 1;
  }

  const n = counts[currDigit] || 0;
  const o = overs[currDigit] || 0;
  if (n < 20) return null;

  const probOver = o / n;
  if (probOver > 0.53) return { prediction: 'OVER', confidence: probOver, method: 'DIGPROB_OU' };
  if (probOver < 0.47) return { prediction: 'UNDER', confidence: 1 - probOver, method: 'DIGPROB_OU' };
  return null;
}

// -----------------------------------------------------------
// ENSEMBLE: prefer DIGPROB (faster adaptation), fall back to BAYES
// -----------------------------------------------------------
function evaluateOUSignal(hist) {
  // hist: array of last N digit values (0-9)

  const dp = digitProbSignal(hist);
  if (dp) return dp;

  const bs = bayesSignal(hist);
  if (bs) return bs;

  return null;
}
