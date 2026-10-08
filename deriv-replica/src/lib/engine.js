// Trading engine — the real execution + strategy loop.
//
// Automation is scoped to one explicit contract (e.g. "Over 3" or "Rise")
// running on one explicit market. Each contract carries its own parameters and
// its own signal function from autoStrategies.js, so changing the contract
// changes the strategy, not just the label.
import { MarketStore, SYMBOLS, isDigitSymbol, digitOf, decimalsFor } from './marketStore.js';
import { buildProposal } from './contracts.js';
import { findAutoContract, buildAutoValue, accuracyParams } from './autoStrategies.js';
import { MarketScanner, SCAN_INTERVAL_MS } from './marketScanner.js';

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
      params: this.paramsFor(this.autoContractKey),
      autoSwitch: this.autoSwitch,
      scan: this.scanner.top(8),
      scanCount: this.scanner.scans,
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
    this._execStart = Date.now();
    const p = this.paramsFor(entry.key);
    const stake = this._stakeFor(p);
    const value = buildAutoValue(entry, p);
    value.stake = stake;
    const fields = buildProposal(entry.typeId, entry.side, value, sym);

    this.lastSignal = {
      action: entry.side === 'down' ? 'FALL' : 'RISE',
      conf: sig.conf, src: entry.key, stake, asset: sym,
      label: entry.label,
    };
    this.log(`[TRADE] ${entry.label} $${stake.toFixed(2)} ${sym}`
      + (fields.barrier != null ? ` barrier=${fields.barrier}` : '')
      + (fields.multiplier ? ` x${fields.multiplier}` : '')
      + (fields.growth_rate ? ` growth=${fields.growth_rate}` : '')
      + ` (${sig.conf}%)`, 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    this._sendProposal(fields);
  }

  _stakeFor(p) {
    const base = Math.max(MIN_STAKE, Math.min(MAX_STAKE, +p.stake || 1));
    if (!p.martingale) return base;
    const mult = Math.max(1.1, Math.min(5, +p.martMult || 2));
    const steps = Math.min(this._martSteps, Math.max(1, +p.martSteps || 6));
    return Math.max(MIN_STAKE, Math.min(MAX_STAKE, +(base * Math.pow(mult, steps)).toFixed(2)));
  }

  _sendProposal(fields) {
    const ok = this.client?.send({ proposal: 1, ...fields });
    if (!ok) { this.activeContracts.delete('sending'); this.log('[TRADE] WS not open', 'e'); return; }
    if (this.sendingTimeout) clearTimeout(this.sendingTimeout);
    this.sendingTimeout = setTimeout(() => {
      this.activeContracts.delete('sending');
      this.log(`[TRADE] Proposal timed out (no response in ${PROPOSAL_TIMEOUT / 1000}s)`, 'w');
    }, PROPOSAL_TIMEOUT);
  }

  // Manual trade from the Trade tab (kept for the single-trade flow).
  placeTrade(type, side, value) {
    if (!this.client?.auth) { this.log('[TRADE] Authorize first', 'e'); return false; }
    if (this.activeContracts.size >= 1) { this.toast('Contract active — wait', 'w'); return false; }
    const sym = this.selectedMarket || SYMBOLS[0].sym;
    const fields = buildProposal(type, side, value, sym);
    this.lastSignal = {
      action: side === 'down' ? 'FALL' : 'RISE', conf: 100, src: 'MANUAL',
      stake: fields.amount, dur: fields.duration, durUnit: fields.duration_unit, asset: sym,
    };
    this.log(`[TRADE] ${fields.contract_type} $${fields.amount.toFixed(2)} ${sym} via MANUAL`, 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    this._sendProposal(fields);
    return true;
  }

  digitHistory(sym) { return this.store.digHist[sym] || []; }

  _onProposal(msg) {
    if (!msg.proposal) {
      this.log(`[PROP] Rejected: ${JSON.stringify(msg.error || msg)}`, 'e');
      if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
      this.activeContracts.delete('sending');
      return;
    }
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
      this.activeContracts.set(b.contract_id, { id: b.contract_id, price: b.buy_price, time: Date.now(), sym });
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

    const p = this.paramsFor(this.autoContractKey);
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
    if (entry.digitFamily && !isDigitSymbol(this.autoMarket)) {
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
    this._execSamples = [];
    // Prime the scanner at once so the lightning path has a ranking to use on
    // the very first tick rather than waiting a full cadence.
    this._runScan();
    this.log(`[ENGINE] Started — ${entry.label}`
      + (this.autoSwitch ? ' · multi-market scanner on' : ` on ${this.autoMarket}`)
      + ` · ${warm.have} ticks warm`, 's');
    if (!this._watchdog) this._watchdog = setInterval(() => this._watch(), 1000);
    this.emit('state', this.snapshot());
    return true;
  }

  // Warm-up status for the market the engine is about to trade. 100 ticks is
  // enough for every strategy window (the widest is ~160, scaled by duration)
  // to have a populated sample.
  warmup() {
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
    const p = this.paramsFor(this.autoContractKey);
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
    this._runScan();
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
