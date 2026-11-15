import React from 'react';

// A collapsible panel used throughout the right dock.
export default function Panel({ title, count, defaultOpen = true, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className="panel">
      <div className="panel__head" onClick={() => setOpen(o => !o)} role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') setOpen(o => !o); }}>
        <span className="panel__title">{open ? '▾' : '▸'} {title}</span>
        {count != null && <span className="panel__count">{count}</span>}
      </div>
      {open && <div className="panel__body">{children}</div>}
    </section>
  );
}
