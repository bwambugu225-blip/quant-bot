import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App.jsx';
import { completeOAuth, describeOAuthError } from './lib/oauth.js';

// OAuth redirect lands on /callback (see callback.html). Run the PKCE exchange
// here, on the origin that holds the verifier, then hand back to the app. The
// exchange stores the session in localStorage; `useEngine` restores it on boot.
function Root() {
  const [phase, setPhase] = React.useState(
    window.location.pathname.replace(/\/+$/, '') === '/callback' ? 'callback' : 'app',
  );
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (phase !== 'callback') return;
    completeOAuth(window.location.search)
      .then(() => { window.history.replaceState({}, '', '/'); setPhase('app'); })
      .catch(err => setError(describeOAuthError(err)));
  }, [phase]);

  if (phase === 'callback') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
          {error ? <p style={{ color: 'var(--down)' }}>{error}</p> : <p>Completing your Deriv login…</p>}
        </div>
      </div>
    );
  }
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
