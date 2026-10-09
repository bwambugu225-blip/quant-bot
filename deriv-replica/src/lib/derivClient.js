// Deriv WebSocket client — the real connection layer.
//
// Reproduces the original bot.html transport: a single authenticated trading
// socket (WS) for balance/proposals/buys/contracts, plus an optional public
// market socket (MWS) for unauthenticated tick history. Auth follows the same
// ladder: REST accounts → WS authorize → OTP URL → direct WS with token.

// Deriv API gateways (current model — see https://developers.deriv.com/llms.txt):
//   • public market data: wss://api.derivws.com/trading/v1/options/ws/public
//     — no app id, no auth, no OTP.
//   • authenticated trading: the OTP-issued URL from POST
//     /trading/v1/options/accounts/{id}/otp (…/ws/real or …/ws/demo).
// The legacy ws.derivws.com/websockets/v3 endpoint is kept only as a fallback.
const PUBLIC_WS = 'wss://api.derivws.com/trading/v1/options/ws/public';
const WS_BASE = 'wss://ws.derivws.com/websockets/v3';
const REST_ACCOUNTS = 'https://api.derivws.com/trading/v1/options/accounts';
const DEFAULT_APP_ID = '33JFxN3sbe2usdFigbMb8';

function appId() {
  try { return localStorage.getItem('deriv_app_id') || DEFAULT_APP_ID; }
  catch (e) { return DEFAULT_APP_ID; }
}

export class DerivClient {
  constructor() {
    this.appId = appId();
    this.ws = null;          // authenticated trading socket
    this.mws = null;         // public market socket
    this.rid = 0;
    this.token = '';
    // 'oauth' sends only `Authorization: Bearer`; a Personal Access Token also
    // needs the `Deriv-App-ID` header (see developers.deriv.com). The app
    // logs in with OAuth by default and keeps the PAT path as a fallback.
    this.authMode = 'oauth';
    this._tokenProvider = null;   // async () => fresh access token, for OAuth refresh
    this.accountId = null;
    this.accountType = 'demo';
    this.balance = 0;
    this.auth = false;
    this.connected = false;
    this.handlers = {};
    this.mwsAttempts = 0;
    this._heartbeat = null;
    this._closing = false;
    this._reconn = null;
    this._reconnAttempts = 0;
  }

  on(evt, fn) { (this.handlers[evt] = this.handlers[evt] || []).push(fn); return this; }
  emit(evt, ...args) { (this.handlers[evt] || []).forEach(fn => { try { fn(...args); } catch (e) { console.error(e); } }); }
  nextId() { return ++this.rid; }

  // ── Public market socket ───────────────────────────────────────────────
  connectMarket() {
    if (this.mws && (this.mws.readyState === WebSocket.OPEN || this.mws.readyState === WebSocket.CONNECTING)) return;
    if (this._mwsReconn) { clearTimeout(this._mwsReconn); this._mwsReconn = null; }
    // Try the current public gateway first; on failure fall back to the legacy
    // v3 endpoint once, then keep retrying whichever we last used.
    const url = this._mwsUseLegacy
      ? `${WS_BASE}?app_id=${this.appId}`
      : PUBLIC_WS;
    const mws = new WebSocket(url);
    this.mws = mws;
    mws.onopen = () => {
      this.mwsAttempts = 0;
      this.emit('market-open');
      this.startHeartbeat();
    };
    mws.onmessage = e => this._onMessage(e, 'market');
    mws.onerror = () => this.emit('market-error', { url });
    mws.onclose = () => {
      if (this.mws === mws) this.mws = null;
      this.emit('market-close');
      if (!this._mwsUseLegacy) { this._mwsUseLegacy = true; this._mwsReconn = setTimeout(() => this.connectMarket(), 700); return; }
      const delay = Math.min(700 * Math.pow(1.4, this.mwsAttempts++), 8000);
      this._mwsReconn = setTimeout(() => this.connectMarket(), delay);
    };
  }

  reconnectMarket() {
    if (this._mwsReconn) { clearTimeout(this._mwsReconn); this._mwsReconn = null; }
    if (this.mws) { try { this.mws.close(); } catch (e) {} this.mws = null; }
    this.mwsAttempts = 0;
    this._mwsUseLegacy = false;
    this.connectMarket();
    this.emit('log', { t: '[MARKET] Manual reconnect', k: 'i' });
  }

  // Headers for an authenticated REST call. An OAuth access token identifies
  // the client, so Deriv-App-ID is only added for the PAT fallback. The token
  // is refreshed through the provider when one is set.
  async _authHeaders() {
    let token = this.token;
    if (this._tokenProvider) {
      try { const fresh = await this._tokenProvider(); if (fresh) token = fresh; }
      catch (e) { /* keep the existing token and let the call surface the error */ }
    }
    this.token = token;
    const headers = { Authorization: `Bearer ${token}` };
    if (this.authMode === 'pat') headers['Deriv-App-ID'] = this.appId;
    return headers;
  }

  // ── Auth ───────────────────────────────────────────────────────────────
  // `options.authMode` selects the header set: 'oauth' (bearer only) or 'pat'
  // (bearer + Deriv-App-ID). `options.tokenProvider` is an async function that
  // returns a fresh access token; when present it is consulted before every
  // authenticated REST call so an expired OAuth session refreshes in place.
  async authorize(token, options = {}) {
    this.token = token;
    this.authMode = options.authMode || this.authMode || 'oauth';
    if (options.tokenProvider !== undefined) this._tokenProvider = options.tokenProvider;
    let accounts = this._oauthAccounts;
    let restError = null;
    try {
      if (!accounts || !accounts.length) {
        const resp = await fetch(REST_ACCOUNTS, {
          method: 'GET',
          headers: await this._authHeaders(),
        });
        const body = await resp.json().catch(() => null);
        if (resp.ok) {
          accounts = (body?.data || []).map(a => ({
            account: a.account_id, token, currency: a.currency || 'USD',
            isDemo: a.account_type === 'demo' || a.is_virtual, balance: parseFloat(a.balance || 0),
          }));
          this._oauthAccounts = accounts;
        } else {
          restError = body?.errors?.[0]?.message || body?.error?.message || `HTTP ${resp.status}`;
          this.emit('log', { t: `[AUTH] REST accounts: ${restError}`, k: 'w' });
        }
      }
    } catch (e) { this.emit('log', { t: '[AUTH] REST accounts failed, trying WS…', k: 'w' }); }

    if (!accounts || !accounts.length) {
      try {
        const wsAuth = await this._wsAuthorize(token);
        if (wsAuth && wsAuth.length) { accounts = wsAuth; this._oauthAccounts = accounts; }
      } catch (e) {
        this.emit('log', { t: `[AUTH] WS authorize failed: ${e.message}`, k: 'e' });
        throw new Error(e.message || restError || 'Authorization failed — check your token');
      }
    }
    if (!accounts || !accounts.length) throw new Error(restError || 'Could not fetch Deriv accounts — check your token');

    const isDemo = a => a.account.startsWith('VR') || a.isDemo === true;
    const preferred = 'real';
    let account = preferred === 'real' ? accounts.find(a => !isDemo(a)) : accounts.find(isDemo);
    if (!account) account = accounts[0];

    this.accountId = account.account;
    this.accountType = isDemo(account) ? 'demo' : 'real';
    this.balance = account.balance || 0;
    this.emit('accounts', accounts);
    this.emit('log', { t: `[AUTH] Selected ${account.account} (${this.accountType}) $${this.balance}`, k: 's' });

    try {
      const otpResp = await fetch(`${REST_ACCOUNTS}/${account.account}/otp`, {
        method: 'POST',
        headers: await this._authHeaders(),
        body: '{}',
      });
      if (otpResp.ok) {
        const otpData = await otpResp.json();
        const wsUrl = otpData.data?.url || otpData.url;
        if (wsUrl) { this._connectOTP(wsUrl); return; }
      } else {
        const otpErr = await otpResp.json().catch(() => null);
        restError = otpErr?.errors?.[0]?.message || otpErr?.error?.message || `OTP HTTP ${otpResp.status}`;
        this.emit('log', { t: `[AUTH] OTP rejected: ${restError}`, k: 'w' });
      }
    } catch (e) { this.emit('log', { t: '[AUTH] OTP failed, trying direct WS…', k: 'w' }); }
    this._connectDirect(token);
  }

  // Switch to another account covered by the same token (demo ↔ real).
  async switchAccount(accountId) {
    const accounts = this._oauthAccounts || [];
    const account = accounts.find(a => a.account === accountId);
    if (!account) throw new Error('Account not available');
    this.accountId = account.account;
    this.accountType = account.account.startsWith('VR') || account.isDemo ? 'demo' : 'real';
    this.balance = account.balance || 0;
    this.auth = false;
    this.emit('accounts', accounts);
    try {
      const otpResp = await fetch(`${REST_ACCOUNTS}/${account.account}/otp`, {
        method: 'POST',
        headers: await this._authHeaders(),
        body: '{}',
      });
      if (otpResp.ok) {
        const otpData = await otpResp.json();
        const wsUrl = otpData.data?.url || otpData.url;
        if (wsUrl) { this._connectOTP(wsUrl); return; }
      }
    } catch (e) { /* fall through to direct */ }
    this._connectDirect(this.token);
  }

  // Recharge the virtual account. Deriv exposes this as a REST call
  // (POST /trading/v1/options/accounts/{id}/reset-demo-balance), so it needs the
  // OAuth Bearer token — the OTP trading socket has no equivalent. The response
  // reports the new balance, which we fold back into the account list.
  async topUpDemo(amount) {
    if (!this.accountId) throw new Error('Log in to top up your demo account');
    if (this.accountType !== 'demo') throw new Error('Top-up is only available on a demo account');
    const body = amount ? { balance: amount } : {};
    const resp = await fetch(`${REST_ACCOUNTS}/${this.accountId}/reset-demo-balance`, {
      method: 'POST',
      headers: { ...(await this._authHeaders()), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      const msg = data?.errors?.[0]?.message || data?.error?.message || `Top-up failed (HTTP ${resp.status})`;
      throw new Error(msg);
    }
    const next = data?.data?.balance ?? data?.balance;
    const balance = next != null ? parseFloat(next) : this.balance;
    this.balance = balance;
    const accounts = (this._oauthAccounts || []).map(a =>
      a.account === this.accountId ? { ...a, balance } : a);
    this._oauthAccounts = accounts;
    this.emit('accounts', accounts);
    this.emit('authorized', { accountId: this.accountId, accountType: this.accountType, balance });
    this.emit('log', { t: `[AUTH] Demo top-up → $${balance}`, k: 's' });
    return balance;
  }

  _wsAuthorize(token) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${WS_BASE}?app_id=${this.appId}`);
      let done = false;
      const t = setTimeout(() => { if (!done) { done = true; ws.close(); reject(new Error('timeout')); } }, 8000);
      ws.onmessage = e => {
        let msg; try { msg = JSON.parse(e.data); } catch (er) { return; }
        if (msg.msg_type === 'authorize' && !done && msg.authorize) {
          done = true; clearTimeout(t); ws.close();
          const acc = msg.authorize;
          const isVirtual = acc.is_virtual === 1 || acc.is_virtual === true || acc.loginid?.startsWith('VR');
          resolve([{ account: acc.loginid, token, currency: acc.currency || 'USD', isDemo: isVirtual, balance: parseFloat(acc.balance || 0) }]);
        } else if (msg.error) {
          if (!done) { done = true; clearTimeout(t); ws.close(); reject(new Error(msg.error.message || msg.error.code || 'authorize error')); }
        }
      };
      ws.onopen = () => ws.send(JSON.stringify({ authorize: token }));
      ws.onerror = () => { if (!done) { done = true; clearTimeout(t); reject(new Error('ws error')); } };
    });
  }

  _connectDirect(token) {
    const url = `${WS_BASE}?app_id=${this.appId}&token=${encodeURIComponent(token)}&l=EN`;
    const ws = new WebSocket(url);
    this.ws = ws;
    let authorized = false;
    const timeout = setTimeout(() => { if (!authorized) { try { ws.close(); } catch (e) {} } }, 15000);
    ws.onopen = () => ws.send(JSON.stringify({ authorize: token }));
    ws.onmessage = e => {
      let msg; try { msg = JSON.parse(e.data); } catch (ex) { return; }
      if (msg.msg_type === 'authorize' && msg.authorize) {
        authorized = true; clearTimeout(timeout);
        this._onAuthorized(msg.authorize, ws);
      } else {
        this._onMessage(e, 'trade');
      }
    };
    ws.onerror = () => { clearTimeout(timeout); this.emit('auth-failed', 'WebSocket connection failed'); };
    ws.onclose = () => {
      clearTimeout(timeout);
      if (this.ws === ws) { this.auth = false; this.connected = false; this.emit('close'); }
    };
  }

  _connectOTP(url) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this._closing = true;
      try { this.ws.close(); } catch (e) {}
    }
    const ws = new WebSocket(url);
    this.ws = ws;
    const to = setTimeout(() => { try { ws.close(); } catch (e) {} }, 15000);
    ws.onopen = () => {
      clearTimeout(to);
      this._markAuthorized();
    };
    ws.onmessage = e => this._onMessage(e, 'trade');
    ws.onerror = () => { this.connected = false; this.emit('close'); };
    ws.onclose = () => {
      clearTimeout(to);
      const intentional = this._closing;
      this._closing = false;
      this.connected = false; this.auth = false;
      this.emit('close');
      if (!intentional) this._scheduleRecon();
    };
  }

  _onAuthorized(acc, ws) {
    this.accountId = acc.loginid;
    this.accountType = (acc.loginid?.startsWith('VR') || acc.is_virtual) ? 'demo' : 'real';
    this.balance = parseFloat(acc.balance || 0);
    this.ws = ws;
    this._markAuthorized();
  }

  _markAuthorized() {
    this.auth = true;
    this.connected = true;
    this._reconnAttempts = 0;
    this.emit('authorized', { accountId: this.accountId, accountType: this.accountType, balance: this.balance });
    this.startHeartbeat();
    setTimeout(() => this.subscribeAll(), 200);
  }

  _scheduleRecon() {
    if (this._reconn) clearTimeout(this._reconn);
    const delay = Math.min(1000 * Math.pow(1.5, this._reconnAttempts++), 10000);
    this._reconn = setTimeout(() => { if (this.token) this._connectDirect(this.token); }, delay);
  }

  // ── Subscriptions ──────────────────────────────────────────────────────
  subscribeAll() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ balance: 1, subscribe: 1 });
    }
    this.connectMarket();
  }

  subscribeMarket(symbols, socket = 'both') {
    const msg = sym => ({
      ticks_history: sym, end: 'latest', count: 1100, style: 'ticks', subscribe: 1,
    });
    if ((socket === 'both' || socket === 'ws') && this.ws && this.ws.readyState === WebSocket.OPEN) {
      symbols.forEach(s => this.send(msg(typeof s === 'string' ? s : s.sym)));
    }
    if ((socket === 'both' || socket === 'mws') && this.mws && this.mws.readyState === WebSocket.OPEN) {
      symbols.forEach(s => this._sendOn(this.mws, msg(typeof s === 'string' ? s : s.sym)));
    }
    this.emit('log', { t: `[SUB] ${symbols.length} markets · 1100 ticks`, k: 'i' });
  }

  send(obj) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify({ ...obj, req_id: obj.req_id || this.nextId() }));
    return true;
  }

  _sendOn(ws, obj) { ws.send(JSON.stringify({ ...obj, req_id: obj.req_id || this.nextId() })); }

  startHeartbeat() {
    if (this._heartbeat) return;
    this._heartbeat = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) { try { this.send({ ping: 1 }); } catch (e) {} }
      if (this.mws && this.mws.readyState === WebSocket.OPEN) { try { this._sendOn(this.mws, { ping: 1 }); } catch (e) {} }
    }, 15000);
  }

  stopHeartbeat() { if (this._heartbeat) { clearInterval(this._heartbeat); this._heartbeat = null; } }

  _onMessage(e, source) {
    let msg; try { msg = JSON.parse(e.data); } catch (ex) { return; }
    if (msg.msg_type === 'ping' || msg.msg_type === 'pong') return;
    if (msg.req_id && this._cfCbs && this._cfCbs[msg.req_id]) {
      const cb = this._cfCbs[msg.req_id]; delete this._cfCbs[msg.req_id]; cb(msg); return;
    }
    if (msg.req_id && this._payoutCbs && this._payoutCbs[msg.req_id]) { this._resolvePayout(msg); return; }
    // Chart history streams keep the same req_id, so the callback stays
    // registered for the life of the subscription (forget stops it upstream).
    if (msg.req_id && this._histCbs && this._histCbs[msg.req_id]) { this._histCbs[msg.req_id](msg); return; }
    this.emit('message', msg, source);
  }

  // The `contracts_for` catalogue for one symbol: the authoritative list of
  // which contract types the market offers and the exact barrier/duration
  // ranges each accepts. The engine uses it to shape a valid proposal instead
  // of guessing. Routed over the public socket, same as payout lookups.
  requestContractsFor(symbol, cb) {
    const socket = (this.mws && this.mws.readyState === WebSocket.OPEN)
      ? this.mws
      : (this.ws && this.ws.readyState === WebSocket.OPEN ? this.ws : null);
    if (!socket) return null;
    const id = this.nextId();
    this._cfCbs = this._cfCbs || {};
    this._cfCbs[id] = cb;
    this._sendOn(socket, { contracts_for: symbol, req_id: id });
    return id;
  }

  // Buy a contract from a proposal id/price.
  buy(proposalId, price) {
    this.send({ buy: proposalId, price, subscribe: 1 });
  }

  // ── Live payout (public socket) ────────────────────────────────────────
  // Deriv quotes an accurate payout for a proposal. Public market data can
  // price a proposal without authentication, so route payout lookups over the
  // public socket — the user sees real odds before they log in or trade.
  requestPayout(fields, cb) {
    const socket = (this.mws && this.mws.readyState === WebSocket.OPEN)
      ? this.mws
      : (this.ws && this.ws.readyState === WebSocket.OPEN ? this.ws : null);
    if (!socket) return null;
    const id = this.nextId();
    this._payoutCbs = this._payoutCbs || {};
    this._payoutCbs[id] = cb;
    this._sendOn(socket, {
      proposal: 1, amount: 1, basis: 'stake', currency: 'USD', ...fields, req_id: id,
    });
    return id;
  }

  // ── Chart history / streaming (public socket) ──────────────────────────
  // SmartCharts owns rendering; the host just answers its data requests. These
  // two methods route a ticks_history respond/stream to the requesting chart
  // callback and a forget to stop it, so the chart can drive the public feed.
  _chartSocket() {
    return (this.mws && this.mws.readyState === WebSocket.OPEN)
      ? this.mws
      : (this.ws && this.ws.readyState === WebSocket.OPEN ? this.ws : null);
  }

  requestHistory(fields, cb, subscribe = false) {
    const socket = this._chartSocket();
    if (!socket) return null;
    const id = this.nextId();
    this._histCbs = this._histCbs || {};
    this._histCbs[id] = cb;
    this._sendOn(socket, { ...fields, req_id: id, ...(subscribe ? { subscribe: 1 } : {}) });
    return id;
  }

  forgetHistory(subscriptionId) {
    const socket = this._chartSocket();
    if (socket && subscriptionId) this._sendOn(socket, { forget: subscriptionId });
  }

  // One-shot request (active_symbols / trading_times etc.) resolved to a
  // Promise. Reuses the history callback map, so responses never touch the
  // engine's own message router.
  requestOnce(fields) {
    return new Promise((resolve, reject) => {
      const id = this.requestHistory(fields, msg => {
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg);
      });
      if (id == null) reject(new Error('no socket'));
    });
  }

  _resolvePayout(msg) {
    const cb = this._payoutCbs?.[msg.req_id];
    if (!cb) return;
    delete this._payoutCbs[msg.req_id];
    if (msg.error || !msg.proposal) cb(null);
    else cb({ payout: +msg.proposal.payout || 0, askPrice: +msg.proposal.ask_price || 0 });
  }

  // Currency is fixed per account on Deriv, but the UI reads it here so a
  // future multi-currency account list can drive it.
  setCurrency(currency) { this.currency = currency || 'USD'; this.emit('log', { t: `[AUTH] Currency ${this.currency}`, k: 'i' }); }

  close() {
    this._closing = true;
    this.stopHeartbeat();
    if (this.ws) { try { this.ws.close(); } catch (e) {} }
    if (this.mws) { try { this.mws.close(); } catch (e) {} }
    this.ws = null; this.mws = null;
    this.auth = false; this.connected = false;
  }
}

export { DEFAULT_APP_ID };
