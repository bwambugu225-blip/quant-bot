// Trading engine.
//
// Data: imports a 1000-tick history per symbol from Deriv and keeps every
// timeframe (5s/10s/15s/30s, 1m–15m) live via the MarketStore.
// Automation: runs the user's strategy builder output. On each closed candle of
// the strategy's timeframe the compiled strategy is evaluated; a long signal
// buys CALL, a short signal buys PUT, sized and risk-capped by the strategy's
// risk block. This is the same compiled form the backtester uses.
// Manual: placeTrade() places any catalogue contract on demand.
import { MarketStore, IMPORT_TICKS, TF_SEC } from './marketStore.js';
import { SYMBOLS, isDigitSymbol, decimalsFor, digitOf } from './symbols.js';
import { buildProposal } from './contracts.js';
import { evaluateStrategy, validateStrategy, describeStrategy } from './strategyBuilder.js';
import { runBacktest } from './backtest.js';

const MIN_STAKE = 0.35;
const MAX_STAKE = 200;
const PROPOSAL_TIMEOUT = 6000;
const WARMUP_TICKS = 100;
const EXEC_WINDOW = 40;
// How long a market's contracts_for catalogue is trusted. Spot-derived barriers
// are re-priced every few seconds, so a cached ladder goes stale; one minute
// keeps proposals valid without refetching on every entry.
const SPEC_TTL_MS = 60000;

function defaultRisk() {
  return {
    stake: 1, takeProfit: 0, stopLoss: 0, maxTrades: 0, maxLosses: 0,
    martingale: false, martMult: 2, martSteps: 3, sizing: 'fixed',
  };
}

export class Engine {
  constructor() {
    this.store = new MarketStore();
    this.client = null;

    this.selectedSymbol = 'R_100';
    this.selectedTf = '5s';
    this.running = false;
    this.strategy = null;

    this.activeContracts = new Map();
    this.processed = new Set();
    this.sendingTimeout = null;
    this._watchdog = null;
    this._subscribed = new Set();
    this._marketOnTrading = false;
    this._lastEvalCandle = {};

    this.wins = 0; this.losses = 0; this.consLoss = 0;
    this.pnl = 0; this.trades = 0;
    this.bestTrade = 0; this.worstTrade = 0;
    this.positions = [];
    this.reports = [];
    this.lastSignal = null;
    this.logs = [];
    this.toasts = [];
    this.accounts = [];
    this.sessionStart = null;
    this._martSteps = 0;
    this._execSamples = [];
    this._tickAt = 0;

    this._listeners = {};
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
    const data = { msg, kind, at: Date.now() };
    this.toasts = [...this.toasts, data].slice(-20);
    this.emit('toast', data);
  }

  attach(client) {
    this.client = client;
    client.on('message', msg => this.onMessage(msg));
    client.on('authorized', info => { this.emit('authorized', info); this.emit('state', this.snapshot()); });
    client.on('market-open', () => {
      this._subscribed.clear();
      this.log('[MARKET] Public socket connected — importing market history', 's');
      this._subscribeMarkets();
    });
    client.on('market-close', () => this.log('[MARKET] Public socket closed — retrying', 'w'));
    client.on('market-error', (info) => {
      this.log(`[MARKET] Socket error (${info?.url || '?'}) — check network/firewall`, 'e');
      this._marketErrors = (this._marketErrors || 0) + 1;
      if (this._marketErrors === 3 && client.ws?.readyState === WebSocket.OPEN) {
        this.log('[MARKET] Falling back to the trading socket for ticks', 'w');
        this._subscribed.clear();
        this._marketOnTrading = true;
        this._subscribeMarkets();
      }
    });
    client.on('accounts', accounts => { this.accounts = accounts; this.emit('state', this.snapshot()); });
    client.on('log', ({ t, k }) => this.log(t, k));
    client.on('close', () => this.emit('state', this.snapshot()));
  }

  switchAccount(accountId) { return this.client?.switchAccount(accountId); }

  async topUpDemo(amount) {
    if (!this.client) throw new Error('Not connected');
    await this.switchToDemo();
    const balance = await this.client.topUpDemo(amount);
    this.emit('state', this.snapshot());
    return balance;
  }

  demoAccount() { return (this.accounts || []).find(a => a.account?.startsWith('VR') || a.isDemo); }

  async switchToDemo() {
    if (this.client?.accountType === 'demo') return this.client.accountId;
    const demo = this.demoAccount();
    if (!demo) throw new Error('No demo account is available for this login');
    await this.switchAccount(demo.account);
    return demo.account;
  }

  // Subscribe every symbol; each gets a 1000-tick history then a live stream.
  _subscribeMarkets() {
    if (!this.client) return;
    const pending = SYMBOLS.filter(s => !this._subscribed.has(s.sym));
    if (!pending.length) return;
    pending.forEach(s => this._subscribed.add(s.sym));
    this.client.subscribeMarket(pending, this._marketOnTrading ? 'ws' : 'mws');
  }

  // ── Selection ──────────────────────────────────────────────────────────
  setSymbol(sym) {
    this.selectedSymbol = sym;
    this.log(`[ENGINE] Market → ${sym}`, 'i');
    this.emit('state', this.snapshot());
  }

  setTimeframe(tf) {
    this.store.setTimeframe(tf);
    this.selectedTf = tf;
    this.emit('state', this.snapshot());
  }

  setStrategy(strategy) {
    this.strategy = strategy;
    this._lastEvalCandle = {};
    this.emit('state', this.snapshot());
  }

  setRisk(patch) {
    if (!this.strategy) return;
    this.strategy = { ...this.strategy, risk: { ...defaultRisk(), ...this.strategy.risk, ...patch } };
    this.emit('state', this.snapshot());
  }

  // ── Snapshot for React ─────────────────────────────────────────────────
  snapshot() {
    return {
      running: this.running,
      auth: !!this.client?.auth,
      accountId: this.client?.accountId || null,
      accountType: this.client?.accountType || 'demo',
      balance: this.client?.balance || 0,
      accounts: this.accounts || [],
      selectedSymbol: this.selectedSymbol,
      selectedTf: this.selectedTf,
      strategy: this.strategy,
      strategyValid: this.strategy ? validateStrategy(this.strategy).length === 0 : false,
      strategyDesc: this.strategy ? describeStrategy(this.strategy) : '',
      risk: this.strategy?.risk || defaultRisk(),
      wins: this.wins, losses: this.losses, pnl: this.pnl, trades: this.trades,
      consLoss: this.consLoss,
      bestTrade: this.bestTrade, worstTrade: this.worstTrade,
      openCount: this.positions.length,
      positions: this.positions,
      reports: this.reports,
      lastSignal: this.lastSignal,
      warmup: this.warmup(),
      exec: this.execStats(),
      sessionStart: this.sessionStart,
      ticks: this.store.tickCount(this.selectedSymbol),
      importTicks: IMPORT_TICKS,
    };
  }

  // ── Message routing ────────────────────────────────────────────────────
  onMessage(msg) {
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
    if (msg.error) {
      this.log(`[MARKET] ${sym || 'history'} rejected: ${msg.error.message}`, 'e');
      return;
    }
    this.store.onHistory(sym, msg.history?.times || [], msg.history?.prices || []);
    this.log(`[MARKET] ${sym} — imported ${msg.history?.times?.length || 0} ticks`, 'i');
    this.emit('history', sym);
    this.emit('state', this.snapshot());
  }

  _onTick(msg) {
    const t = msg.tick;
    if (!t) return;
    const sym = t.symbol;
    const price = +t.quote;
    const epoch = +t.epoch;
    if (!sym || !Number.isFinite(price) || !Number.isFinite(epoch)) return;

    this.store.onTick(sym, price, epoch);
    this.emit('tick', { sym, price, epoch, digit: digitOf(price, sym) });

    // A pending start engages itself the moment the selected market is warm —
    // the user clicks START once, the import finishes, and trading begins.
    if (this._startPending && this.warmup().ready) {
      this.log('[ENGINE] Warm-up complete — starting', 's');
      this.start();
      return;
    }

    if (sym === this.selectedSymbol) {
      this._tickAt = Date.now();
      this._maybeEvaluate(sym);
    }
  }

  // Evaluate the strategy when a new candle of the strategy timeframe has
  // closed on the selected symbol. Automation never runs inside a forming
  // candle — the signal is a statement about a completed bar.
  _maybeEvaluate(sym) {
    if (!this.running || !this.strategy) return;
    if (this.activeContracts.size > 0) return;
    if (!this._sessionAllows()) return;

    const tf = this.strategy.timeframe || '5s';
    const candles = this.store.candles(sym, tf);
    if (candles.length < 3) return;
    // The last candle in the buffer is still forming; act on the one before it
    // once it is complete, i.e. when a newer candle exists.
    const closedIdx = candles.length - 2;
    const closed = candles[closedIdx];
    if (!closed) return;
    const seenKey = `${sym}:${tf}`;
    if (this._lastEvalCandle[seenKey] === closed.epoch) return;
    this._lastEvalCandle[seenKey] = closed.epoch;

    const signal = evaluateStrategy(this.strategy, candles.slice(0, closedIdx + 1));
    if (!signal) return;
    if (signal.action === 'both') return;
    this._execute(sym, signal);
  }

  // ── Strategy execution ─────────────────────────────────────────────────
  _execute(sym, signal) {
    const s = this.strategy;
    const p = { ...defaultRisk(), ...s.risk };
    const stake = this._stakeFor(p);
    const side = signal.action === 'up' ? 'up' : 'down';
    const value = {
      duration: s.action?.duration ?? 5,
      unit: s.action?.durationUnit || 't',
      stake,
    };
    const raw = buildProposal('rise_fall', side, value, sym);
    this.lastSignal = {
      action: side === 'up' ? 'RISE' : 'FALL',
      label: `${side === 'up' ? 'CALL' : 'PUT'} ${value.duration}${value.unit}`,
      stake, asset: sym, at: signal.at,
      rationale: `strategy "${s.name}"`,
    };
    this.log(`[TRADE] ${raw.contract_type} $${stake.toFixed(2)} ${sym}`
      + ` ${value.duration}${value.unit} (${s.name})`, 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    this._ensureSpecs(sym, () => this._sendProposal(raw));
  }

  // ── Market capability (contracts_for) ──────────────────────────────────
  //
  // Before proposing on a market, fetch and cache its catalogue once. The
  // catalogue is the authority on which contract types the market offers and
  // the barrier ladder it accepts, so a spot-derived barrier (which the
  // exchange re-prices every few seconds) is snapped to a published rung before
  // the proposal is sent. A contract the market does not list is skipped.
  _ensureSpecs(sym, run) {
    const cached = this._cfCache?.get(sym);
    if (cached && (Date.now() - cached.at) < SPEC_TTL_MS) { run(); return; }
    if (!this.client?.requestContractsFor) { run(); return; }
    this._cfCache = this._cfCache || new Map();
    this._cfPending = this._cfPending || new Set();
    if (this._cfPending.has(sym)) { run(); return; }
    const started = this.client.requestContractsFor(sym, msg => {
      this._cfPending.delete(sym);
      const avail = (msg && !msg.error && msg.contracts_for) ? (msg.contracts_for.available || []) : [];
      this._cfCache.set(sym, { at: Date.now(), avail });
    });
    if (started != null) this._cfPending.add(sym);
    run();
  }

  // Snap a barrier onto the market's published ladder when the catalogue lists
  // one for the contract's category.
  _snapBarrier(sym, category, barrier) {
    const cached = this._cfCache?.get(sym);
    if (!cached || barrier == null) return barrier;
    const row = cached.avail.find(r => r.contract_category === category);
    const choices = row?.barrier_choices || row?.barriers;
    if (!Array.isArray(choices) || !choices.length) return barrier;
    const target = +barrier;
    if (!Number.isFinite(target)) return barrier;
    let best = choices[0], bestD = Infinity;
    for (const c of choices) {
      const d = Math.abs(+c - target);
      if (d < bestD) { bestD = d; best = c; }
    }
    return best;
  }

  _sendProposal(fields) {
    const ok = this.client?.send({ proposal: 1, ...fields });
    if (!ok) { this.activeContracts.delete('sending'); this.log('[TRADE] WS not open', 'e'); return; }
    if (this.sendingTimeout) clearTimeout(this.sendingTimeout);
    this.sendingTimeout = setTimeout(() => {
      this.activeContracts.delete('sending');
      this.log(`[TRADE] Proposal timed out (no response in ${PROPOSAL_TIMEOUT / 1000}s)`, 'w');
    }, PROPOSAL_TIMEOUT);
    // Do not hold the Node event loop open in tests / headless runs.
    this.sendingTimeout.unref?.();
  }

  // Manual trade from the terminal (any catalogue contract).
  placeTrade(type, side, value) {
    if (!this.client?.auth) { this.log('[TRADE] Authorize first', 'e'); return false; }
    if (this.activeContracts.size >= 1) { this.toast('Contract active — wait', 'w'); return false; }
    const sym = this.selectedSymbol;
    const raw = buildProposal(type, side, value, sym);
    this.lastSignal = {
      action: side === 'down' ? 'FALL' : 'RISE', conf: 100, src: 'MANUAL',
      stake: raw.amount, dur: raw.duration, durUnit: raw.duration_unit, asset: sym, label: raw.contract_type,
    };
    this.log(`[TRADE] ${raw.contract_type} $${raw.amount.toFixed(2)} ${sym} via MANUAL`, 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    this._sendProposal(raw);
    return true;
  }

  _onProposal(msg) {
    if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
    if (!msg.proposal) {
      this.activeContracts.delete('sending');
      this.log(`[PROP] Rejected: ${msg.error?.message || 'unknown'}`, 'e');
      return;
    }
    const p = msg.proposal;
    this.activeContracts.delete('sending');
    if (this.activeContracts.has('pending')) { this.log('[PROP] Buy already in flight — skip duplicate', 'w'); return; }
    if (this._tickAt) this._recordExec(Date.now() - this._tickAt);
    this.activeContracts.set('pending', { id: p.id, price: p.ask_price, time: Date.now() });
    if (!this.client?.buy(p.id, p.ask_price)) this.log('[PROP] WS not open for buy', 'e');
  }

  _onBuy(msg) {
    if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
    this.activeContracts.delete('pending');
    this.activeContracts.delete('sending');
    if (msg.buy) {
      const b = msg.buy;
      const sym = this.lastSignal?.asset || this.selectedSymbol;
      const p = { ...defaultRisk(), ...(this.strategy?.risk || {}) };
      this.activeContracts.set(b.contract_id, { id: b.contract_id, price: b.buy_price, time: Date.now(), sym, params: p });
      this.trades++;
      this.positions = [{
        id: b.contract_id, contractType: b.longcode || b.contract_type,
        symbol: sym, stake: b.buy_price, payout: null,
        status: 'open', sideLabel: b.contract_type,
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
    if (!c.contract_id || this.processed.has(c.contract_id)) return;
    this.processed.add(c.contract_id);
    if (this.processed.size > 500) this.processed = new Set([...this.processed].slice(-200));

    const won = c.status === 'won' || (c.is_sold === 1 && c.profit > 0);
    this.toast(`${won ? 'WIN' : 'LOSS'} ${c.profit >= 0 ? '+' : ''}${c.profit.toFixed(2)}`, won ? 'win' : 'loss');
    this.log(`[${won ? 'WIN' : 'LOSS'}] ${c.profit >= 0 ? '+' : ''}${c.profit.toFixed(2)}`, won ? 's' : 'e');

    const p = this.activeContracts.get(c.contract_id)?.params || { ...defaultRisk(), ...(this.strategy?.risk || {}) };
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
      strategy: this.strategy?.name || 'manual',
      stake: this.lastSignal?.stake || 0,
      profit: c.profit, won,
      balance: this.client.balance,
      time: new Date().toLocaleTimeString(),
      symbol: this.activeContracts.get(c.contract_id)?.sym
        || this.positions.find(x => x.id === c.contract_id)?.symbol
        || this.lastSignal?.asset || this.selectedSymbol,
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
    if (!this.strategy) { this.toast('Build a strategy first', 'w'); return false; }
    const errors = validateStrategy(this.strategy);
    if (errors.length) { this.toast(`Strategy invalid: ${errors[0]}`, 'w'); return false; }

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
    this._execSamples = [];
    this._lastEvalCandle = {};
    this.log(`[ENGINE] Started — strategy "${this.strategy.name}" on ${this.selectedSymbol} ${this.strategy.timeframe}`, 's');
    if (!this._watchdog) {
      this._watchdog = setInterval(() => this._watch(), 1000);
      this._watchdog.unref?.();
    }
    this.emit('state', this.snapshot());
    return true;
  }

  warmup() {
    const sym = this.selectedSymbol;
    const need = WARMUP_TICKS;
    const have = this.store.tickCount(sym);
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
    const p = { ...defaultRisk(), ...(this.strategy?.risk || {}) };
    if (p.takeProfit > 0 && this.pnl >= p.takeProfit) { this.stop(); this.toast('Take profit reached — engine stopped', 'win'); return false; }
    if (p.stopLoss > 0 && this.pnl <= -p.stopLoss) { this.stop(); this.toast('Stop loss reached — engine stopped', 'loss'); return false; }
    if (p.maxTrades > 0 && this.trades >= p.maxTrades) { this.stop(); this.toast(`Trade cap reached (${p.maxTrades})`, 'w'); return false; }
    return true;
  }

  _stakeFor(p) {
    const base = Math.max(MIN_STAKE, Math.min(MAX_STAKE, +p.stake || 1));
    if (!p.martingale) return base;
    const mult = Math.max(1.1, Math.min(5, +p.martMult || 2));
    const steps = Math.min(this._martSteps, Math.max(1, +p.martSteps || 6));
    return Math.max(MIN_STAKE, Math.min(MAX_STAKE, +(base * Math.pow(mult, steps)).toFixed(2)));
  }

  resetSession() {
    this.wins = 0; this.losses = 0; this.consLoss = 0;
    this.pnl = 0; this.trades = 0; this.bestTrade = 0; this.worstTrade = 0;
    this.reports = []; this.positions = [];
    this._martSteps = 0; this.sessionStart = null;
    this.log('[ENGINE] Session stats reset', 'i');
    this.emit('state', this.snapshot());
  }

  _watch() {
    const now = Date.now();
    for (const [k, v] of this.activeContracts.entries()) {
      if (!v || typeof v.time !== 'number') continue;
      const age = now - v.time;
      if (k === 'sending' || k === 'pending') {
        if (age > 8000) { this.activeContracts.delete(k); this.log(`[WATCH] Stale "${k}" released`, 'w'); }
        continue;
      }
      if (age > 8000) {
        this._probed = this._probed || {};
        if (!this._probed[k]) { this._probed[k] = true; this.client?.send({ proposal_open_contract: 1, contract_id: k }); }
        else if (age > 90000) this.activeContracts.delete(k);
      }
    }
  }

  // ── Backtest ───────────────────────────────────────────────────────────
  // Run the current strategy over the selected symbol's history for its
  // timeframe. Uses the same candles the live path reads.
  backtest(strategy = this.strategy, sym = this.selectedSymbol, opts = {}) {
    if (!strategy) return null;
    const candles = this.store.candles(sym, strategy.timeframe || '5s');
    if (candles.length < 20) return { error: 'Not enough history to backtest — import more ticks' };
    return runBacktest(strategy, candles, opts);
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

export { defaultRisk, TF_SEC, isDigitSymbol };
