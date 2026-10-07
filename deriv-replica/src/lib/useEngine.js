import { useEffect, useRef, useState, useCallback } from 'react';
import { Engine } from './engine.js';
import { DerivClient } from './derivClient.js';

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
    const onAuthorized = () => {
      try { localStorage.setItem('deriv_token', client.token); } catch (e) { /* storage may be blocked */ }
    };
    engine.on('state', onState);
    engine.on('tick', onTick);
    engine.on('log', onLog);
    engine.on('toast', onToast);
    engine.on('authorized', onState);
    client.on('authorized', onAuthorized);
    setState(engine.snapshot());
    // Boot the public market feed immediately — the layout shows live data
    // before the user authorises.
    client.connectMarket();
    // Restore a previous session so a reload reconnects automatically.
    let saved = null;
    try { saved = localStorage.getItem('deriv_token'); } catch (e) { /* ignore */ }
    if (saved) client.authorize(saved).catch(() => { try { localStorage.removeItem('deriv_token'); } catch (e) {} });
    return () => {
      // keep sockets alive across HMR; stop only on real unmount
    };
  }, []);

  const login = useCallback(async token => {
    await clientRef.current.authorize(token.trim());
  }, []);

  const logout = useCallback(() => {
    clientRef.current.close();
    try { localStorage.removeItem('deriv_token'); } catch (e) { /* ignore */ }
  }, []);

  const reconnectMarket = useCallback(() => clientRef.current.reconnectMarket(), []);
  const switchAccount = useCallback(id => clientRef.current.switchAccount(id), []);

  return { engine: engineRef.current, client: clientRef.current, state, tick, logs, toast, login, logout, reconnectMarket, switchAccount };
}
