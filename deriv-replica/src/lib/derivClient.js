// Deriv WebSocket client — the real connection layer.
//
// Reproduces the original bot.html transport: a single authenticated trading
// socket (WS) for balance/proposals/buys/contracts, plus an optional public
// market socket (MWS) for unauthenticated tick history. Auth follows the same
// ladder: REST accounts → WS authorize → OTP URL → direct WS with token.

const APP_ID = '1089';
const WS_BASE = 'wss://ws.derivws.com/websockets/v3';
const REST_ACCOUNTS = 'https://api.derivws.com/trading/v1/options/accounts';

export class DerivClient {
  constructor() {
    this.ws = null;          // authenticated trading socket
    this.mws = null;         // public market socket
    this.rid = 0;
    this.token = '';
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
    const mws = new WebSocket(`${WS_BASE}?app_id=${APP_ID}`);
    this.mws = mws;
    mws.onopen = () => {
      this.mwsAttempts = 0;
      this.emit('market-open');
      this.startHeartbeat();
      this.emit('subscribe-market', { socket: 'mws' });
    };
    mws.onmessage = e => this._onMessage(e, 'market');
    mws.onerror = () => this.emit('market-error');
    mws.onclose = () => {
      if (this.mws === mws) this.mws = null;
      this.emit('market-close');
      const delay = Math.min(500 * Math.pow(1.5, this.mwsAttempts++), 10000);
      this._mwsReconn = setTimeout(() => this.connectMarket(), delay);
    };
  }

  reconnectMarket() {
    if (this._mwsReconn) { clearTimeout(this._mwsReconn); this._mwsReconn = null; }
    if (this.mws) { try { this.mws.close(); } catch (e) {} this.mws = null; }
    this.mwsAttempts = 0;
    this.connectMarket();
    this.emit('log', { t: '[MARKET] Manual reconnect', k: 'i' });
  }

  // ── Auth ───────────────────────────────────────────────────────────────
  async authorize(token) {
    this.token = token;
    let accounts = this._oauthAccounts;
    try {
      if (!accounts || !accounts.length) {
        const resp = await fetch(REST_ACCOUNTS, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Deriv-App-ID': APP_ID },
        });
        if (resp.ok) {
          const data = await resp.json();
          accounts = (data.data || []).map(a => ({
            account: a.account_id, token, currency: a.currency || 'USD',
            isDemo: a.account_type === 'demo' || a.is_virtual, balance: parseFloat(a.balance || 0),
          }));
          this._oauthAccounts = accounts;
        }
      }
    } catch (e) { this.emit('log', { t: '[AUTH] REST accounts failed, trying WS…', k: 'w' }); }

    if (!accounts || !accounts.length) {
      try {
        const wsAuth = await this._wsAuthorize(token);
        if (wsAuth && wsAuth.length) { accounts = wsAuth; this._oauthAccounts = accounts; }
      } catch (e) { this.emit('log', { t: '[AUTH] WS authorize also failed', k: 'e' }); }
    }
    if (!accounts || !accounts.length) throw new Error('Could not fetch Deriv accounts — check your token');

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
        headers: { Authorization: `Bearer ${token}`, 'Deriv-App-ID': APP_ID },
        body: '{}',
      });
      if (otpResp.ok) {
        const otpData = await otpResp.json();
        const wsUrl = otpData.data?.url || otpData.url;
        if (wsUrl) { this._connectOTP(wsUrl); return; }
      }
    } catch (e) { this.emit('log', { t: '[AUTH] OTP failed, trying direct WS…', k: 'w' }); }
    this._connectDirect(token);
  }

  _wsAuthorize(token) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${WS_BASE}?app_id=${APP_ID}`);
      let done = false;
      const t = setTimeout(() => { if (!done) { done = true; ws.close(); reject(new Error('timeout')); } }, 8000);
      ws.onmessage = e => {
        let msg; try { msg = JSON.parse(e.data); } catch (er) { return; }
        if (msg.msg_type === 'authorize' && !done && msg.authorize) {
          done = true; clearTimeout(t); ws.close();
          const acc = msg.authorize;
          const isVirtual = acc.is_virtual === 1 || acc.is_virtual === true || acc.loginid?.startsWith('VR');
          resolve([{ account: acc.loginid, token, currency: acc.currency || 'USD', isDemo: isVirtual, balance: parseFloat(acc.balance || 0) }]);
        } else if (msg.error && msg.error.code === 'AuthorizationFailed') {
          if (!done) { done = true; clearTimeout(t); ws.close(); reject(new Error(msg.error.message)); }
        }
      };
      ws.onopen = () => ws.send(JSON.stringify({ authorize: token }));
      ws.onerror = () => { if (!done) { done = true; clearTimeout(t); reject(new Error('ws error')); } };
    });
  }

  _connectDirect(token) {
    const url = `${WS_BASE}?app_id=${APP_ID}&token=${encodeURIComponent(token)}&l=EN`;
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
    this.emit('message', msg, source);
  }

  // Buy a contract from a proposal id/price.
  buy(proposalId, price) {
    this.send({ buy: proposalId, price, subscribe: 1 });
  }

  close() {
    this._closing = true;
    this.stopHeartbeat();
    if (this.ws) { try { this.ws.close(); } catch (e) {} }
    if (this.mws) { try { this.mws.close(); } catch (e) {} }
    this.ws = null; this.mws = null;
    this.auth = false; this.connected = false;
  }
}

export { APP_ID };
