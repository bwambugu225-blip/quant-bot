import { useEffect, useRef, useState } from 'react';

// Live payout for the trade form. Deriv quotes an accurate payout for a
// proposal, so ask the public gateway and refresh whenever the stake,
// duration, market or contract type changes. A short debounce keeps the
// socket calm while the user is still typing a stake.
export function usePayout(client, fields, deps) {
  const [payout, setPayout] = useState(null);
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;

  useEffect(() => {
    if (!fields) { setPayout(null); return undefined; }
    let alive = true;
    let timer;
    // The public socket may still be connecting on first render, so keep
    // retrying until the request is actually sent.
    const attempt = () => {
      if (!alive) return;
      const reqId = client.requestPayout(fieldsRef.current, res => {
        if (alive) setPayout(res ? res.payout : null);
      });
      if (reqId == null) timer = setTimeout(attempt, 500);
    };
    timer = setTimeout(attempt, 100);
    return () => { alive = false; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return payout;
}
