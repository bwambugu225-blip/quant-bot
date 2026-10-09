// Trading engine — the real execution + strategy loop.
//
// Automation is scoped to one explicit contract (e.g. "Over 3" or "Rise")
// running on one explicit market. Each contract carries its own parameters and
// its own signal function from autoStrategies.js, so changing the contract
// changes the strategy, not just the label.
import { MarketStore, SYMBOLS, isDigitSymbol, digitOf, decimalsFor } from './marketStore.js';
import { buildProposal } from './contracts.js';
import { findAutoContract, buildAutoValue, accuracyParams, shapeProposal, findEntryByTypeSide, categoryForType, AUTO_CONTRACTS } from './autoStrategies.js';
import { MarketScanner, SCAN_INTERVAL_MS } from './marketScanner.js';
import {
  evaluateUniversal, confirmCandidate, UNIVERSAL_MIN_CONF,
} from './universalAI.js';

const MIN_STAKE = 0.35;
const MAX_STAKE = 200;

// A proposal that never comes back would otherwise block the engine for good.
// 6s is long enough for a slow round trip and short enough that a dropped
// request costs at most one tick.
const PROPOSAL_TIMEOUT = 6000;

// Rolling execution stats, so "lightning" is a measurement and not a claim.
// The UI reads the p50/p95 from the snapshot.
const EXEC_WINDOW = 40;

// Ticks of history required before the engine will place its first trade. The
// market feed preloads 1100 ticks per symbol on connect, so in practice this is
// already satisfied by the time the user starts — the gate exists so the very
// first signal can never be computed on a cold tape.
const WARMUP_TICKS = 100;

// Natural trading cadence for Universal AI. The whole point of a universal
// evaluator is to trade when the tape offers something, not to manufacture a
// bet on a timer — so it trades *at most* once per ~5s, and only when a
// candidate still clears the bar. This is a ceiling on frequency, never a
// trigger: a quiet stretch correctly produces zero trades. 5s is ~10 ticks on
// Deriv's volatility indices, which is the shortest hold whose entry can still
// be justified by the reading that produced it (see Universal AI in AGENTS.md).
export const UNIVERSAL_MIN_GAP_MS = 5000;

// How long a market's contracts_for catalogue is trusted. Barriers for turbos,
// vanillas and touch products are derived from the live spot and are
// recalculated every few seconds, so a cached catalogue goes stale and would
// make the engine propose a barrier the exchange has since moved past. One
// minute keeps proposals valid without refetching on every tick.
const SPEC_TTL_MS = 60000;

// Only the two inputs worth exposing are stored per contract: the stake and
// the accuracy level. Everything else (duration, barrier, digit, martingale,
// risk caps) is a per-family default, so switching contracts never leaves a
// stale value behind.
function defaultParamsFor(entry) {
  return {
    stake: 1,
    accuracy: 'max',
    ...accuracyParams('max'),
    ...entry.defaults,
    takeProfit: 0,
    stopLoss: 0,
    maxTrades: 0,
    martingale: false,
    martMult: 2,
    martSteps: 3,
    window: 0,
    zMin: 0,
  };
}

export class Engine {
  constructor() {
    this.store = new MarketStore();
    this.client = null;

    this.running = false;
    this.autoMarket = 'R_10';
    this.selectedMarket = 'R_10';
    this.autoContractKey = 'CALL';
    this.contractParams = {};

    this.activeContracts = new Map();
    this.processed = new Set();
    this.sendingTimeout = null;

    // Auto market rotation: the scanner continuously ranks every eligible
    // market and the engine bets on whichever is strongest, so it does not
    // thrash and it is never stuck on a quiet index.
    this.autoSwitch = true;
    this.scanner = new MarketScanner({
      getStore: () => this.store,
      getContractKey: () => this.autoContractKey,
      getAccuracy: () => this.paramsFor(this.autoContractKey),
      getCandidates: () => this._candidates(),
    });
    this._lastSwitch = 0;
    this._lastSwitchReason = '';
    this._scanAt = 0;
    this._startPending = false;

    // Universal AI: scan every market and every contract at once and trade
    // whichever reading clears the confidence bar. Off by default so the
    // single-contract flow is unchanged until the user opts in.
    this.universal = false;
    this.universalMinConf = UNIVERSAL_MIN_CONF;
    this.universalCandidates = [];
    // Preferred markets for Universal AI. null = every market; a non-empty list
    // narrows the scan to just those indices so the user can steer the AI away
    // from markets they do not want to trade.
    this.universalMarkets = null;
    this._universalAt = 0;
    this._universalPasses = 0;
    // Natural cadence: when the universal AI last opened a trade. Gates the loop
    // below so it cannot fire several entries within the same few seconds.
    this._universalLastTradeAt = 0;

    // Per-market `contracts_for` catalogue, keyed by symbol → array of
    // available contract rows. Requested on first need and reused; it is the
    // authority on which barriers and durations a market actually accepts, so
    // the engine never sends a proposal that market will reject.
    this._cfCache = new Map();
    this._cfPending = new Set();
    this._proposalRetry = null;

    // Execution latency, measured tick→proposal-sent and tick→contract-live.
    this._execSamples = [];
    this._execStart = 0;
    this._pendingScan = null;

    this.wins = 0; this.losses = 0; this.consLoss = 0;
    this.pnl = 0; this.trades = 0;
    this.bestTrade = 0; this.worstTrade = 0;
    this.positions = [];
    this.reports = [];
    this.lastSignal = null;
    this.logs = [];
    this.toasts = [];
    this.sessionStart = null;
    this._martSteps = 0;

    this._watchdog = null;
    this._marketSubscribed = new Set();
    this._listeners = {};

    this.store.setSelectedTf('5s');
  }

  // ── Event plumbing ─────────────────────────────────────────────────────
  on(evt, fn) { (this._listeners[evt] = this._listeners[evt] || []).push(fn); return this; }
  emit(evt, ...a) { (this._listeners[evt] || []).forEach(fn => { try { fn(...a); } catch (e) { console.error(e); } }); }

  log(msg, kind = 'i') {
    const entry = { t: msg, k: kind, at: Date.now() };
    this.logs = [...this.logs, entry].slice(-400);
    this.emit('log', entry);
  }

  toast(msg, kind) {
    this.toasts = [...this.toasts, { msg, kind, at: Date.now() }];
    this.emit('toast', { msg, kind });
  }

  attach(client) {
    this.client = client;
    client.on('message', (msg, source) => this.onMessage(msg, source));
    client.on('authorized', info => {
      this.emit('authorized', info);
      this.emit('state', this.snapshot());
    });
    client.on('subscribe-market', () => this._subscribeMarkets());
    client.on('market-open', () => {
      this._marketSubscribed.clear();
      this.log('[MARKET] Socket connected — subscribing to markets', 's');
      this._subscribeMarkets();
    });
    client.on('market-close', () => this.log('[MARKET] Socket closed — retrying', 'w'));
    client.on('market-error', (info) => {
      this.log(`[MARKET] Socket error (${info?.url || '?'}) — check network/firewall`, 'e');
      this._marketErrors = (this._marketErrors || 0) + 1;
      if (this._marketErrors === 3 && client.ws?.readyState === WebSocket.OPEN) {
        this.log('[MARKET] Falling back to the trading socket for ticks', 'w');
        this._marketSubscribed.clear();
        this._marketOnTrading = true;
        this._subscribeMarkets();
      }
    });
    client.on('accounts', accounts => { this.accounts = accounts; this.emit('state', this.snapshot()); });
    client.on('log', ({ t, k }) => this.log(t, k));
    client.on('close', () => this.emit('state', this.snapshot()));
  }

  switchAccount(accountId) { return this.client?.switchAccount(accountId); }

  // Recharge the demo account. Switches to the virtual account first (so the
  // recharge lands on the demo wallet even from a real login), then delegates
  // to the REST top-up on the client.
  async topUpDemo(amount) {
    if (!this.client) throw new Error('Not connected');
    await this.switchToDemo();
    const balance = await this.client.topUpDemo(amount);
    this.emit('state', this.snapshot());
    return balance;
  }

  // The demo ("virtual") account covered by the current token, if any.
  demoAccount() {
    return (this.accounts || []).find(a => a.account?.startsWith('VR') || a.isDemo);
  }

  // Switch to the demo account (used before a top-up so the recharge lands on
  // the virtual wallet). No-op when already on it.
  async switchToDemo() {
    if (this.client?.accountType === 'demo') return this.client.accountId;
    const demo = this.demoAccount();
    if (!demo) throw new Error('No demo account is available for this login');
    await this.switchAccount(demo.account);
    return demo.account;
  }

  _subscribeMarkets() {
    if (!this.client) return;
    const pending = SYMBOLS.filter(s => !this._marketSubscribed.has(s.sym));
    if (!pending.length) return;
    pending.forEach(s => this._marketSubscribed.add(s.sym));
    this.client.subscribeMarket(pending, this._marketOnTrading ? 'ws' : 'mws');
  }

  // ── Contract parameters ────────────────────────────────────────────────
  paramsFor(key = this.autoContractKey) {
    const entry = findAutoContract(key);
    if (!this.contractParams[key]) this.contractParams[key] = defaultParamsFor(entry);
    return this.contractParams[key];
  }

  // Resolve the registry key the auto engine should run for a Trade-tab trade
  // type, honouring the side/digit/equals the user has configured. Every
  // contract family has at least one entry, so the dropdown bot button can
  // always arm the exact product on screen.
  autoKeyForType(typeId, opts = {}) {
    const side = opts.side === 'down' ? 'down' : 'up';
    let key = Object.keys(AUTO_CONTRACTS).find(k => {
      const e = AUTO_CONTRACTS[k];
      return e.typeId === typeId && e.side === side && !e.digit;
    });
    if (typeId === 'matches_differs' || typeId === 'over_under') {
      const prefix = typeId === 'matches_differs'
        ? (side === 'up' ? 'DIGITMATCH:' : 'DIGITDIFF:')
        : (side === 'up' ? 'DIGITOVER:' : 'DIGITUNDER:');
      key = prefix + (opts.digit ?? 5);
    } else if (typeId === 'rise_fall' && opts.equals) {
      key = side === 'up' ? 'CALLE' : 'PUTE';
    } else if (typeId === 'lookbacks' && opts.highLow) {
      key = 'LBHIGHLOW';
    }
    return findAutoContract(key) ? key : this.autoContractKey;
  }

  setContract(key) {
    if (!findAutoContract(key)) return;
    this.autoContractKey = key;
    const e = findAutoContract(key);
    if (e.digitFamily && !isDigitSymbol(this.autoMarket)) {
      this.autoMarket = 'R_10';
      this.log('[ENGINE] Digits need a Volatility index — market set to R_10', 'w');
    }
    this.log(`[ENGINE] Contract → ${e.label}`, 'i');
    this.emit('state', this.snapshot());
  }

  // Merge a patch into the selected contract's parameters.
  setParams(patch) {
    const key = this.autoContractKey;
    const next = { ...this.paramsFor(key), ...patch };
    if (patch.accuracy) Object.assign(next, accuracyParams(patch.accuracy));
    this.contractParams[key] = next;
    this.emit('state', this.snapshot());
  }

  // ── Market universe ────────────────────────────────────────────────────
  //
  // Digit contracts are symbol-agnostic (the digits of a random walk are
  // uniform on every index), so the meaningful choice is *where and when* to
  // bet. The scanner ranks every eligible market on the selected contract and
  // the engine bets on the leader.
  _candidates() {
    const entry = findAutoContract(this.autoContractKey);
    const list = entry.digitFamily ? SYMBOLS.filter(s => isDigitSymbol(s.sym)) : SYMBOLS;
    return list.map(s => s.sym);
  }

  setAutoSwitch(on) {
    this.autoSwitch = !!on;
    if (this.autoSwitch) this.scanner.reset();
    this.log(`[ENGINE] Multi-market scanner ${this.autoSwitch ? 'on' : 'off'}`, 'i');
    this.emit('state', this.snapshot());
  }

  setMarket(sym) {
    const e = findAutoContract(this.autoContractKey);
    if (e.digitFamily && !isDigitSymbol(sym)) {
      this.toast('Digits need a Volatility index', 'w');
      return;
    }
    this.autoMarket = sym;
    this._lastSwitch = Date.now();
    this.log(`[ENGINE] Market → ${sym}`, 'i');
    this.emit('state', this.snapshot());
  }

  snapshot() {
    const e = findAutoContract(this.autoContractKey);
    return {
      running: this.running,
      auth: !!this.client?.auth,
      accountId: this.client?.accountId || null,
      accountType: this.client?.accountType || 'demo',
      balance: this.client?.balance || 0,
      accounts: this.accounts || [],
      wins: this.wins, losses: this.losses, pnl: this.pnl, trades: this.trades,
      consLoss: this.consLoss,
      bestTrade: this.bestTrade, worstTrade: this.worstTrade,
      openCount: this.positions.length,
      autoMarket: this.autoMarket,
      autoContractKey: this.autoContractKey,
      autoContractLabel: e.label,
      autoTypeId: e.typeId,
      autoSide: e.side,
      params: this.paramsFor(this.autoContractKey),
      autoSwitch: this.autoSwitch,
      scan: this.scanner.top(8),
      scanCount: this.scanner.scans,
      universal: this.universal,
      universalMinConf: this.universalMinConf,
      universalMarkets: this.universalMarkets ? this.universalMarkets.slice() : null,
      universalSymbols: this.universalSymbols(),
      universalScan: this.universalCandidates.slice(0, 10).map(c => ({
        sym: c.sym, key: c.key, label: c.label, family: c.family,
        conf: c.conf, dur: c.durLabel,
      })),
      universalCount: this.universalCandidates.length,
      universalPasses: this._universalPasses,
      universalParams: { ...this.universalParams() },
      exec: this.execStats(),
      warmup: this.warmup(),
      startPending: this._startPending,
      sessionStart: this.sessionStart,
      lastSignal: this.lastSignal,
      positions: this.positions,
      reports: this.reports,
    };
  }

  // ── Message routing ────────────────────────────────────────────────────
  onMessage(msg) {
    if (['history', 'tick', 'candles'].includes(msg.msg_type)) this.emit('market-data', msg);
    switch (msg.msg_type) {
      case 'balance': return this._onBalance(msg);
      case 'history': return this._onHistory(msg);
      case 'tick': return this._onTick(msg);
      case 'proposal': return this._onProposal(msg);
      case 'buy': return this._onBuy(msg);
      case 'proposal_open_contract': return this._onContract(msg.proposal_open_contract);
      case 'error': return this._onError(msg);
      default: return undefined;
    }
  }

  _onBalance(msg) {
    if (msg.balance) {
      this.client.balance = parseFloat(msg.balance.balance) || 0;
      this.emit('state', this.snapshot());
    }
  }

  _onHistory(msg) {
    const sym = msg.echo_req?.ticks_history;
    if (msg.subscription?.id && sym) this.store.tickSubs[msg.subscription.id] = sym;
    if (msg.error) {
      this.log(`[MARKET] ${sym || 'history'} rejected: ${msg.error.message}`, 'e');
      this.emit('market-data', msg);
      return;
    }
    this.store.onHistory(sym, msg.history?.times || [], msg.history?.prices || []);
    this.emit('market-data', msg);
  }

  _onTick(msg) {
    const t = msg.tick;
    if (!t) return;
    const sym = t.symbol || this.store.tickSubs[msg.subscription?.id];
    const price = +t.quote;
    const epoch = +t.epoch;
    if (!sym || !Number.isFinite(price) || !Number.isFinite(epoch)) return;

    const closed = this.store.onTick(sym, price, epoch);
    this.emit('tick', { sym, price, epoch, digit: digitOf(price, sym) });

    // A pending start engages itself the moment the warm-up target market has
    // enough history. This is what makes the start seamless: the user clicks
    // START, the preload finishes, and trading begins without a second click.
    if (this._startPending && this.warmup().ready) {
      this.log('[ENGINE] Warm-up complete — starting', 's');
      this.start();
      return;
    }

    if (!this.running || this.activeContracts.size > 0) return;
    this._tickAt = Date.now();

    // Universal AI: on every tick, re-confirm the top candidate from the last
    // background pass against the tape that just printed. Any market, any
    // contract, auto duration. The re-confirmation is what keeps the entry
    // honest — the trade is justified by the current reading, not a stale one.
    if (this.universal) {
      if (this._sessionAllows()) this._universalTick();
      return;
    }

    // ── The hot path ──────────────────────────────────────────────────────
    // A trade is decided here, synchronously, on the tick that just printed —
    // no timer, no re-scan, no waiting for a candle to close. The multi-market
    // ranking is kept warm by the scanner on its own cadence, so this only has
    // to run the selected contract's own signal on one market.
    const entry = findAutoContract(this.autoContractKey);

    // Lightning path: the scanner keeps every market scored, so any market that
    // currently shows a qualifying signal is taken on this tick. The engine
    // follows the opportunity across the whole universe instead of idling on
    // one hand-picked index.
    if (entry.digitFamily && this.autoSwitch && this._scannedAt(sym) && isDigitSymbol(sym)) {
      if (this._sessionAllows()) {
        const sig = this._signalFor(sym, entry);
        if (sig) {
          if (sym !== this.autoMarket) { this.autoMarket = sym; this._lastSwitchReason = `auto → ${sym}`; }
          this._logSignal(entry, sym, sig);
          this._execute(sym, entry, sig);
        }
      }
      return;
    }

    // Cold path: single-market evaluation for the selected market, and
    // directional contracts, which need a completed candle.
    if (sym !== this.autoMarket) return;
    if (entry.digitFamily) this._evaluateDigit(sym, entry);
    // High/Low Tick is a tick-window contract, not a candle contract, so it
    // reads the live tape on every tick even though it is not digit-based.
    else if (entry.typeId === 'highs_lows') this._evaluateDirectional(sym, entry);
    else if (closed) this._evaluateDirectional(sym, entry);
  }

  // True when the scanner has freshly scored this market (within two cadences).
  _scannedAt(sym) {
    const row = this.scanner.rows.get(sym);
    return !!row && (Date.now() - row.at) <= SCAN_INTERVAL_MS * 2;
  }


  // Build the signal context for a contract and run its own strategy.
  _signalFor(sym, entry, opts = {}) {
    const p = opts.strict
      ? { ...this.paramsFor(entry.key), ...accuracyParams('max') }
      : this.paramsFor(entry.key);
    const ctx = {
      candles: this.store.candles[sym] || [],
      digits: this.store.digHist[sym] || [],
      // Raw tick prices, used by the Asian and High/Low Tick contracts, which
      // reason about the tick sequence rather than candle closes.
      prices: this.store.livePrices ? this.store.livePrices(sym) : (this.store.liveBuf[sym] || []),
      params: p,
    };
    try {
      return entry.signal(ctx);
    } catch (err) {
      this.log(`[ENGINE] ${entry.label} signal error: ${err.message}`, 'e');
      return null;
    }
  }

  _logSignal(entry, sym, sig) {
    this.log(`[SIGNAL] ${entry.label} on ${sym}: ${sig.conf}% · ${sig.rationale}`, 't');
  }

  _evaluateDirectional(sym, entry) {
    if (!this._sessionAllows()) return;
    const sig = this._signalFor(sym, entry);
    if (!sig) return;
    this._logSignal(entry, sym, sig);
    this._execute(sym, entry, sig);
  }

  _evaluateDigit(sym, entry) {
    if (!this._sessionAllows()) return;
    if (!isDigitSymbol(sym)) return;
    const sig = this._signalFor(sym, entry);
    if (!sig) return;
    this._logSignal(entry, sym, sig);
    this._execute(sym, entry, sig);
  }

  // ── Universal AI ────────────────────────────────────────────────────────
  //
  // One pass scores every market against every contract at several durations.
  // Like the single-contract scan it runs on its own cadence, never inside the
  // tick handler, so the trade path stays short. The result is a short list of
  // readings that already clear the bar; the tick handler re-checks the top of
  // that list on the live tape before acting.
  _runUniversalScan() {
    if (!this.universal) return;
    if (Date.now() - this._universalAt < SCAN_INTERVAL_MS) return;
    this._universalAt = Date.now();
    this.universalCandidates = evaluateUniversal({
      store: this.store,
      symbols: this.universalSymbols(),
      params: this.universalParams(),
      minConf: this.universalMinConf,
    });
    this._universalPasses++;
    this.emit('universal', this.universalCandidates);
  }

  // The markets Universal AI is allowed to trade. `null` (the default) means
  // the whole universe; once the user picks favourites it is narrowed to those
  // symbols, in registry order so the scan stays deterministic.
  universalSymbols() {
    if (!this.universalMarkets || !this.universalMarkets.length) return SYMBOLS.map(s => s.sym);
    const allowed = new Set(this.universalMarkets);
    return SYMBOLS.filter(s => allowed.has(s.sym)).map(s => s.sym);
  }

  // Toggle one market in the Universal AI preference set. This is an include
  // list: with nothing chosen the AI scans everything, and the first tap starts
  // narrowing it to just the markets the user picks. Deselecting the last one
  // returns to "all markets" rather than an empty, unusable universe.
  toggleUniversalMarket(sym) {
    if (!SYMBOLS.some(s => s.sym === sym)) return;
    const all = SYMBOLS.map(s => s.sym);
    const cur = this.universalMarkets ? this.universalMarkets.slice() : [];
    const i = cur.indexOf(sym);
    if (i >= 0) cur.splice(i, 1); else cur.push(sym);
    // Keep registry order so the scan stays deterministic, and collapse a set
    // that is empty or covers everything back to the "all markets" default.
    this.universalMarkets = (cur.length && cur.length < all.length)
      ? all.filter(s => cur.includes(s)) : null;
    this._universalAt = 0;
    this.universalCandidates = [];
    this.log(`[AI] Markets → ${this.universalMarkets ? this.universalMarkets.join(', ') : 'all'}`, 'i');
    this.emit('state', this.snapshot());
    if (this.universal && this.running) this._runUniversalScan();
  }

  setUniversalMarkets(syms) {
    const all = SYMBOLS.map(s => s.sym);
    const next = Array.isArray(syms) ? syms.filter(s => all.includes(s)) : [];
    this.universalMarkets = next.length && next.length < all.length ? next : null;
    this._universalAt = 0;
    this.universalCandidates = [];
    this.emit('state', this.snapshot());
    if (this.universal && this.running) this._runUniversalScan();
  }

  // Reset the Universal AI preference back to the whole universe.
  clearUniversalMarkets() {
    this.universalMarkets = null;
    this._universalAt = 0;
    this.universalCandidates = [];
    this.emit('state', this.snapshot());
    if (this.universal && this.running) this._runUniversalScan();
  }

  // The trade decision for universal mode, taken synchronously on the tick.
  _universalTick() {
    // Natural cadence: at most one entry per UNIVERSAL_MIN_GAP_MS. This is the
    // difference between a bot that trades the tape and one that trades a timer
    // — when nothing clears the bar in the window, it simply does not trade.
    if (Date.now() - this._universalLastTradeAt < UNIVERSAL_MIN_GAP_MS) return;
    const list = this.universalCandidates;
    if (!list.length) return;
    const p = this.universalParams();
    // Candidates are sorted best-first; take the first live reading that still
    // clears the bar. A confirmation failure on the top one does not block the
    // runner-up, which is how a fading edge is skipped instead of traded.
    for (const cand of list.slice(0, 8)) {
      const sig = confirmCandidate(cand, this.store, p.accuracy, this.universalMinConf);
      if (!sig) continue;
      this._universalLastTradeAt = Date.now();
      this._executeUniversal(cand, sig);
      return;
    }
  }

  // Dedicated parameter block for universal mode so the stake and risk caps are
  // independent of whichever contract the user last had selected.
  universalParams() {
    if (!this._universalParams) {
      this._universalParams = {
        stake: 1, accuracy: 'max', ...accuracyParams('max'),
        takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0,
        martingale: false, martMult: 2, martSteps: 3,
      };
    }
    return this._universalParams;
  }

  // Merge a patch into the Universal AI parameter block. Kept separate from
  // setParams so the AI's stake, martingale and risk caps never inherit a value
  // the user set on some single contract.
  setUniversalParams(patch) {
    const next = { ...this.universalParams(), ...patch };
    if (patch.accuracy) Object.assign(next, accuracyParams(patch.accuracy));
    this._universalParams = next;
    this.emit('state', this.snapshot());
  }

  setUniversal(on) {
    this.universal = !!on;
    this._universalAt = 0;
    this._universalLastTradeAt = 0;
    this.universalCandidates = [];
    if (this.universal) this._runUniversalScan();
    this.log(`[AI] Universal scanner ${this.universal ? 'on — any market, any contract' : 'off'}`, 'i');
    this.emit('state', this.snapshot());
  }

  setUniversalMinConf(v) {
    const n = Math.max(50, Math.min(99, Math.round(+v || UNIVERSAL_MIN_CONF)));
    this.universalMinConf = n;
    this._universalAt = 0;
    this.log(`[AI] Minimum confidence → ${n}%`, 'i');
    this.emit('state', this.snapshot());
  }

  _executeUniversal(cand, sig) {
    const entry = cand.entry;
    this._ensureSpecs(entry, cand.sym, () => {
      this._execStart = Date.now();
      const p = this.universalParams();
      const stake = this._stakeFor(p);
      const value = buildAutoValue(entry, { ...p, duration: cand.duration, unit: cand.unit });
      value.stake = stake;
      const raw = buildProposal(entry.typeId, entry.side, value, cand.sym);

      // Mirror the winning contract into the engine's selected contract so the
      // Trade tab and the stats line show what is actually running.
      this.autoContractKey = entry.key;
      this.autoMarket = cand.sym;
      this.lastSignal = {
        action: entry.side === 'down' ? 'FALL' : 'RISE',
        conf: sig.conf, src: entry.key, stake, asset: cand.sym,
        label: entry.label, dur: cand.durLabel,
        rationale: sig.rationale,
      };
      this.log(`[AI] ${entry.label} ${cand.durLabel} $${stake.toFixed(2)} ${cand.sym}`
        + ` (${sig.conf}% · ${sig.rationale})`, 's');
      this.toast(`AI: ${entry.label} on ${cand.sym} @ ${sig.conf}%`, 'info');
      this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
      this._shapedSend(entry, cand.sym, raw);
    });
  }

  // ── Market capability (contracts_for) ──────────────────────────────────
  //
  // Before the first proposal on a market, fetch that market's catalogue once
  // and cache it. `run` executes immediately when the catalogue is known (the
  // common case after the first pass) or on arrival; if the socket is not up
  // yet, `run` is invoked with no specs so the trade is never silently dropped.
  _ensureSpecs(entry, sym, run) {
    const cached = this._cfCache.get(sym);
    if (cached && (Date.now() - cached.at) < SPEC_TTL_MS) {
      if (!cached.avail.length) return;   // fetch failed earlier — skip, do not send blind
      const { available } = shapeProposal(entry, {}, cached.avail);
      if (available === false) {
        this.log(`[AI] ${entry.label} not offered on ${sym} — skipping`, 'w');
        return;
      }
      run();
      return;
    }
    // A fetch is already in flight for this market; skip this tick and let the
    // cadence retry once the catalogue lands, rather than sending unshaped.
    if (this._cfPending.has(sym)) return;
    const started = this.client?.requestContractsFor?.(sym, msg => {
      this._cfPending.delete(sym);
      if (msg?.error || !msg?.contracts_for) {
        this._cfCache.set(sym, { at: Date.now(), avail: [] });   // cache the miss
        return;
      }
      const avail = msg.contracts_for.available || [];
      this._cfCache.set(sym, { at: Date.now(), avail });
      const { available } = shapeProposal(entry, {}, avail);
      if (available === false) {
        this.log(`[AI] ${entry.label} not offered on ${sym} — skipping`, 'w');
        return;
      }
      run();
    });
    if (started == null) { run(); return; }   // no socket yet
    if (!this._cfCache.has(sym)) this._cfPending.add(sym);
  }

  _specs(sym) {
    const c = this._cfCache.get(sym);
    if (!c) return null;
    // Overlay any barrier list the exchange has handed us via a rejection. This
    // survives a catalogue refresh, so a market's real ladder is learned once.
    if (this._cfBarrierFix?.size) {
      for (const row of c.avail) {
        const fix = this._cfBarrierFix.get(`${sym}:${row.contract_category}`);
        if (fix) { row.barrier_choices = fix; row.barrier = fix[0]; }
      }
    }
    return c.avail;
  }

  // A rejection that names the acceptable barriers is a gift: it is the exact
  // list the proposal endpoint enforces, which can differ from the ladder the
  // catalogue advertises (spot-derived vanillas on R_75 diverge in particular).
  // Remember it for the session so the retry — and every later entry on this
  // market — snaps to that list.
  _learnBarriers(sym, category, message) {
    // Barriers contain decimal points, so stop at the sentence period only —
    // never at a '.' that sits inside a number.
    const m = /Barriers available are ([^;]+?)\.(?:\s|$)/i.exec(message || '');
    if (!m) return;
    const choices = m[1].split(',').map(s => s.trim()).filter(Boolean);
    if (!choices.length) return;
    this._cfBarrierFix = this._cfBarrierFix || new Map();
    this._cfBarrierFix.set(`${sym}:${category}`, choices);
  }

  // Warm the per-market catalogue for every subscribed symbol so the first live
  // entry has the specs in hand and is shaped correctly on the spot.
  _prefetchSpecs() {
    if (!this.client?.requestContractsFor) return;
    for (const s of SYMBOLS) {
      const sym = s.sym;
      const c = this._cfCache.get(sym);
      if ((c && (Date.now() - c.at) < SPEC_TTL_MS) || this._cfPending.has(sym)) continue;
      const started = this.client.requestContractsFor(sym, msg => {
        this._cfPending.delete(sym);
        const avail = (msg && !msg.error && msg.contracts_for) ? (msg.contracts_for.available || []) : [];
        this._cfCache.set(sym, { at: Date.now(), avail });
      });
      if (started != null) this._cfPending.add(sym);
    }
  }

  // ── Multi-market scan ──────────────────────────────────────────────────
  //
  // One pass ranks every eligible market for the selected contract. The engine
  // then bets on the leader: for digit contracts that means "whichever index is
  // showing the strongest, most stable bias right now", which is a decision no
  // single-market strategy can make. The scan runs on a cadence in the
  // background — the tick handler never pays for it.
  _runScan() {
    if (!this.running || !this.autoSwitch) return;
    if (Date.now() - this._scanAt < SCAN_INTERVAL_MS) return;
    this._scanAt = Date.now();
    const best = this.scanner.scan();
    this.emit('scan', this.scanner.top(8));
    if (!best || best.sym === this.autoMarket) return;

    const cur = this.scanner.rows.get(this.autoMarket);
    // Only chase a leader that is clearly ahead of the current market, so the
    // engine does not flip between two near-equal indices.
    if (cur && cur.score > -Infinity && best.score < cur.score * 1.15) return;
    const from = this.autoMarket;
    this.autoMarket = best.sym;
    this._lastSwitch = Date.now();
    this._lastSwitchReason = `${from} → ${best.sym}`;
    this.log(`[SCAN] ${this.scanner.scans} pass — leader ${best.sym}`
      + (best.conf != null ? ` ${best.conf}%` : '')
      + ` (was ${from})`, 'i');
    this.toast(`Scanner picked ${best.sym}`, 'info');
    this.emit('state', this.snapshot());
  }

  // ── Trade execution ────────────────────────────────────────────────────
  _execute(sym, entry, sig) {
    this._ensureSpecs(entry, sym, () => {
      this._execStart = Date.now();
      const p = this.paramsFor(entry.key);
      const stake = this._stakeFor(p);
      const value = buildAutoValue(entry, p);
      value.stake = stake;
      const raw = buildProposal(entry.typeId, entry.side, value, sym);

      this.lastSignal = {
        action: entry.side === 'down' ? 'FALL' : 'RISE',
        conf: sig.conf, src: entry.key, stake, asset: sym,
        label: entry.label,
      };
      this.log(`[TRADE] ${entry.label} $${stake.toFixed(2)} ${sym}`
        + (raw.barrier != null ? ` barrier=${raw.barrier}` : '')
        + (raw.multiplier ? ` x${raw.multiplier}` : '')
        + (raw.growth_rate ? ` growth=${raw.growth_rate}` : '')
        + ` (${sig.conf}%)`, 't');
      this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
      this._shapedSend(entry, sym, raw);
    });
  }

  // Shape and send a proposal, with a single retry that force-refreshes the
  // market catalogue first. Spot-derived barriers (turbo/vanilla/range) can be
  // rejected if the exchange has re-priced them since the catalogue was read;
  // re-reading and re-sending turns that rare race into a successful trade
  // instead of a dropped signal. Non-barrier rejections are not retried.
  _shapedSend(entry, sym, raw, attempt = 0) {
    const { fields } = shapeProposal(entry, raw, this._specs(sym));
    const retry = attempt > 0 ? null : () => {
      this._learnBarriers(sym, categoryForType(entry.typeId), this._lastProposalError);
      this._shapedSend(entry, sym, raw, attempt + 1);
    };
    this._sendProposal(fields, retry);
  }

  _stakeFor(p) {
    const base = Math.max(MIN_STAKE, Math.min(MAX_STAKE, +p.stake || 1));
    if (!p.martingale) return base;
    const mult = Math.max(1.1, Math.min(5, +p.martMult || 2));
    const steps = Math.min(this._martSteps, Math.max(1, +p.martSteps || 6));
    return Math.max(MIN_STAKE, Math.min(MAX_STAKE, +(base * Math.pow(mult, steps)).toFixed(2)));
  }

  _sendProposal(fields, retry) {
    const ok = this.client?.send({ proposal: 1, ...fields });
    if (!ok) { this.activeContracts.delete('sending'); this.log('[TRADE] WS not open', 'e'); return; }
    this._proposalRetry = retry || null;
    if (this.sendingTimeout) clearTimeout(this.sendingTimeout);
    this.sendingTimeout = setTimeout(() => {
      this.activeContracts.delete('sending');
      this._proposalRetry = null;
      this.log(`[TRADE] Proposal timed out (no response in ${PROPOSAL_TIMEOUT / 1000}s)`, 'w');
    }, PROPOSAL_TIMEOUT);
  }

  // Manual trade from the Trade tab (kept for the single-trade flow).
  placeTrade(type, side, value) {
    if (!this.client?.auth) { this.log('[TRADE] Authorize first', 'e'); return false; }
    if (this.activeContracts.size >= 1) { this.toast('Contract active — wait', 'w'); return false; }
    const sym = this.selectedMarket || SYMBOLS[0].sym;
    const raw = buildProposal(type, side, value, sym);
    const entry = findEntryByTypeSide(type, side) || { typeId: type, side, label: raw.contract_type, inputs: [] };
    this._ensureSpecs(entry, sym, () => {
      this.lastSignal = {
        action: side === 'down' ? 'FALL' : 'RISE', conf: 100, src: 'MANUAL',
        stake: raw.amount, dur: raw.duration, durUnit: raw.duration_unit, asset: sym,
      };
      this.log(`[TRADE] ${raw.contract_type} $${raw.amount.toFixed(2)} ${sym} via MANUAL`, 't');
      this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
      this._shapedSend(entry, sym, raw);
    });
    return true;
  }

  digitHistory(sym) { return this.store.digHist[sym] || []; }

  _onProposal(msg) {
    if (!msg.proposal) {
      this.log(`[PROP] Rejected: ${JSON.stringify(msg.error || msg)}`, 'e');
      if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
      this.activeContracts.delete('sending');
      const retry = this._proposalRetry;
      this._proposalRetry = null;
      this._lastProposalError = msg.error?.message || '';
      // A spot-derived barrier can be rejected if the exchange re-priced it
      // between the catalogue read and the proposal. Adopt the barrier list the
      // rejection reports and resend once; anything else (bad duration,
      // insufficient stake, no return) is a genuine configuration miss.
      if (retry && /Barrier|barrier|return/i.test(this._lastProposalError)) retry();
      return;
    }
    this._proposalRetry = null;
    if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
    const p = msg.proposal;
    this.activeContracts.delete('sending');
    if (this.activeContracts.has('pending')) { this.log('[PROP] Buy already in flight — skip duplicate', 'w'); return; }
    // Tick → proposal received, the number that decides whether the entry
    // still matches the signal that triggered it.
    if (this._tickAt) { this._recordExec(Date.now() - this._tickAt); }
    this.activeContracts.set('pending', { id: p.id, price: p.ask_price, time: Date.now() });
    if (!this.client?.buy(p.id, p.ask_price)) this.log('[PROP] WS not open for buy', 'e');
  }

  _onBuy(msg) {
    if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
    this.activeContracts.delete('pending');
    this.activeContracts.delete('sending');
    if (msg.buy) {
      const b = msg.buy;
      const sym = this.lastSignal?.asset || this.selectedMarket;
      // Pin the parameters this entry was opened under, so settlement applies
      // the martingale ladder of the mode that actually traded — universal mode
      // reads its own block, and a mid-flight mode switch cannot corrupt it.
      const p = this.universal ? this.universalParams() : this.paramsFor(this.autoContractKey);
      this.activeContracts.set(b.contract_id, { id: b.contract_id, price: b.buy_price, time: Date.now(), sym, params: { ...p } });
      this.trades++;
      this.positions = [{
        id: b.contract_id, contractType: b.longcode || b.contract_type,
        symbol: sym, stake: b.buy_price, payout: null,
        entry: null, status: 'open', sideLabel: b.contract_type,
        decimals: decimalsFor(sym), openedAt: Date.now(),
      }, ...this.positions];
      this.client.balance -= b.buy_price;
      this.log(`[BUY] #${b.contract_id} $${b.buy_price.toFixed(2)}`, 's');
      this.emit('state', this.snapshot());
    } else if (msg.error) {
      this.log(`[BUY] ${msg.error.message}`, 'e');
    }
  }

  _onContract(c) {
    if (!c) return;
    c.profit = +c.profit || 0;
    if (!(c.status === 'won' || c.status === 'lost' || c.is_sold === 1)) return;
    if (!c.contract_id) return;
    if (this.processed.has(c.contract_id)) return;
    this.processed.add(c.contract_id);
    if (this.processed.size > 500) this.processed = new Set([...this.processed].slice(-200));

    const won = c.status === 'won' || (c.is_sold === 1 && c.profit > 0);
    this.toast(`${won ? 'WIN' : 'LOSS'} ${c.profit >= 0 ? '+' : ''}${c.profit.toFixed(2)}`, won ? 'win' : 'loss');
    this.log(`[${won ? 'WIN' : 'LOSS'}] ${c.profit >= 0 ? '+' : ''}${c.profit.toFixed(2)}`, won ? 's' : 'e');

    // Settle against the parameters the contract was opened under (pinned at
    // buy time). In universal mode this is the AI's own block — without it the
    // martingale ladder stepped on the mirrored contract's params, where
    // martingale is off, so a losing run never escalated the stake.
    const p = this.activeContracts.get(c.contract_id)?.params
      || (this.universal ? this.universalParams() : this.paramsFor(this.autoContractKey));
    if (won) { this.wins++; this.consLoss = 0; this._martSteps = 0; }
    else {
      this.losses++; this.consLoss++;
      if (p.martingale) this._martSteps = Math.min(Math.max(1, +p.martSteps || 6), this._martSteps + 1);
      if (p.maxLosses > 0 && this.consLoss >= p.maxLosses && this.running) {
        this.log(`[STOP] ${this.consLoss} consecutive losses — stopping`, 'e');
        this.stop(); this.toast(`${this.consLoss} consecutive losses — engine stopped`, 'loss');
      }
    }

    this.pnl += c.profit;
    if (c.profit > this.bestTrade) this.bestTrade = c.profit;
    if (c.profit < this.worstTrade) this.worstTrade = c.profit;

    const rec = {
      id: c.contract_id,
      action: this.lastSignal?.label || this.lastSignal?.action || '—',
      strategy: this.lastSignal?.src || '—',
      stake: this.lastSignal?.stake || 0,
      profit: c.profit, won,
      balance: this.client.balance,
      time: new Date().toLocaleTimeString(),
      symbol: this.activeContracts.get(c.contract_id)?.sym
        || this.positions.find(x => x.id === c.contract_id)?.symbol
        || this.lastSignal?.asset || this.selectedMarket,
    };
    this.reports = [rec, ...this.reports].slice(0, 500);
    this.positions = this.positions.filter(x => x.id !== c.contract_id);
    this.activeContracts.delete(c.contract_id);
    if (p.maxTrades > 0 && this.running && this.trades >= p.maxTrades) {
      this.stop(); this.toast(`Trade cap reached (${p.maxTrades}) — engine stopped`, 'w');
    }
    this.emit('state', this.snapshot());
  }

  _onError(msg) {
    if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
    this.activeContracts.delete('sending');
    this.activeContracts.delete('pending');
    if (msg.error) this.log(`[API] ${msg.error.message || JSON.stringify(msg.error)}`, 'e');
  }

  // ── Control ────────────────────────────────────────────────────────────
  start() {
    if (!this.client?.auth) { this.log('[ERROR] Authorize first', 'e'); return false; }
    if (this.running) return false;
    const entry = findAutoContract(this.autoContractKey);
    // Universal mode is market- and contract-agnostic, so the digit-vs-index
    // constraint does not apply: the scan never proposes a contract on a market
    // its family cannot use.
    if (!this.universal && entry.digitFamily && !isDigitSymbol(this.autoMarket)) {
      this.toast('Digits need a Volatility index', 'w'); return false;
    }

    // Warm-up gate: never start on a cold tape. The engine waits until the
    // market it will trade has 100 ticks of history, so the first signal is
    // computed on real data instead of the first few prints. The tick stream
    // starts the run automatically once the tape is warm — the user clicks
    // START once and the bot engages by itself.
    const warm = this.warmup();
    if (!warm.ready) {
      this._startPending = true;
      this.log(`[ENGINE] Warming up — ${warm.have}/${warm.need} ticks before starting`, 'i');
      this.toast(`Warming up — ${warm.have}/${warm.need} ticks`, 'info');
      this.emit('state', this.snapshot());
      return false;
    }

    this._startPending = false;
    this.running = true;
    this.sessionStart = Date.now();
    this._martSteps = 0;
    this._lastSwitch = Date.now();
    this._lastSwitchReason = '';
    this._scanAt = 0;
    this._universalAt = 0;
    this._universalLastTradeAt = 0;
    this._execSamples = [];
    // Prime the scanner at once so the lightning path has a ranking to use on
    // the very first tick rather than waiting a full cadence.
    this._prefetchSpecs();
    if (this.universal) this._runUniversalScan();
    else this._runScan();
    this.log(`[ENGINE] Started — ${this.universal ? 'UNIVERSAL AI (any market, any contract)' : entry.label}`
      + (this.universal ? ` @ ≥${this.universalMinConf}%` : this.autoSwitch ? ' · multi-market scanner on' : ` on ${this.autoMarket}`)
      + ` · ${warm.have} ticks warm`, 's');
    if (!this._watchdog) this._watchdog = setInterval(() => this._watch(), 1000);
    this.emit('state', this.snapshot());
    return true;
  }

  // Warm-up status for the market the engine is about to trade. 100 ticks is
  // enough for every strategy window (the widest is ~160, scaled by duration)
  // to have a populated sample.
  warmup() {
    if (this.universal) {
      // Universal mode trades whatever market qualifies, so it is warm as soon
      // as a reasonable slice of the universe has history — not just one index.
      // When the user has narrowed the markets, warm-up is scoped to that set.
      const syms = this.universalSymbols();
      const ready = syms.filter(sym => (this.store.digHist[sym] || []).length >= WARMUP_TICKS).length;
      const need = Math.max(1, Math.ceil(syms.length * 0.5));
      return { sym: 'ALL', have: ready, need, ready: ready >= need, markets: syms.length };
    }
    const sym = this.autoMarket;
    const need = WARMUP_TICKS;
    const have = (this.store.digHist[sym] || []).length;
    return { sym, have, need, ready: have >= need };
  }

  stop() {
    this.running = false;
    this._startPending = false;
    if (this._watchdog) { clearInterval(this._watchdog); this._watchdog = null; }
    this.log('[ENGINE] Stopped', 'w');
    this.emit('state', this.snapshot());
  }

  _sessionAllows() {
    const p = this.universal ? this.universalParams() : this.paramsFor(this.autoContractKey);
    if (p.takeProfit > 0 && this.pnl >= p.takeProfit) {
      this.stop(); this.toast('Take profit reached — engine stopped', 'win'); return false;
    }
    if (p.stopLoss > 0 && this.pnl <= -p.stopLoss) {
      this.stop(); this.toast('Stop loss reached — engine stopped', 'loss'); return false;
    }
    if (p.maxTrades > 0 && this.trades >= p.maxTrades) {
      this.stop(); this.toast(`Trade cap reached (${p.maxTrades})`, 'w'); return false;
    }
    return true;
  }

  resetSession() {
    this.wins = 0; this.losses = 0; this.consLoss = 0;
    this.pnl = 0; this.trades = 0; this.bestTrade = 0; this.worstTrade = 0;
    this.reports = []; this.positions = [];
    this._martSteps = 0;
    this.sessionStart = null;
    this.log('[ENGINE] Session stats reset', 'i');
    this.emit('state', this.snapshot());
  }

  _watch() {
    const now = Date.now();
    this._runUniversalScan();
    if (!this.universal) this._runScan();
    for (const [k, v] of this.activeContracts.entries()) {
      if (!v || typeof v.time !== 'number') continue;
      const age = now - v.time;
      if (k === 'sending' || k === 'pending') {
        if (age > 8000) { this.activeContracts.delete(k); this.log(`[WATCH] Stale "${k}" released`, 'w'); }
        continue;
      }
      if (age > 8000) {
        this._probed = this._probed || {};
        if (!this._probed[k]) {
          this._probed[k] = true;
          this.client?.send({ proposal_open_contract: 1, contract_id: k });
        } else if (age > 90000) {
          this.activeContracts.delete(k);
        }
      }
    }
  }

  // ── Execution stats ────────────────────────────────────────────────────
  _recordExec(ms) {
    if (!Number.isFinite(ms) || ms < 0) return;
    this._execSamples = [...this._execSamples, ms].slice(-EXEC_WINDOW);
  }

  execStats() {
    const s = [...this._execSamples].sort((a, b) => a - b);
    if (!s.length) return { n: 0, p50: null, p95: null, last: null };
    const at = q => s[Math.min(s.length - 1, Math.floor(q * s.length))];
    return { n: s.length, p50: Math.round(at(0.5)), p95: Math.round(at(0.95)), last: Math.round(s[s.length - 1]) };
  }
}
