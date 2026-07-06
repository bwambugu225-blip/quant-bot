// ============================================================
// OPTIMAL DIGIT TRADING FORMULA — 1HZ75V
// Derived from exhaustive tick-level backtest (10,000 ticks)
// Base rate: 50% even / 50% odd (uniform)
// Edge source: parity clustering (ODD > EVEN)
// ============================================================

// -----------------------------------------------------------
// PARAMETERS (backtest-optimized for 1HZ75V)
// -----------------------------------------------------------
const OPT = {
  // Strategy A: 8-tick majority, predict ODD when >=90% (64.3% WR, 56 trades)
  MAJ_N: 8,
  MAJ_ODD_TH: 90,
  MAJ_EVEN_TH: 90,

  // Strategy B: majority margin >=7 in 8-tick window (62.0% WR, 108 trades)
  MM_N: 8,
  MM_MARGIN: 7,

  // Strategy C: 6-tick unanimous ODD (58.6% WR, 162 trades)
  UNA_N: 6,

  // Minimum trades threshold
  MIN_WARMUP: 10,
};

// -----------------------------------------------------------
// CORE SIGNAL FUNCTIONS
// -----------------------------------------------------------

// Strategy A: high-confidence majority - predict ODD when >=90% of last 8 are ODD
function signalMajorityOdd(hist) {
  if (hist.length < OPT.MAJ_N) return null;
  const window = hist.slice(-OPT.MAJ_N);
  let oddCnt = 0;
  for (const d of window) if (d % 2 === 1) oddCnt++;
  const pct = (oddCnt / OPT.MAJ_N) * 100;
  if (pct >= OPT.MAJ_ODD_TH) return 'ODD';
  return null;
}

// Strategy A (even variant): predict EVEN when >=90% of last 8 are EVEN
function signalMajorityEven(hist) {
  if (hist.length < OPT.MAJ_N) return null;
  const window = hist.slice(-OPT.MAJ_N);
  let evenCnt = 0;
  for (const d of window) if (d % 2 === 0) evenCnt++;
  const pct = (evenCnt / OPT.MAJ_N) * 100;
  if (pct >= OPT.MAJ_EVEN_TH) return 'EVEN';
  return null;
}

// Strategy B: majority margin - predict majority when difference >= margin
function signalMarginMajority(hist) {
  if (hist.length < OPT.MM_N) return null;
  const window = hist.slice(-OPT.MM_N);
  let evenCnt = 0;
  for (const d of window) if (d % 2 === 0) evenCnt++;
  const oddCnt = OPT.MM_N - evenCnt;
  const diff = Math.abs(evenCnt - oddCnt);
  if (diff < OPT.MM_MARGIN) return null;
  return evenCnt > oddCnt ? 'EVEN' : 'ODD';
}

// Strategy C: unanimous streak (all last N same parity)
function signalUnanimous(hist) {
  if (hist.length < OPT.UNA_N) return null;
  const window = hist.slice(-OPT.UNA_N);
  const firstPar = window[0] % 2;
  for (const d of window) if (d % 2 !== firstPar) return null;
  return firstPar === 0 ? 'EVEN' : 'ODD';
}

// -----------------------------------------------------------
// ENSEMBLE: vote among all signals (majority wins)
// -----------------------------------------------------------
function optimalDigitSignal(hist) {
  if (hist.length < OPT.MIN_WARMUP) return null;

  const signals = [
    signalMajorityOdd(hist),
    signalMajorityEven(hist),
    signalMarginMajority(hist),
    signalUnanimous(hist),
  ];

  let evenVotes = 0;
  let oddVotes = 0;
  for (const s of signals) {
    if (s === 'EVEN') evenVotes++;
    else if (s === 'ODD') oddVotes++;
  }

  if (evenVotes === 0 && oddVotes === 0) return null;
  if (evenVotes > oddVotes) return 'EVEN';
  if (oddVotes > evenVotes) return 'ODD';

  // Tie: use the highest-confidence individual signal
  const ma = signalMarginMajority(hist);
  if (ma) return ma;
  const una = signalUnanimous(hist);
  if (una) return una;
  const mo = signalMajorityOdd(hist);
  if (mo) return mo;
  return signalMajorityEven(hist);
}

// -----------------------------------------------------------
// INTEGRATION: replace evaluateDigitStrategy's EO branch
// -----------------------------------------------------------
/*
  In bot.html, replace the EO analysis section (~line 1190-1196):

  // OLD (lines 1190-1196):
  const eoShort = scoreEOPrecision(short, hist);
  const eoMid = scoreEOPrecision(mid, hist);
  const eoAll = scoreEOPrecision(all, hist);
  const eoWeighted = (eoShort.confidence * 3 + eoMid.confidence * 2 + eoAll.confidence * 1) / 6;
  const eoEven = (eoShort.even * 3 + eoMid.even * 2 + eoAll.even * 1) / 6;

  // REPLACE WITH:
  const optSignal = optimalDigitSignal(hist);
  let eoWeighted = 0.5, eoEven = 0.5;
  if (optSignal === 'EVEN') { eoEven = 0.65; eoWeighted = 0.62; }
  else if (optSignal === 'ODD') { eoEven = 0.35; eoWeighted = 0.62; }

  // Then the existing EO logic picks:
  //   eoEven > 0.5 ? 'DIGITODD' : 'DIGITEVEN'
  // NOTE: this mapping appears inverted — verify before deploying.
*/
