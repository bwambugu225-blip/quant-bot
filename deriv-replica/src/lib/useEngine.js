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
    return () => {
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

  return { engine: engineRef.current, client: clientRef.current, state, tick, logs, toast, login, loginWithOAuth, logout, reconnectMarket, switchAccount, setCurrency, topUpDemo };
}

// Reconnect a saved session on load. Prefer the OAuth session (Bearer only,
// refreshed in place); fall back to a pasted PAT (Bearer + Deriv-App-ID).
function restoreSession(client) {
  const oauth = readOAuthSession();
  if (oauth?.access_token) {
    ensureAccessToken()
      .then(token => {
        if (!token) return;
        client.authorize(token, { authMode: 'oauth', tokenProvider: ensureAccessToken })
          .catch(err => {
            clearOAuthSession();
            client.emit('log', { t: `[AUTH] OAuth session failed: ${err.message}`, k: 'w' });
          });
      })
      .catch(() => clearOAuthSession());
    return;
  }
  let saved = null;
  try { saved = localStorage.getItem('deriv_token'); } catch (e) { /* ignore */ }
  if (saved) {
    client.authorize(saved, { authMode: 'pat' })
      .catch(() => { try { localStorage.removeItem('deriv_token'); } catch (e) { /* ignore */ } });
  }
}
