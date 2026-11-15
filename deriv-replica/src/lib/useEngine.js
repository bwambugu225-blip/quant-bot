import { useEffect, useRef, useState, useCallback } from 'react';
import { Engine } from './engine.js';
import { DerivClient } from './derivClient.js';
import { beginOAuth, ensureAccessToken, readOAuthSession, clearOAuthSession } from './oauth.js';

// Wires the trading Engine to React. One Engine + DerivClient per app instance,
// kept in a ref so re-renders never re-create the socket or lose the state.
export function useEngine() {
  const engineRef = useRef(null);
  const clientRef = useRef(null);
  const [state, setState] = useState(null);
  const [tick, setTick] = useState(null);
  const [logs, setLogs] = useState([]);
  const [toast, setToast] = useState(null);
  const [health, setHealth] = useState(null);

  if (!engineRef.current) {
    engineRef.current = new Engine();
    clientRef.current = new DerivClient();
    engineRef.current.attach(clientRef.current);
  }

  useEffect(() => {
    const engine = engineRef.current;
    const client = clientRef.current;
    const onState = () => setState(engine.snapshot());
    const onTick = t => setTick(t);
    const onLog = entry => setLogs(ls => [...ls, entry].slice(-300));
    const onToast = data => {
      setToast(data);
      setTimeout(() => setToast(t => (t === data ? null : t)), 2600);
    };
    engine.on('state', onState);
    engine.on('tick', onTick);
    engine.on('log', onLog);
    engine.on('toast', onToast);
    engine.on('authorized', onState);
    setState(engine.snapshot());
    // Boot the public market feed immediately — the layout shows live data
    // before the user authorises.
    client.connectMarket();
    // Restore a previous session so a reload reconnects automatically. OAuth
    // sessions refresh through `ensureAccessToken`; a pasted PAT is restored
    // from its own key as the fallback.
    restoreSession(client);
    // The stream is a permanent service: poll its health for the status bar and
    // keep the session alive. Nothing here logs the user out — an expired token
    // is refreshed in place, and a dropped socket reconnects forever.
    const pollHealth = () => setHealth(client.marketHealth());
    pollHealth();
    const healthTimer = setInterval(pollHealth, 1000);
    const keepAlive = setInterval(() => keepSessionAlive(client), 60000);
    return () => {
      clearInterval(healthTimer);
      clearInterval(keepAlive);
      // keep sockets alive across HMR; stop only on real unmount
    };
  }, []);

  // OAuth is the primary login. The pasted-token path stays available as an
  // advanced fallback and is tagged 'pat' so it sends the Deriv-App-ID header.
  const login = useCallback(async token => {
    await clientRef.current.authorize(token.trim(), { authMode: 'pat' });
    try { localStorage.setItem('deriv_token', token.trim()); } catch (e) { /* ignore */ }
  }, []);

  const loginWithOAuth = useCallback(
    (mode = 'login') => beginOAuth(mode),
    [],
  );

  const logout = useCallback(() => {
    clientRef.current.close();
    clearOAuthSession();
    try { localStorage.removeItem('deriv_token'); } catch (e) { /* ignore */ }
  }, []);

  const reconnectMarket = useCallback(() => clientRef.current.reconnectMarket(), []);
  const switchAccount = useCallback(id => clientRef.current.switchAccount(id), []);
  const setCurrency = useCallback(c => clientRef.current.setCurrency(c), []);

  // Recharge the demo account (switches to it first inside the engine).
  const topUpDemo = useCallback((amount) => engineRef.current.topUpDemo(amount), []);

  return { engine: engineRef.current, client: clientRef.current, state, tick, logs, toast, health, login, loginWithOAuth, logout, reconnectMarket, switchAccount, setCurrency, topUpDemo };
}

// Reconnect a saved session on load. Prefer the OAuth session (Bearer only,
// refreshed in place); fall back to a pasted PAT (Bearer + Deriv-App-ID).
// Failures are retried, never treated as a logout: a transient network error
// must not throw away a valid session.
function restoreSession(client) {
  const oauth = readOAuthSession();
  if (oauth?.access_token) {
    ensureAccessToken()
      .then(token => {
        if (!token) return;
        client.authorize(token, { authMode: 'oauth', tokenProvider: ensureAccessToken })
          .catch(err => client.emit('log', { t: `[AUTH] Session reconnect failed: ${err.message} — retrying`, k: 'w' }));
      })
      .catch(() => client.emit('log', { t: '[AUTH] Token refresh deferred — will retry', k: 'w' }));
    return;
  }
  let saved = null;
  try { saved = localStorage.getItem('deriv_token'); } catch (e) { /* ignore */ }
  if (saved) {
    client.authorize(saved, { authMode: 'pat' })
      .catch(() => client.emit('log', { t: '[AUTH] Token reconnect failed — will retry', k: 'w' }));
  }
}

// Keep an authorised session warm across the long-lived session. An OAuth
// access token is refreshed in place; a PAT never expires and needs no work.
// If the socket has dropped, reconnect it. This never logs out.
function keepSessionAlive(client) {
  if (!client.token) return;
  if (client._tokenProvider) {
    ensureAccessToken()
      .then(fresh => { if (fresh) client.token = fresh; })
      .catch(() => { /* keep the current token; the next REST call will retry */ });
  }
  if (!client.auth && !client._closing) client._scheduleRecon(true);
}
