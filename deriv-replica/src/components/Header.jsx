import React from 'react';
import { BrandDerivWordmarkWhiteIcon, LegacyChevronDown1pxIcon } from '@deriv/quill-icons';
import { addComma } from '../lib/format.js';

// Deriv AppV2 AccountHeader: Deriv wordmark on the left, then the account
// switcher (type + balance) and the coral Deposit pill on the right.
export default function Header({ balance, currency = 'USD', accountType = 'demo', connected, onAccount, onDeposit }) {
  return (
    <header className="account-header">
      <BrandDerivWordmarkWhiteIcon height={18} />

      <div className="account-header__right">
        <button className="account-chip" onClick={onAccount} type="button">
          <span className={`account-chip__dot${connected ? ' is-on' : ''}`} />
          <span className="account-chip__content">
            <span className="account-chip__type">{connected ? (accountType === 'real' ? 'Real' : 'Demo') : 'Demo'}</span>
            <span className="account-chip__balance">
              {addComma(balance, 2)} {currency}
              <LegacyChevronDown1pxIcon className="account-chip__arrow" fill="currentColor" iconSize="xs" />
            </span>
          </span>
        </button>
        <button className="account-header__transfer" onClick={onDeposit} type="button">
          Deposit
        </button>
      </div>
    </header>
  );
}
