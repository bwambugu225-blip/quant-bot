import React from 'react';
import { DerivClient } from '../lib/derivClient.js';
import { beginOAuth, completeOAuth, describeOAuthError, parseCallback } from '../lib/oauth.js';
import { Link, useRouter } from './router.jsx';

// Marketing-site login / sign-up. OAuth 2.0 (PKCE) is the primary method: the
// user authorises on Deriv's own site and returns to /callback with an access
// token. A pasted API token stays available as an advanced fallback. Either
// way the session lands in localStorage so /trader restores it.

function tokenStore() {
  try {
    return {
      get: () => localStorage.getItem('deriv_token'),
      set: t => localStorage.setItem('deriv_token', t),
      clear: () => localStorage.removeItem('deriv_token'),
    };
  } catch (e) {
    return { get: () => null, set: () => {}, clear: () => {} };
  }
}

export function LoginPage() {
  const { navigate } = useRouter();
  const store = React.useMemo(tokenStore, []);
  const [token, setToken] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [balance, setBalance] = React.useState(null);
  const [advanced, setAdvanced] = React.useState(false);

  const startOAuth = mode => {
    setError('');
    beginOAuth(mode).catch(err => setError(describeOAuthError(err)));
  };

  const submit = async e => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Paste a Deriv API token from app.deriv.com/account/api-token');
      return;
    }
    setBusy(true);
    setError('');
    const client = new DerivClient();
    try {
      await client.authorize(token.trim(), { authMode: 'pat' });
      store.set(token.trim());
      setBalance({ amount: client.balance, currency: client.currency || 'USD' });
      setTimeout(() => navigate('/trader'), 700);
    } catch (err) {
      setError(err?.message || 'Login failed — check your token');
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Log in</h1>
        <p className="muted">
          Log in with your Deriv account to trade. You sign in on Deriv’s own site — this app never sees your
          password. Market data streams without logging in; trading requires an account.
        </p>

        <button className="button coral_primary button--block" type="button" onClick={() => startOAuth('login')}>
          Log in with Deriv
        </button>
        <div className="auth-alt">
          New to Deriv? <Link to="/signup">Open an account</Link>
        </div>

        {!advanced && (
          <button className="auth-token-toggle" type="button" onClick={() => setAdvanced(true)}>
            Advanced: paste an API token
          </button>
        )}

        {advanced && (
          <form onSubmit={submit} style={{ marginTop: 12 }}>
            <div className="field">
              <label htmlFor="token">Deriv API token</label>
              <input
                id="token"
                type="password"
                placeholder="Paste your API token"
                value={token}
                onChange={e => setToken(e.target.value)}
                disabled={busy}
              />
              <div className="hint">
                Create one at <a href="https://app.deriv.com/account/api-token" target="_blank" rel="noopener noreferrer">app.deriv.com/account/api-token</a>.
              </div>
            </div>
            <button className="button coral_primary button--block" type="submit" disabled={busy}>
              {busy ? 'Connecting…' : 'Log in with token'}
            </button>
          </form>
        )}

        {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
        {balance != null && (
          <div className="hint" style={{ color: 'var(--ctc-up)', marginTop: 12 }}>
            Connected — balance {Number(balance.amount).toFixed(2)} {balance.currency}. Opening the trading app…
          </div>
        )}
        <div className="auth-alt">
          Prefer not to sign in? <Link to="/trader">Explore the trading app</Link>
        </div>
      </div>
    </div>
  );
}

// OAuth redirect target. Deriv sends the browser here with `code` + `state`;
// we exchange the code for a token and hand off to the trading app.
export function CallbackPage() {
  const { navigate } = useRouter();
  const [error, setError] = React.useState('');
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    completeOAuth(window.location.search)
      .then(() => {
        if (cancelled) return;
        setDone(true);
        setTimeout(() => navigate('/trader'), 500);
      })
      .catch(err => { if (!cancelled) setError(describeOAuthError(err)); });
    return () => { cancelled = true; };
  }, [navigate]);

  // Surface the raw error code for support without hiding the friendly text.
  const raw = parseCallback(window.location.search);

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>{error ? 'Sign-in failed' : done ? 'You’re signed in' : 'Signing you in…'}</h1>
        {!error && (
          <p className="muted">
            {done ? 'Opening the trading app…' : 'Completing your Deriv login — this takes a moment.'}
          </p>
        )}
        {error && (
          <>
            <p className="muted">{error}</p>
            {raw.error && <div className="hint">Deriv said: {raw.error}{raw.errorDescription ? ` — ${raw.errorDescription}` : ''}</div>}
          </>
        )}
        <div className="auth-alt">
          {error ? <Link to="/login">Back to log in</Link> : <Link to="/trader">Go to the trading app</Link>}
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [error, setError] = React.useState('');

  // Registration happens on Deriv's site with `prompt=registration`; the OAuth
  // redirect then returns to /callback and straight into the trading app.
  const start = () => {
    setError('');
    beginOAuth('signup').catch(err => setError(describeOAuthError(err)));
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Open account</h1>
        <p className="muted">
          Create your Deriv account on Deriv’s own site. Sign up in minutes and start with a zero-risk demo
          balance — this app never sees your password.
        </p>
        <button className="button coral_primary button--block" type="button" onClick={start}>
          Create a Deriv account
        </button>
        {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
        <div className="auth-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
        <div className="auth-alt">
          Prefer not to sign in? <Link to="/trader">Explore the trading app</Link>
        </div>
      </div>
    </div>
  );
}
