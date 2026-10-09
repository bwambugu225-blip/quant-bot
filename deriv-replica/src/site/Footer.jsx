import React from 'react';
import { FOOTER_COLS, LEGAL_ENTITIES } from './siteData.js';
import { Link } from './router.jsx';

const isExternal = to => /^https?:\/\//.test(to);

function FooterLink({ to, label }) {
  if (isExternal(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return <Link to={to}>{label}</Link>;
}

const SOCIAL = [
  { name: 'Facebook', path: 'M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.7v8h3.2z' },
  { name: 'X', path: 'M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21h-3l7-8L2.5 3h6.1l4.2 5.6L17.5 3zm-1 16h1.6L7.7 4.7H6L16.5 19z' },
  { name: 'Instagram', path: 'M12 7.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm5.9-7.8a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM12 3.5c-2.3 0-2.6 0-3.5.05-.9.04-1.5.2-2 .4a4 4 0 00-1.5 1 4 4 0 00-1 1.5c-.2.5-.4 1.1-.4 2C3.5 9.4 3.5 9.7 3.5 12s0 2.6.05 3.5c.04.9.2 1.5.4 2a4 4 0 001 1.5 4 4 0 001.5 1c.5.2 1.1.4 2 .4.9.05 1.2.05 3.5.05s2.6 0 3.5-.05c.9-.04 1.5-.2 2-.4a4 4 0 001.5-1 4 4 0 001-1.5c.2-.5.4-1.1.4-2 .05-.9.05-1.2.05-3.5s0-2.6-.05-3.5c-.04-.9-.2-1.5-.4-2a4 4 0 00-1-1.5 4 4 0 00-1.5-1c-.5-.2-1.1-.4-2-.4C14.6 3.5 14.3 3.5 12 3.5zm0 1.6c2.25 0 2.5 0 3.4.05.8.04 1.25.17 1.55.3.4.15.65.33.95.63.3.3.48.55.63.95.13.3.26.75.3 1.55.05.9.05 1.15.05 3.4s0 2.5-.05 3.4c-.04.8-.17 1.25-.3 1.55a2.5 2.5 0 01-.63.95c-.3.3-.55.48-.95.63-.3.13-.75.26-1.55.3-.9.05-1.15.05-3.4.05s-2.5 0-3.4-.05c-.8-.04-1.25-.17-1.55-.3a2.5 2.5 0 01-.95-.63 2.5 2.5 0 01-.63-.95c-.13-.3-.26-.75-.3-1.55C5.1 14.5 5.1 14.25 5.1 12s0-2.5.05-3.4c.04-.8.17-1.25.3-1.55.15-.4.33-.65.63-.95.3-.3.55-.48.95-.63.3-.13.75-.26 1.55-.3.9-.05 1.15-.05 3.4-.05z' },
  { name: 'LinkedIn', path: 'M6.9 8.6H3.9V20h3V8.6zM5.4 3.8a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM20.1 20h-3v-5.6c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94V20h-3V8.6h2.88v1.56h.04c.4-.76 1.38-1.56 2.85-1.56 3.05 0 3.61 2 3.61 4.62V20z' },
  { name: 'YouTube', path: 'M21.6 7.2s-.2-1.4-.8-2c-.76-.8-1.6-.8-2-.86C16 4.2 12 4.2 12 4.2h-.02s-4 0-6.8.14c-.4.06-1.24.06-2 .86-.6.6-.78 2-.78 2S2.2 8.8 2.2 10.5v1.6c0 1.6.2 3.3.2 3.3s.18 1.4.78 2c.76.8 1.76.77 2.2.86 1.6.14 6.62.18 6.62.18s4 0 6.8-.15c.4-.05 1.24-.05 2-.85.6-.6.78-2 .78-2s.2-1.6.2-3.3v-1.6c0-1.7-.2-3.3-.2-3.3zM9.9 14.2V8.9l5.2 2.66-5.2 2.64z' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {FOOTER_COLS.map(col => (
            <div className="footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(l => (
                  <li key={l.label}>
                    <FooterLink to={l.to} label={l.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-app">
            <h4>Deriv App</h4>
            <p>Manage accounts, transfer funds, and access markets anytime, anywhere.</p>
            <div className="footer-qr" aria-hidden="true" />
            <p style={{ marginTop: 12 }}>Scan to download</p>
            <p style={{ marginTop: 4, fontSize: 12 }}>
              *The availability of Deriv App depends on your country of residence.
            </p>
            <div className="footer-social">
              {SOCIAL.map(s => (
                <a key={s.name} href="https://deriv.com/" target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-legal">
          <p>
            This website may use automated translations for your convenience. However, the English version is the
            definitive version and will prevail in the event of any discrepancy.
          </p>
          {LEGAL_ENTITIES.map(t => (
            <p key={t}>{t}</p>
          ))}
          <p>
            Make sure to read our <Link to="/terms-and-conditions">Terms and Conditions</Link> and{' '}
            <Link to="/terms-and-conditions">Risk Disclosure</Link> to fully understand the risks involved before using
            our services. Please also note that the information on this website does not constitute investment advice.
          </p>
          <p>
            The products offered on our website are complex derivative products that carry a significant risk of
            potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. You
            should consider whether you understand how these products work and whether you can afford to take the high
            risk of losing your money.
          </p>
        </div>
      </div>
    </footer>
  );
}
