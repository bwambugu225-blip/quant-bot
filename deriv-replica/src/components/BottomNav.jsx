import React from 'react';
import { Navigation } from '@deriv-com/quill-ui';
import {
  LegacyHomeNewIcon,
  StandaloneClockThreeRegularIcon,
  StandaloneClockThreeFillIcon,
  StandaloneFileRegularIcon,
  StandaloneFileFillIcon,
  LabelPairedGrid2LgRegularIcon,
  StandaloneCircleUserRegularIcon,
  StandaloneCircleUserFillIcon,
} from '@deriv/quill-icons';

// quill-ui exposes the bottom navigation bar as Navigation.Bottom / BottomAction,
// not Navigation.BottomBar.
const { Bottom: BottomBar, BottomAction } = Navigation;

// Deriv's mobile bottom navigation: Home, Positions, Reports, Menu, Account.
export default function BottomNav({ tab, setTab, openCount }) {
  return (
    <BottomBar
      value={tab}
      onChange={(_event, value) => setTab(value)}
      showLabels
      className="app-bottom-nav"
    >
      <BottomAction
        value="home"
        label="Home"
        icon={<LegacyHomeNewIcon fill="currentColor" iconSize="sm" />}
      />
      <BottomAction
        value="positions"
        label="Positions"
        icon={<StandaloneClockThreeRegularIcon fill="currentColor" iconSize="sm" />}
        activeIcon={<StandaloneClockThreeFillIcon fill="currentColor" iconSize="sm" />}
        badge={openCount > 0 ? String(openCount) : undefined}
      />
      <BottomAction
        value="reports"
        label="Reports"
        icon={<StandaloneFileRegularIcon fill="currentColor" iconSize="sm" />}
        activeIcon={<StandaloneFileFillIcon fill="currentColor" iconSize="sm" />}
      />
      <BottomAction
        value="menu"
        label="Menu"
        icon={<LabelPairedGrid2LgRegularIcon fill="currentColor" iconSize="sm" />}
      />
      <BottomAction
        value="account"
        label="Account"
        icon={<StandaloneCircleUserRegularIcon fill="currentColor" iconSize="sm" />}
        activeIcon={<StandaloneCircleUserFillIcon fill="currentColor" iconSize="sm" />}
      />
    </BottomBar>
  );
}
