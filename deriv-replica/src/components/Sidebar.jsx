import React from 'react';
import {
  LegacyHomeNewIcon,
  StandaloneClockThreeRegularIcon,
  StandaloneClockThreeFillIcon,
  StandaloneFileRegularIcon,
  StandaloneFileFillIcon,
  LabelPairedLifeRingSmRegularIcon,
  StandaloneGlobeRegularIcon,
  StandaloneGlobeFillIcon,
  StandaloneSunBrightRegularIcon,
  StandaloneMoonRegularIcon,
  StandaloneCircleUserRegularIcon,
  StandaloneCircleUserFillIcon,
} from '@deriv/quill-icons';
import { BrandDerivWordmarkWhiteIcon } from '@deriv/quill-icons';

// Deriv Trader AppV2 desktop left rail (see AppV2/Components/Layout/Sidebar).
// A 7.2rem column: brand mark on top, then Home / Positions / Reports, and a
// bottom utility group of Help / Language / Theme / Account. Hidden on mobile,
// where the bottom navigation takes over.
function Item({ icon, label, active, badge, onClick }) {
  return (
    <button
      className={`sidebar__item${active ? ' sidebar__item--active' : ''}`}
      onClick={onClick}
      type="button"
      title={label}
    >
      <span className="sidebar__item-icon">{icon}</span>
      {badge > 0 && <span className="sidebar__item-badge">{badge}</span>}
      <span className="sidebar__item-label">{label}</span>
    </button>
  );
}

export default function Sidebar({ tab, setTab, openCount, dark, onToggleTheme, onLogin, connected }) {
  const icon = (Regular, Fill, active) =>
    active ? <Fill fill="var(--color-nav-item-active)" iconSize="sm" /> : <Regular fill="var(--color-text-primary)" iconSize="sm" />;

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <BrandDerivWordmarkWhiteIcon height={22} />
      </div>
      <div className="sidebar__separator" />
      <nav className="sidebar__nav">
        <div className="sidebar__nav-main">
          <Item
            label="Home"
            icon={<LegacyHomeNewIcon iconSize="sm" fill="var(--color-text-primary)" />}
            onClick={() => setTab('trade')}
          />
          <Item
            label="Positions"
            badge={openCount}
            icon={icon(StandaloneClockThreeRegularIcon, StandaloneClockThreeFillIcon, tab === 'positions')}
            active={tab === 'positions'}
            onClick={() => setTab('positions')}
          />
          <Item
            label="Reports"
            icon={icon(StandaloneFileRegularIcon, StandaloneFileFillIcon, tab === 'reports')}
            active={tab === 'reports'}
            onClick={() => setTab('reports')}
          />
        </div>
        <div className="sidebar__nav-utility">
          <Item
            label="Help"
            icon={<LabelPairedLifeRingSmRegularIcon fill="var(--color-text-primary)" iconSize="sm" />}
            onClick={() => window.open('https://deriv.com/help-centre', '_blank', 'noopener,noreferrer')}
          />
          <Item
            label="Language"
            icon={icon(StandaloneGlobeRegularIcon, StandaloneGlobeFillIcon, false)}
            onClick={() => window.open('https://deriv.com', '_blank', 'noopener,noreferrer')}
          />
          <Item
            label="Theme"
            icon={
              dark
                ? <StandaloneMoonRegularIcon fill="var(--color-text-primary)" iconSize="sm" />
                : <StandaloneSunBrightRegularIcon fill="var(--color-text-primary)" iconSize="sm" />
            }
            onClick={onToggleTheme}
          />
          <Item
            label="Account"
            icon={icon(StandaloneCircleUserRegularIcon, StandaloneCircleUserFillIcon, tab === 'menu')}
            active={tab === 'menu'}
            onClick={() => (connected ? setTab('menu') : onLogin())}
          />
        </div>
      </nav>
    </aside>
  );
}
