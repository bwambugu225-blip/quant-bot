import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@deriv-com/quill-ui';
import '@deriv-com/quill-tokens/dist/quill.css';
import './styles.css';
import './site/site.css';
import App from './App.jsx';
import SiteShell from './site/SiteShell.jsx';

// Two applications share one bundle:
//   - "/" and every marketing path  -> the Deriv.com interface clone
//   - "/trader" and deeper          -> the live trading app
// Choosing at the root keeps asset URLs unchanged and avoids a second bundle.
const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
const isTrader = path === '/trader' || path.startsWith('/trader/');

document.body.classList.toggle('site-body', !isTrader);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isTrader ? (
      <ThemeProvider theme="dark">
        <App />
      </ThemeProvider>
    ) : (
      <SiteShell />
    )}
  </React.StrictMode>
);
