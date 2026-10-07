// Trading engine — the real execution + strategy loop, ported from bot.html.
//
// Owns: auto-engine run/stop, Rise/Fall signal trading, digit-bias trading,
// manual trades, proposal/buy/contract lifecycle, martingale, and the
// win/loss bookkeeping that feeds Positions and Reports.
import { MarketStore, SYMBOLS, isDigitSymbol, digitOf, decimalsFor } from './marketStore.js';
import { runStrategyAnalysis, evaluateDigitStrategy, digitRollingStats, pickOptimalDuration } from './strategies.js';
import { calcKelly, max, min } from './indicators.js';
import { buildProposal } from './contracts.js';

const DEFAULT_RF_STAKE = 1;
const DEFAULT_DG_STAKE = 1;
const MAX_STAKE = 200;
const MIN_STAKE = 0.35;

export class Engine {
  constructor() {
    this.store = new MarketStore();
    this.client = null;

    this.running = false;
    this.tradeMode = 'RISEFALL';        // 'RISEFALL' | 'DIGITS'
    this.selectedMarket = 'R_10';
    this.autoMarket = 'R_10';           // the only market the auto-engine trades
    this.activeContracts = new Map();
    this.processed = new Set();
    this.sendingTimeout = null;

    this.wins = 0; this.losses = 0; this.consLoss = 0;
    this.pnl = 0; this.trades = 0;
    this.bestTrade = 0; this.worstTrade = 0;
    this.positions = [];   // open contracts
    this.reports = [];     // settled contracts
    this.lastSignal = null;
    this.logs = [];
    this.toasts = [];

    this.rfStake = DEFAULT_RF_STAKE;
    this.dgStake = DEFAULT_DG_STAKE;
    this.dgMartMult = 1;
    this.dgLossStreak = 0;
    this.dgCooldownTicks = 0;
    this.dgRejectCooldown = 0;
    this.dgTakeProfit = 10;
    this.dgStopLoss = 5;

    // Automation gates — nothing trades unless it clears these.
    this.minConfidence = 0;             // Rise/Fall signal threshold (0 = any)
    this.maxConsecutiveLosses = 8;      // hard stop after this losing run
    this.maxTrades = 0;                 // session cap (0 = unlimited)
    this.useKelly = false;              // Kelly sizing for Rise/Fall

    this.martingale = { enabled: false, baseStake: 1, currentStake: 1, mult: 2, maxSteps: 6 };
    this.sessionStart = null;
    this._tickCount = 0;
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
      this.log('[MARKET] Socket connected — subscribing to 13 markets', 's');
      this._subscribeMarkets();
    });
    client.on('market-close', () => this.log('[MARKET] Socket closed — retrying', 'w'));
    client.on('market-error', (info) => {
      this.log(`[MARKET] Socket error (${info?.url || '?'}) — check network/firewall`, 'e');
      this._marketErrors = (this._marketErrors || 0) + 1;
      // Safety net: if the standalone market socket keeps failing but the
      // authenticated trading socket is up, stream market data there instead.
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

  // Switch demo/real account covered by the logged-in token.
  switchAccount(accountId) { return this.client?.switchAccount(accountId); }

  _subscribeMarkets() {
    if (!this.client) return;
    // Normally market data rides the public socket (like bot.html). If that
    // socket cannot connect, `_marketOnTrading` streams on the trading socket.
    const pending = SYMBOLS.filter(s => !this._marketSubscribed.has(s.sym));
    if (!pending.length) return;
    pending.forEach(s => this._marketSubscribed.add(s.sym));
    this.client.subscribeMarket(pending, this._marketOnTrading ? 'ws' : 'mws');
  }

  snapshot() {
    return {
      running: this.running,
      tradeMode: this.tradeMode,
      auth: !!this.client?.auth,
      accountId: this.client?.accountId || null,
      accountType: this.client?.accountType || 'demo',
      balance: this.client?.balance || 0,
      accounts: this.accounts || [],
      wins: this.wins, losses: this.losses, pnl: this.pnl, trades: this.trades,
      consLoss: this.consLoss,
      bestTrade: this.bestTrade, worstTrade: this.worstTrade,
      openCount: this.positions.length,
      martingale: { ...this.martingale },
      rfStake: this.rfStake, dgStake: this.dgStake,
      dgMartMult: this.dgMartMult, dgLossStreak: this.dgLossStreak,
      takeProfit: this.dgTakeProfit, stopLoss: this.dgStopLoss,
      autoMarket: this.autoMarket,
      minConfidence: this.minConfidence,
      maxConsecutiveLosses: this.maxConsecutiveLosses,
      maxTrades: this.maxTrades,
      useKelly: this.useKelly,
      sessionStart: this.sessionStart,
      lastSignal: this.lastSignal,
      positions: this.positions,
      reports: this.reports,
    };
  }

  // ── Message routing ────────────────────────────────────────────────────
  onMessage(msg, source) {
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
    this.log(`[HIST] ${sym}: ${(this.store.candles[sym] || []).length} candles loaded`, 'i');
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
    this._tickCount++;
    this.emit('tick', { sym, price, epoch, digit: digitOf(price, sym) });

    // The auto-engine only ever acts on its chosen market, so switching the
    // chart's market never silently redirects live automation.
    if (!this.running || sym !== this.autoMarket) return;
    if (this.activeContracts.size > 0) return;

    if (this.tradeMode === 'DIGITS') {
      if (isDigitSymbol(sym)) this._evaluateDigit(sym);
    } else if (closed) {
      this._evaluateAndTrade(sym);
    }
  }

  // ── Rise/Fall strategy loop ────────────────────────────────────────────
  _evaluateAndTrade(sym) {
    if (!this.running) return;
    if (this.activeContracts.size >= 1) return;
    if (!this._sessionAllows()) return;
    const c = this.store.candles[sym];
    if (!c || c.length < 10) return;
    const liveBuf = this.store.livePrices(sym);
    const arr = liveBuf && liveBuf.length >= 2
      ? [...c, { open: c[c.length - 1].close, high: max(liveBuf), low: min(liveBuf), close: liveBuf[liveBuf.length - 1] }]
      : c;
    const result = runStrategyAnalysis(arr);
    if (result) {
      result.lastPrice = arr[arr.length - 1].close;
      result.sym = sym;
      if (result.conf < this.minConfidence) {
        this.log(`[SIGNAL] ${sym}: ${result.action} ${result.conf}% skipped (< ${this.minConfidence}% min)`, 'i');
        return;
      }
      this.log(`[SIGNAL] ${sym}: ${result.action} ${result.conf}% (${result.src})`, 't');
      this._execTrade(result, sym);
    }
  }

  // ── Digit strategy loop ────────────────────────────────────────────────
  _evaluateDigit(sym) {
    if (!this.running) return;
    if (this.activeContracts.size >= 1) return;
    if (this.tradeMode !== 'DIGITS') return;
    if (!isDigitSymbol(sym)) return;
    if (!this._sessionAllows()) return;
    if (this.dgRejectCooldown && Date.now() < this.dgRejectCooldown) return;
    if (this.dgCooldownTicks > 0) { this.dgCooldownTicks--; return; }

    const hist = this.store.digHist[sym] || [];
    if (hist.length < 50) return;

    const factor = this.dgMartMult > 1 ? Math.pow(this.dgMartMult, this.dgLossStreak) : 1;
    const stake = +(this.dgStake * factor).toFixed(2);

    const best = evaluateDigitStrategy(hist);
    const stats = digitRollingStats(hist);
    this.log(`[DIG·ANAL] ${sym}: O2=${(stats.o2 * 100).toFixed(0)}% O3=${(stats.o3 * 100).toFixed(0)}% U6=${(stats.u6 * 100).toFixed(0)}% U7=${(stats.u7 * 100).toFixed(0)}% edge=${best ? '+' + (best.edge * 100).toFixed(1) + '%' : 'none'}`, 'i');
    if (!best) return;

    const dirLabel = best.dir.replace('DIGIT', '');
    this.log(`[DIGIT·AUTO] BIAS ${sym}: ${dirLabel} ${best.barrier} (P=${(best.p * 100).toFixed(1)}%, Edge=+${(best.edge * 100).toFixed(1)}%) stake=$${stake.toFixed(2)}`, 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    this._sendProposal({
      contract_type: best.dir, barrier: String(best.barrier), underlying_symbol: sym,
      amount: +stake.toFixed(2), basis: 'stake', currency: 'USD', duration: 1, duration_unit: 't',
    });
  }

  // ── Manual trades ──────────────────────────────────────────────────────
  // Live digit history for the analysis panel.
  digitHistory(sym) { return this.store.digHist[sym] || []; }

  // Place any trade type from the Trade form. `value` carries the form state;
  // buildProposal maps it onto the exact Deriv proposal payload.
  placeTrade(type, side, value) {
    if (!this.client?.auth) { this.log('[TRADE] Authorize first', 'e'); return false; }
    if (this.activeContracts.size >= 1) { this.toast('Contract active — wait', 'w'); return false; }
    const sym = this.selectedMarket || SYMBOLS[0].sym;
    const fields = buildProposal(type, side, value, sym);
    this.lastSignal = {
      action: side === 'down' ? 'FALL' : 'RISE', conf: 100, src: 'MANUAL',
      stake: fields.amount, dur: fields.duration, durUnit: fields.duration_unit, asset: sym,
    };
    this.log(`[TRADE] ${fields.contract_type} $${fields.amount.toFixed(2)} ${sym}`
      + (fields.duration ? ` ${fields.duration}${fields.duration_unit}` : '')
      + (fields.barrier != null ? ` barrier=${fields.barrier}` : '')
      + (fields.multiplier ? ` x${fields.multiplier}` : '')
      + (fields.growth_rate ? ` growth=${fields.growth_rate}` : '') + ' via MANUAL', 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    this._sendProposal(fields);
    return true;
  }

  placeManualRF(action, opts = {}) {
    if (!this.client?.auth) { this.log('[RF] Authorize first', 'e'); return; }
    if (this.activeContracts.size >= 1) { this.toast('Contract active — wait', 'w'); return; }
    const sym = this.selectedMarket || SYMBOLS[0].sym;
    const equals = !!opts.equals;
    const ct = action === 'RISE' ? (equals ? 'CALLE' : 'CALL') : (equals ? 'PUTE' : 'PUT');
    const stake = this.martingale.enabled ? this.martingale.currentStake : this.rfStake;
    const duration = +opts.duration || 5;
    const unit = opts.unit || 't';
    this.lastSignal = { action, conf: 100, src: 'MANUAL', stake, dur: duration, durUnit: unit, asset: sym };
    this.log(`[TRADE] ${ct} $${stake.toFixed(2)} ${sym} ${duration}${unit} via MANUAL`, 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    this._sendProposal({
      contract_type: ct, amount: +stake.toFixed(2), basis: 'stake', currency: 'USD',
      duration, duration_unit: unit, underlying_symbol: sym,
    });
  }

  placeDigitManual(contractType, barrier) {
    if (!this.client?.auth) { this.log('[DIGIT] Authorize first', 'e'); return; }
    if (this.activeContracts.size >= 1) { this.toast('Contract active — wait', 'w'); return; }
    const sym = this.selectedMarket || SYMBOLS[0].sym;
    if (!isDigitSymbol(sym)) { this.log(`[DIGIT] ${sym} doesn't support 1-tick digit contracts`, 'e'); return; }
    const hist = this.store.digHist[sym] || [];
    if (hist.length < 20) { this.log('[DIGIT] Not enough ticks', 'w'); return; }
    const factor = this.dgMartMult > 1 ? Math.pow(this.dgMartMult, this.dgLossStreak) : 1;
    const stake = +(this.dgStake * factor).toFixed(2);
    let b = barrier;
    const needsBarrier = contractType === 'DIGITOVER' || contractType === 'DIGITUNDER'
      || contractType === 'DIGITMATCH' || contractType === 'DIGITDIFF';
    if (needsBarrier) {
      if (b == null) b = (contractType === 'DIGITMATCH' || contractType === 'DIGITDIFF') ? 5 : 3;
    } else {
      b = undefined;   // Even/Odd take no barrier — Deriv rejects one
    }
    this.log(`[DIGIT] ${contractType.replace('DIGIT', '')} $${stake.toFixed(2)} ${sym}${needsBarrier ? ` barrier=${b}` : ''}`, 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    const fields = {
      contract_type: contractType, underlying_symbol: sym,
      amount: +stake.toFixed(2), basis: 'stake', currency: 'USD', duration: 1, duration_unit: 't',
    };
    if (needsBarrier) fields.barrier = String(b);
    this._sendProposal(fields);
  }

  // ── Trade execution ────────────────────────────────────────────────────
  _sendProposal(fields) {
    const ok = this.client?.send({ proposal: 1, subscribe: 1, ...fields });
    if (!ok) { this.activeContracts.delete('sending'); this.log('[TRADE] WS not open', 'e'); return; }
    if (this.sendingTimeout) clearTimeout(this.sendingTimeout);
    this.sendingTimeout = setTimeout(() => {
      this.activeContracts.delete('sending');
      this.log('[TRADE] Proposal timed out (no response in 15s)', 'w');
    }, 15000);
  }

  _execTrade(signal, asset) {
    if (this.activeContracts.size >= 1) return;
    asset = asset || this.selectedMarket || SYMBOLS[0].sym;
    let stake = this.martingale.enabled ? this.martingale.currentStake : this.rfStake;

    const { dur, unit: durUnit } = signal.dur
      ? { dur: signal.dur, unit: signal.durUnit || 't' }
      : pickOptimalDuration(signal.src, signal.conf || 80, asset, this.store.candles[asset]);
    const ct = signal.action === 'RISE' ? 'CALL' : 'PUT';

    if (!this.martingale.enabled && this.useKelly && signal.conf) {
      const recentWR = this.reports.length >= 10
        ? this.reports.slice(-10).filter(t => t.won).length / 10 : 0.5;
      const pWin = Math.min(0.95, Math.max(0.5, (signal.conf / 100) * 0.7 + recentWR * 0.3));
      const kellyFrac = calcKelly(pWin, 0.8);
      const kellyStake = +(this.rfStake * Math.min(4, kellyFrac * 5)).toFixed(2);
      stake = Math.max(MIN_STAKE, Math.min(MAX_STAKE, kellyStake));
    }

    this.lastSignal = { ...signal, stake, dur, asset };
    this.log(`[TRADE] ${ct} $${stake.toFixed(2)} ${asset} ${dur}${durUnit} via ${signal.src} (${signal.conf || '?'}%)`, 't');
    this.activeContracts.set('sending', { id: null, price: null, time: Date.now() });
    this._sendProposal({
      contract_type: ct, amount: +stake.toFixed(2), basis: 'stake', currency: 'USD',
      duration: dur, duration_unit: durUnit, underlying_symbol: asset,
    });
  }

  _onProposal(msg) {
    if (!msg.proposal) {
      this.log(`[PROP] Rejected: ${JSON.stringify(msg.error || msg)}`, 'e');
      if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
      this.activeContracts.delete('sending');
      if (this.tradeMode === 'DIGITS') {
        this.dgRejectCooldown = Date.now() + 30000;
        this.dgCooldownTicks = 60;
      }
      return;
    }
    if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
    const p = msg.proposal;
    this.log(`[PROP] ${p.id} ask=${p.ask_price}`, 'i');
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
      const decimals = decimalsFor(sym);
      this.positions = [{
        id: b.contract_id, contractType: b.longcode || b.contract_type,
        symbol: sym, stake: b.buy_price, payout: null,
        entry: null, status: 'open', sideLabel: b.contract_type, decimals,
        openedAt: Date.now(),
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

    if (won) { this.wins++; this.consLoss = 0; this.dgLossStreak = 0; }
    else {
      this.losses++; this.consLoss++;
      if ((c.contract_type || '').startsWith('DIGIT')) this.dgLossStreak++;
      if (this.maxConsecutiveLosses > 0 && this.consLoss >= this.maxConsecutiveLosses && this.running) {
        this.log(`[STOP] ${this.consLoss} consecutive losses — stopping engine`, 'e');
        this.stop(); this.toast(`${this.consLoss} consecutive losses — engine stopped`, 'loss');
      }
    }

    if (this.martingale.enabled && !(c.contract_type || '').startsWith('DIGIT')) {
      if (won) this.martingale.currentStake = this.martingale.baseStake;
      else {
        const capped = this.martingale.baseStake * Math.pow(this.martingale.mult, this.martingale.maxSteps);
        this.martingale.currentStake = Math.min(capped, +(this.martingale.currentStake * this.martingale.mult).toFixed(2));
      }
    }

    this.pnl += c.profit;
    if (c.profit > this.bestTrade) this.bestTrade = c.profit;
    if (c.profit < this.worstTrade) this.worstTrade = c.profit;
    const rec = {
      id: c.contract_id,
      action: this.lastSignal?.action || ((c.contract_type || '').startsWith('DIGIT') ? 'DIGIT' : '—'),
      strategy: this.lastSignal?.src || '—',
      stake: this.lastSignal?.stake || 0,
      profit: c.profit, won,
      balance: this.client.balance,
      time: new Date().toLocaleTimeString(),

      symbol: this.activeContracts.get(c.contract_id)?.sym
        || this.positions.find(p => p.id === c.contract_id)?.symbol
        || this.lastSignal?.asset || this.selectedMarket,
    };
    this.reports = [rec, ...this.reports].slice(0, 500);
    this.positions = this.positions.filter(p => p.id !== c.contract_id);
    this.activeContracts.delete(c.contract_id);
    if (this.maxTrades > 0 && this.running && this.trades >= this.maxTrades) {
      this.stop(); this.toast(`Trade cap reached (${this.maxTrades}) — engine stopped`, 'w');
    }
    this.emit('state', this.snapshot());
  }

  _onError(msg) {
    if (this.sendingTimeout) { clearTimeout(this.sendingTimeout); this.sendingTimeout = null; }
    this.activeContracts.delete('sending');
    this.activeContracts.delete('pending');
    if (msg.error) {
      this.log(`[API] ${msg.error.message || JSON.stringify(msg.error)}`, 'e');
      if (this.tradeMode === 'DIGITS' && this.running) {
        this.dgRejectCooldown = Date.now() + 30000;
        this.dgCooldownTicks = 60;
      }
    }
  }

  // ── Control ────────────────────────────────────────────────────────────
  start() {
    if (!this.client?.auth) { this.log('[ERROR] Authorize first', 'e'); return false; }
    if (this.running) return false;
    if (this.tradeMode === 'DIGITS' && !isDigitSymbol(this.autoMarket)) {
      this.toast('Digits need a Volatility index', 'w'); return false;
    }
    this.running = true;
    this.sessionStart = Date.now();
    this.log(`[ENGINE] Started — ${this.tradeMode} on ${this.autoMarket}`
      + ` (min conf ${this.minConfidence}%, max ${this.maxTrades || '∞'} trades)`, 's');
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

  // Gates shared by both strategy loops. Returns false when the session should
  // not open another trade.
  _sessionAllows() {
    if (this.dgTakeProfit > 0 && this.pnl >= this.dgTakeProfit) {
      this.stop(); this.toast('Take profit reached — engine stopped', 'win'); return false;
    }
    if (this.dgStopLoss > 0 && this.pnl <= -this.dgStopLoss) {
      this.stop(); this.toast('Stop loss reached — engine stopped', 'loss'); return false;
    }
    if (this.maxTrades > 0 && this.trades >= this.maxTrades) {
      this.stop(); this.toast(`Trade cap reached (${this.maxTrades})`, 'w'); return false;
    }
    return true;
  }

  // Reset the session counters without touching the connection.
  resetSession() {
    this.wins = 0; this.losses = 0; this.consLoss = 0;
    this.pnl = 0; this.trades = 0; this.bestTrade = 0; this.worstTrade = 0;
    this.reports = []; this.positions = [];
    this.dgLossStreak = 0; this.dgMartMult = 1;
    this.martingale.currentStake = this.martingale.baseStake;
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

  setMode(mode) { this.tradeMode = mode; this.log(`[ENGINE] Mode → ${mode}`, 'i'); this.emit('state', this.snapshot()); }
  setStake(kind, value) {
    const v = Math.max(MIN_STAKE, Math.min(MAX_STAKE, +value || 0));
    if (kind === 'rf') this.rfStake = v; else this.dgStake = v;
    this.emit('state', this.snapshot());
  }
  setMartingale(patch) { this.martingale = { ...this.martingale, ...patch }; this.emit('state', this.snapshot()); }
  setLimits(patch) {
    if (patch.takeProfit != null) this.dgTakeProfit = Math.max(0, +patch.takeProfit || 0);
    if (patch.stopLoss != null) this.dgStopLoss = Math.max(0, +patch.stopLoss || 0);
    this.emit('state', this.snapshot());
  }
  setMarket(sym) {
    this.autoMarket = sym;
    if (this.tradeMode === 'DIGITS' && !isDigitSymbol(sym)) {
      this.toast('Digits need a Volatility index — switched to Rise/Fall', 'w');
      this.tradeMode = 'RISEFALL';
    }
    this.log(`[ENGINE] Auto market → ${sym}`, 'i');
    this.emit('state', this.snapshot());
  }
  setAutomation(patch) {
    if (patch.minConfidence != null) this.minConfidence = Math.max(0, Math.min(100, +patch.minConfidence || 0));
    if (patch.maxConsecutiveLosses != null) this.maxConsecutiveLosses = Math.max(0, +patch.maxConsecutiveLosses || 0);
    if (patch.maxTrades != null) this.maxTrades = Math.max(0, +patch.maxTrades || 0);
    if (patch.useKelly != null) this.useKelly = !!patch.useKelly;
    this.emit('state', this.snapshot());
  }
}
