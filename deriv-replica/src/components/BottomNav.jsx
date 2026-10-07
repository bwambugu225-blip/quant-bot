import React from 'react';
import { Navigation } from '@deriv-com/quill-ui';
import {
  StandaloneChartLineUpDownRegularIcon,
  StandaloneChartLineUpDownFillIcon,
  StandaloneClockThreeRegularIcon,
  StandaloneClockThreeFillIcon,
  StandaloneFileRegularIcon,
  StandaloneFileFillIcon,
  StandaloneGearRegularIcon,
  StandaloneGearFillIcon,
  LabelPairedGrid2LgRegularIcon,
} from '@deriv/quill-icons';

// quill-ui exposes the bottom navigation bar as Navigation.Bottom / BottomAction,
// not Navigation.BottomBar.
const { Bottom: BottomBar, BottomAction } = Navigation;

// Trade, Positions, Reports, Automate, Menu. The account essentials live in
// Menu, so there is no separate Account tab.
export default function BottomNav({ tab, setTab, openCount }) {
  return (
    <BottomBar
      value={tab}
      onChange={(_event, value) => setTab(value)}
      showLabels
      className="app-bottom-nav"
    >
      <BottomAction
        value="trade"
        label="Trade"
        icon={<StandaloneChartLineUpDownRegularIcon fill="currentColor" iconSize="sm" />}
        activeIcon={<StandaloneChartLineUpDownFillIcon fill="currentColor" iconSize="sm" />}
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
        value="automate"
        label="Automate"
        icon={<StandaloneGearRegularIcon fill="currentColor" iconSize="sm" />}
        activeIcon={<StandaloneGearFillIcon fill="currentColor" iconSize="sm" />}
      />
      <BottomAction
        value="menu"
        label="Menu"
        icon={<LabelPairedGrid2LgRegularIcon fill="currentColor" iconSize="sm" />}
      />
    </BottomBar>
  );
}
