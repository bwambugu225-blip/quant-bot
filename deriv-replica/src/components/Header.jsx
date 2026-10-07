import React from 'react';
import { BrandDerivWordmarkWhiteIcon, LegacyChevronDown1pxIcon } from '@deriv/quill-icons';
import { addComma } from '../lib/format.js';

const isDemo = a => a.account.startsWith('VR') || a.isDemo;

// Deriv AppV2 AccountHeader: wordmark on the left, then the account switcher
// and the coral Deposit pill. Tapping the switcher opens the account list
// popover (demo ↔ real) exactly like Deriv's header dropdown.
export default function Header({
  balance, currency = 'USD', accountType = 'demo', connected,
  accounts = [], accountId, onSwitchAccount, onAccount, onDeposit, onLogin,
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const toggle = () => {
    if (connected && accounts.length) setOpen(o => !o);
    else onLogin?.();
  };

  return (
    <header className="account-header">
      <BrandDerivWordmarkWhiteIcon height={18} />

      <div className="account-header__right" ref={ref}>
        <button className="account-chip" onClick={toggle} type="button">
          <span className={`account-chip__dot${connected ? ' is-on' : ''}`} />
          <span className="account-chip__content">
            <span className="account-chip__type">{connected ? (accountType === 'real' ? 'Real' : 'Demo') : 'Demo'}</span>
            <span className="account-chip__balance">
              {addComma(balance, 2)} {currency}
              <LegacyChevronDown1pxIcon className="account-chip__arrow" fill="currentColor" iconSize="xs" />
            </span>
          </span>
        </button>

        {open && (
          <div className="account-popover">
            <div className="account-popover__title">Switch account</div>
            {accounts.map(a => {
              const active = a.account === accountId;
              return (
                <button
                  key={a.account}
                  className={`account-popover__row${active ? ' is-active' : ''}`}
                  onClick={() => { setOpen(false); if (!active) onSwitchAccount(a.account); }}
                  type="button"
                >
                  <span className={`account-popover__dot${isDemo(a) ? ' is-demo' : ' is-real'}`} />
                  <span className="account-popover__meta">
                    <span className="account-popover__type">{isDemo(a) ? 'Demo' : 'Real'}</span>
                    <span className="account-popover__id">{a.account}</span>
                  </span>
                  <span className="account-popover__balance">
                    {addComma(a.balance ?? 0, 2)} {a.currency || currency}
                  </span>
                </button>
              );
            })}
            <button className="account-popover__manage" onClick={() => { setOpen(false); onAccount(); }} type="button">
              Manage account
            </button>
          </div>
        )}

        <button className="account-header__transfer" onClick={onDeposit} type="button">
          Deposit
        </button>
      </div>
    </header>
  );
}
