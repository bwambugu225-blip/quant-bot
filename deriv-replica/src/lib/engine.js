// Trading engine — the real execution + strategy loop.
//
// Automation is scoped to one explicit contract (e.g. "Over 3" or "Rise")
// running on one explicit market. Each contract carries its own parameters and
// its own signal function from autoStrategies.js, so changing the contract
// changes the strategy, not just the label.
import { MarketStore, SYMBOLS, isDigitSymbol, digitOf, decimalsFor } from './marketStore.js';
import { buildProposal } from './contracts.js';
import { findAutoContract, buildAutoValue, accuracyParams } from './autoStrategies.js';

const MIN_STAKE = 0.35;
const MAX_STAKE = 200;

// A proposal that never comes back would otherwise block the engine for good.
// 6s is long enough for a slow round trip and short enough that a dropped
// request costs at most one tick.
const PROPOSAL_TIMEOUT = 6000;

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

    // Auto market rotation: the engine scores every eligible market and only
    // switches when a different one is clearly better, so it does not thrash.
    this.autoSwitch = true;
    this._switchInterval = 40;   // seconds between rotations
    this._switchMargin = 1.15;   // new market must beat the current by 15%
    this._lastSwitch = 0;
    this._lastSwitchReason = '';

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

  // ── Auto market rotation ───────────────────────────────────────────────
  //
  // Digit contracts are symbol-agnostic (the digits of a random walk are
  // uniform on every index), so the meaningful choice is *when* to bet. The
  // engine therefore watches every eligible market's digit stream and moves to
  // whichever one currently shows the strongest, most stable bias for the
  // selected contract. It only moves when another market beats the current one
  // by a clear margin and enough time has passed, so the market never churns.
  _candidates() {
    const entry = findAutoContract(this.autoContractKey);
    const list = entry.digitFamily ? SYMBOLS.filter(s => isDigitSymbol(s.sym)) : SYMBOLS;
    return list.map(s => s.sym);
  }

  // Strength of the current contract's edge on a given market, or null when the
  // market does not yet have enough history to judge.
  _marketEdge(sym) {
    const entry = findAutoContract(this.autoContractKey);
    const digits = this.store.digHist[sym] || [];
    if (digits.length < 80) return null;
    const sig = this._signalFor(sym, entry, { strict: true });
    if (sig) return sig.conf + (sig.z || 0) * 4;
    // No qualifying signal: fall back to the raw distance from break-even so
    // markets can still be ranked before a signal appears.
    const W = entry.tune?.W || 100;
    const w = digits.slice(-W);
    if (w.length < 40) return null;
    const base = entry.tune?.baseline ?? 0.5;
    const f = Array(10).fill(0);
    for (const d of w) f[d]++;
    const hit = d => (
      entry.kind === 'over' ? d > entry.barrier
        : entry.kind === 'under' ? d < entry.barrier
          : entry.kind === 'match' ? d === entry.barrier
            : entry.kind === 'diff' ? d !== entry.barrier
              : entry.kind === 'even' ? d % 2 === 0
                : d % 2 === 1
    );
    let c = 0;
    for (let d = 0; d < 10; d++) if (hit(d)) c += f[d];
    const p = c / w.length;
    return p * 100 + Math.max(0, (p - base)) * 200;
  }

  // Decide whether to move the automation to a better market. Returns the new
  // symbol, or null to stay put.
  _pickBestMarket() {
    if (!this.autoSwitch || !this.running) return null;
    const now = Date.now();
    if (now - this._lastSwitch < this._switchInterval * 1000) return null;
    const cands = this._candidates();
    if (cands.length < 2) return null;
    let best = this.autoMarket, bestScore = -Infinity;
    for (const sym of cands) {
      const s = this._marketEdge(sym);
      if (s != null && s > bestScore) { bestScore = s; best = sym; }
    }
    if (best === this.autoMarket || bestScore === -Infinity) return null;
    const cur = this._marketEdge(this.autoMarket);
    if (cur != null && bestScore < cur * this._switchMargin) return null;
    return best;
  }

  setAutoSwitch(on) {
    this.autoSwitch = !!on;
    this.log(`[ENGINE] Auto market switch ${this.autoSwitch ? 'on' : 'off'}`, 'i');
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

    // Automation only ever acts on its chosen market, so browsing the chart
    // can never redirect live trades. Digit contracts are decided on the tick
    // that just printed — no waiting for a candle to close — which is what
    // keeps execution in step with the market.
    if (!this.running || sym !== this.autoMarket) return;
    if (this.activeContracts.size > 0) return;

    const entry = findAutoContract(this.autoContractKey);
    if (entry.digitFamily) this._evaluateDigit(sym, entry);
    else if (closed) this._evaluateDirectional(sym, entry);

    // Consider rotating markets after the trade decision, so a switch can
    // never race the tick that triggered it.
    this._maybeRotateMarket();
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

  _evaluateDirectional(sym, entry) {
    if (!this._sessionAllows()) return;
    const sig = this._signalFor(sym, entry);
    if (!sig) return;
    this.log(`[SIGNAL] ${entry.label} on ${sym}: ${sig.conf}% · ${sig.rationale}`, 't');
    this._execute(sym, entry, sig);
  }

  _evaluateDigit(sym, entry) {
    if (!this._sessionAllows()) return;
    if (!isDigitSymbol(sym)) return;
    const sig = this._signalFor(sym, entry);
    if (!sig) return;
    this.log(`[SIGNAL] ${entry.label} on ${sym}: ${sig.conf}% · ${sig.rationale}`, 't');
    this._execute(sym, entry, sig);
  }

  // Rotate to a stronger market when one exists. Runs on the tick stream but
  // is throttled internally, so it costs nothing per tick.
  _maybeRotateMarket() {
    if (!this.running || this.activeContracts.size > 0) return;
    const best = this._pickBestMarket();
    if (!best) return;
    const from = this.autoMarket;
    this.autoMarket = best;
    this._lastSwitch = Date.now();
    this._lastSwitchReason = `${from} → ${best}`;
    this.log(`[ENGINE] Auto-switch market ${from} → ${best} (stronger edge)`, 'i');
    this.toast(`Auto-switched to ${best}`, 'info');
    this.emit('state', this.snapshot());
  }

  // ── Trade execution ────────────────────────────────────────────────────
  _execute(sym, entry, sig) {
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
    this.running = true;
    this.sessionStart = Date.now();
    this._martSteps = 0;
    this._lastSwitch = Date.now();
    this._lastSwitchReason = '';
    this.log(`[ENGINE] Started — ${entry.label} on ${this.autoMarket}`, 's');
    if (!this._watchdog) this._watchdog = setInterval(() => this._watch(), 5000);
    this.emit('state', this.snapshot());
    return true;
  }

  stop() {
    this.running = false;
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
    for (const [k, v] of this.activeContracts.entries()) {
      if (!v || typeof v.time !== 'number') continue;
      const age = now - v.time;
      if (k === 'sending' || k === 'pending') {
        if (age > 20000) { this.activeContracts.delete(k); this.log(`[WATCH] Stale "${k}" released`, 'w'); }
        continue;
      }
      if (age > 20000) {
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
}
