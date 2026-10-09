import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@deriv-com/quill-ui';
import '@deriv-com/quill-tokens/dist/quill.css';
import './styles.css';
import './site/site.css';
import App from './App.jsx';
import SiteShell from './site/SiteShell.jsx';
import { RouterProvider, useRoute } from './site/router.jsx';

// Two applications share one bundle:
//   - "/" and every marketing path  -> the Deriv.com interface clone
//   - "/trader" and deeper          -> the live trading app
// The choice is reactive, not a one-time decision at boot: navigating between
// the two (e.g. a marketing link or the login hand-off) swaps apps in place, so
// a client-side link to /trader opens the trading app instead of a 404.
function Root() {
  const path = (useRoute() || '/').replace(/\/+$/, '') || '/';
  const isTrader = path === '/trader' || path.startsWith('/trader/');

  React.useEffect(() => {
    document.body.classList.toggle('site-body', !isTrader);
    if (isTrader) document.title = 'Deriv Trader';
  }, [isTrader]);

  if (isTrader) {
    return (
      <ThemeProvider theme="dark">
        <App />
      </ThemeProvider>
    );
  }
  return <SiteShell />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider>
      <Root />
    </RouterProvider>
  </React.StrictMode>
);
