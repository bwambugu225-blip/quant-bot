import React, { useState } from 'react';
import { ToggleSwitch } from '@deriv-com/quill-ui';

export default function Settings({ onToast }) {
  const [theme, setTheme] = useState('dark');
  const [notif, setNotif] = useState(true);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="screen">
      <div className="sheet-title" style={{ padding: '0 0 12px' }}>Settings</div>

      <Row label="Dark theme" sub="Use the dark colour scheme">
        <ToggleSwitch checked={theme === 'dark'} onChange={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))} />
      </Row>
      <Row label="Trade notifications" sub="Get alerted on contract results">
        <ToggleSwitch checked={notif} onChange={() => setNotif(v => !v)} />
      </Row>
      <Row label="Confirm before purchase" sub="Ask before placing a trade">
        <ToggleSwitch checked={confirm} onChange={() => setConfirm(v => !v)} />
      </Row>

      <div className="sheet-row" onClick={() => onToast('Log out is disabled in this demo')}>
        Log out
      </div>
    </div>
  );
}

function Row({ label, sub, children }) {
  return (
    <div className="sheet-row">
      <div>
        <div>{label}</div>
        <div className="sub">{sub}</div>
      </div>
      {children}
    </div>
  );
}
