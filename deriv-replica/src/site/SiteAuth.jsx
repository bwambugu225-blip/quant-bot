import React from 'react';
import { DerivClient } from '../lib/derivClient.js';
import { Link, useRouter } from './router.jsx';

// Marketing-site login / sign-up. Logging in authorises a real Deriv API token
// and stores it so the trading app (mounted at /trader) restores the session.

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
      const info = await client.authorize(token.trim());
      store.set(token.trim());
      setBalance({ amount: info?.balance ?? client.balance, currency: info?.currency || client.currency || 'USD' });
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
          Connect your Deriv account with an API token (Read + Trade scope). Market data streams without logging in;
          trading requires a token.
        </p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="token">Deriv API token</label>
            <input
              id="token"
              type="password"
              placeholder="Paste your API token"
              value={token}
              onChange={e => setToken(e.target.value)}
              disabled={busy}
              autoFocus
            />
            <div className="hint">
              Create one at <a href="https://app.deriv.com/account/api-token" target="_blank" rel="noopener noreferrer">app.deriv.com/account/api-token</a>.
            </div>
            {error && <div className="error">{error}</div>}
            {balance != null && (
              <div className="hint" style={{ color: 'var(--ctc-up)' }}>
                Connected — balance {Number(balance.amount).toFixed(2)} {balance.currency}. Opening the trading app…
              </div>
            )}
          </div>
          <button className="button coral_primary button--block" type="submit" disabled={busy}>
            {busy ? 'Connecting…' : 'Log in'}
          </button>
        </form>
        <div className="auth-alt">
          New to Deriv? <Link to="/signup">Open an account</Link>
        </div>
        <div className="auth-alt">
          Prefer not to sign in? <Link to="/trader">Explore the trading app</Link>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { navigate } = useRouter();
  const [form, setForm] = React.useState({ email: '', password: '', country: 'Malaysia', currency: 'USD' });
  const [agree, setAgree] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [done, setDone] = React.useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    const next = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.password.length < 8) next.password = 'Use at least 8 characters';
    if (!agree) next.agree = 'Please accept the terms to continue';
    setErrors(next);
    if (Object.keys(next).length) return;
    setDone(true);
    setTimeout(() => navigate('/trader'), 900);
  };

  if (done) {
    return (
      <div className="auth-wrap">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h1>You’re all set</h1>
          <p className="muted">
            A demo account has been created. In this interface replica, trading still connects through your Deriv API
            token.
          </p>
          <Link to="/trader" className="button coral_primary button--block">
            <span className="label">Go to the trading app</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Open account</h1>
        <p className="muted">Sign up in minutes. Practise with a zero-risk demo account.</p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="country">Country of residence</label>
              <select id="country" value={form.country} onChange={set('country')}>
                {['Malaysia', 'Kenya', 'Nigeria', 'South Africa', 'India', 'Indonesia', 'Brazil', 'United Kingdom'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="currency">Currency</label>
              <select id="currency" value={form.currency} onChange={set('currency')}>
                {['USD', 'EUR', 'GBP', 'AUD'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="checkbox">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span>
              I agree to the <Link to="/terms-and-conditions">terms and conditions</Link> and confirm I understand that
              trading derivatives carries risk.
            </span>
          </label>
          {errors.agree && <div className="error" style={{ marginTop: -8, marginBottom: 12 }}>{errors.agree}</div>}
          <button className="button coral_primary button--block" type="submit">
            Create account
          </button>
        </form>
        <div className="auth-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
