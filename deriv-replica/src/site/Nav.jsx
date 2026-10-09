import React from 'react';
import { MEGA_MENUS } from './siteData.js';
import { DerivLogo, Chevron, Globe, Hamburger } from './icons.jsx';
import { Link } from './router.jsx';

const isExternal = to => /^https?:\/\//.test(to);

function linkProps(to) {
  return isExternal(to) ? { href: to, target: '_blank', rel: 'noopener noreferrer' } : { to };
}

function MenuLink({ to, label }) {
  if (isExternal(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return <Link to={to}>{label}</Link>;
}

export default function Nav() {
  const [open, setOpen] = React.useState(null);
  const [drawer, setDrawer] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const navRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const onDoc = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(null);
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  const toggle = name => {
    setOpen(o => (o === name ? null : name));
    setLangOpen(false);
  };

  return (
    <header ref={navRef}>
      <nav className={`site-nav${scrolled ? ' is-scrolled' : ''}`} aria-label="Main">
        <div className="navbar__bar">
          <DerivLogo />

          <div className="navbar__nav-center">
            <div className="navbar__pill">
              <div className="navbar__nav-group">
                {Object.keys(MEGA_MENUS).map(name => (
                  <button
                    key={name}
                    className="navbar__nav-item"
                    aria-expanded={open === name}
                    aria-haspopup="true"
                    onClick={() => toggle(name)}
                  >
                    {name}
                    <Chevron />
                  </button>
                ))}
                <a href="/partners" className="navbar__nav-item" target="_blank" rel="noopener noreferrer">
                  Partners
                </a>
                <div className="navbar__lang-wrapper">
                  <button
                    className="navbar__nav-item navbar__lang-btn"
                    aria-haspopup="true"
                    aria-expanded={langOpen}
                    onClick={() => {
                      setLangOpen(v => !v);
                      setOpen(null);
                    }}
                  >
                    <Globe />EN
                  </button>
                  {langOpen && (
                    <div className="navbar__panel" style={{ gridTemplateColumns: '1fr', width: 220 }}>
                      <div className="navbar__panel-col">
                        <ul>
                          {['English', 'Português', 'Español', 'Français', 'Deutsch'].map(l => (
                            <li key={l}>
                              <button className="navbar__nav-item" onClick={() => setLangOpen(false)}>
                                {l}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="navbar__pill-actions">
                <Link to="/login" className="button white_outline">
                  <span className="label">Log in</span>
                </Link>
                <Link to="/signup" className="button coral_primary">
                  <span className="label">Open account</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="navbar__actions">
            <Link to="/login" className="button white_outline navbar__actions-login">
              <span className="label">Log in</span>
            </Link>
            <Link to="/signup" className="button coral_primary">
              <span className="label">Open account</span>
            </Link>
          </div>

          <div className="navbar__mobile-actions">
            <Link to="/login" className="button white_outline">
              <span className="label">Log in</span>
            </Link>
            <button className="navbar__mobile-trigger" aria-label="Open navigation menu" onClick={() => setDrawer(true)}>
              <Hamburger />
            </button>
          </div>
        </div>

        {open && (
          <div className="navbar__panel" role="menu">
            {MEGA_MENUS[open].map(col => (
              <div className="navbar__panel-col" key={col.title}>
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map(l => (
                    <li key={l.label}>
                      <MenuLink to={l.to} label={l.label} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </nav>

      {drawer && (
        <div className="navbar__drawer" role="dialog" aria-modal="true">
          <div className="navbar__drawer-head">
            <DerivLogo />
            <button className="navbar__drawer-close" aria-label="Close navigation menu" onClick={() => setDrawer(false)}>
              ×
            </button>
          </div>
          <nav aria-label="Mobile">
            {Object.entries(MEGA_MENUS).map(([name, cols]) => (
              <details key={name}>
                <summary>{name}</summary>
                {cols.flatMap(col => col.links).map(l => (
                  <div key={l.label} onClick={() => setDrawer(false)}>
                    <MenuLink to={l.to} label={l.label} />
                  </div>
                ))}
              </details>
            ))}
            <a href="/partners" target="_blank" rel="noopener noreferrer" onClick={() => setDrawer(false)}>
              Partners
            </a>
            <Link to="/help-centre" onClick={() => setDrawer(false)}>
              Help centre
            </Link>
          </nav>
          <div className="navbar__drawer-actions">
            <Link to="/login" className="button white_secondary button--block" onClick={() => setDrawer(false)}>
              <span className="label">Log in</span>
            </Link>
            <Link to="/signup" className="button coral_primary button--block" onClick={() => setDrawer(false)}>
              <span className="label">Open account</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
