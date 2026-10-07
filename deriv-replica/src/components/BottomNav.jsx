import React from 'react';
import {
  LegacyHomeNewIcon,
  LegacySettings2pxIcon,
  LegacyProfileSmIcon,
  LegacyOpenPositionIcon,
} from '@deriv/quill-icons';

const ITEMS = [
  { key: 'home', label: 'Home', Icon: LegacyHomeNewIcon },
  { key: 'clock', label: 'Positions', Icon: LegacyOpenPositionIcon },
  { key: 'profile', label: 'My account', Icon: LegacyProfileSmIcon },
  { key: 'settings', label: 'Settings', Icon: LegacySettings2pxIcon },
];

export default function BottomNav({ tab, setTab, openCount }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ key, label, Icon }, i) => (
        <button
          key={key}
          className={`nav-item${tab === i ? ' active' : ''}`}
          onClick={() => setTab(i)}
        >
          <Icon width={22} height={22} fill="currentColor" />
          <span>{label}</span>
          {key === 'clock' && openCount > 0 && <span className="nav-badge">{openCount}</span>}
        </button>
      ))}
    </nav>
  );
}
