import React from 'react';
import { SYMBOLS, SYMBOL_GROUPS } from '../lib/symbols.js';

export function Modal({ title, onClose, children, width }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={width ? { width } : undefined} onClick={e => e.stopPropagation()}>
        <div className="modal__head">
          <span className="modal__title">{title}</span>
          <button className="modal__x" onClick={onClose} type="button">×</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

export function SymbolPicker({ current, onSelect, onClose }) {
  return (
    <Modal title="Select market" onClose={onClose}>
      <div className="sym-list">
        {SYMBOL_GROUPS.map(g => (
          <React.Fragment key={g.id}>
            <div className="sym-group">{g.label}</div>
            {SYMBOLS.filter(s => s.group === g.id).map(s => (
              <button key={s.sym} className={`sym-row${s.sym === current ? ' is-active' : ''}`}
                onClick={() => { onSelect(s.sym); onClose(); }} type="button">
                <span className="sym-row__name">{s.name}</span>
                <span className="sym-row__price">{s.sym}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </Modal>
  );
}

export function LoginModal({ onToken, onOAuth, onClose }) {
  const [token, setToken] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const submit = async () => {
    if (!token.trim()) return;
    setBusy(true); setErr('');
    try { await onToken(token.trim()); onClose(); }
    catch (e) { setErr(e.message || 'Login failed'); setBusy(false); }
  };
  return (
    <Modal title="Log in to Deriv" onClose={onClose} width={460}>
      <p style={{ color: 'var(--text-dim)', marginTop: 0 }}>
        Market data needs no login. To place trades, authorise a Deriv account.
        OAuth is the primary method; a personal API token (Read + Trade scope) is the fallback.
      </p>
      <button className="btn btn--primary" style={{ width: '100%', padding: 10 }} onClick={() => onOAuth('login')} type="button">
        Log in with Deriv OAuth
      </button>
      <div style={{ textAlign: 'center', color: 'var(--text-mute)', margin: '14px 0', fontSize: 11 }}>OR PASTE AN API TOKEN</div>
      <input className="builder__name" style={{ width: '100%' }} placeholder="API token"
        value={token} onChange={e => setToken(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); }} />
      {err && <p style={{ color: 'var(--down)', fontSize: 12 }}>{err}</p>}
      <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={submit} disabled={busy} type="button">
        {busy ? 'Authorising…' : 'Authorise token'}
      </button>
    </Modal>
  );
}
