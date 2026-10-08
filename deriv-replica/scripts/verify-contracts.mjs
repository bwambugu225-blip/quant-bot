// End-to-end verifier: for each symbol and every registry entry, ask Deriv's
// public API for the market catalogue, shape a proposal the same way the engine
// does, and record whether the API accepts it.
import { AUTO_CONTRACTS, accuracyParams, buildAutoValue, shapeProposal } from '../src/lib/autoStrategies.js';
import { buildProposal } from '../src/lib/contracts.js';

const SYMS = (process.argv[2] || 'R_10,R_25,R_50,R_75,R_100,1HZ10V,1HZ100V,stpRNG,RDBULL,RDBEAR').split(',');
const ws = new WebSocket('wss://api.derivws.com/trading/v1/options/ws/public');
const cfPending = new Map();
let rid = 0;

function fetchCf(sym) {
  return new Promise(res => {
    const id = ++rid; cfPending.set(id, res);
    ws.send(JSON.stringify({ contracts_for: sym, req_id: id }));
  });
}

ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (cfPending.has(m.req_id)) {
    const res = cfPending.get(m.req_id); cfPending.delete(m.req_id);
    res(m.contracts_for ? (m.contracts_for.available || []) : []);
  }
});

function propose(fields) {
  return new Promise(res => {
    const id = ++rid;
    const h = ev => { const m = JSON.parse(ev.data); if (m.req_id !== id) return; ws.removeEventListener('message', h); res(m); };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ proposal: 1, amount: 1, basis: 'stake', currency: 'USD', ...fields, req_id: id }));
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Deriv throttles `proposal` calls; space them out and retry a rate-limited one.
async function proposeThrottled(fields) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const m = await propose(fields);
    if (m.error?.code === 'RateLimit') { await sleep(400 * (attempt + 1)); continue; }
    return m;
  }
  return { error: { code: 'RateLimit', message: 'gave up after retries' } };
}

const SPOT_SENSITIVE = new Set(['turbos', 'vanilla', 'staysinout', 'endsinout', 'higherlower', 'touchnotouch']);

ws.addEventListener('open', async () => {
  const symType = {};
  const failures = [];
  const cache = {};
  for (const sym of SYMS) {
    for (const [key, entry] of Object.entries(AUTO_CONTRACTS)) {
      // Barriers that track spot drift between fetches, so re-read the catalogue
      // for those categories right before proposing (the engine keeps a short
      // TTL for the same reason); tick/digit products are stable and cached.
      const cat = { rise_fall: 'callput', higher_lower: 'higherlower', touch: 'touchnotouch', turbos: 'turbos', vanillas: 'vanilla', over_under: 'digits', matches_differs: 'digits', even_odd: 'digits', stays_goes: 'staysinout', ends_between: 'endsinout', runs: 'runs', asians: 'asian', resets: 'reset', highs_lows: 'highlowticks', accumulators: 'accumulator', multipliers: 'multiplier' }[entry.typeId];
      const avail = (SPOT_SENSITIVE.has(cat) || !cache[sym])
        ? (cache[sym] = await fetchCf(sym))
        : cache[sym];
      const p = { stake: 1, ...accuracyParams('max'), ...entry.defaults };
      const value = buildAutoValue(entry, p); value.stake = 1;
      const raw = buildProposal(entry.typeId, entry.side, value, sym);
      const { available, fields } = shapeProposal(entry, raw, avail);
      symType[sym] = symType[sym] || {};
      if (available === false) { symType[sym][key] = 'na'; continue; }
      const m = await proposeThrottled(fields);
      let okRes = !!m.proposal;
      let usedRetry = false;
      if (!okRes && /Barrier|barrier|return/i.test(m.error?.message || '')) {
        // Mirror the engine: adopt the ladder the rejection reports and resend
        // once, for the spot-derived barrier race.
        const bm = /Barriers available are ([^;]+?)\.(?:\s|$)/i.exec(m.error.message);
        if (bm) {
          const choices = bm[1].split(',').map(s => s.trim()).filter(Boolean);
          const patched = avail.map(r => r.contract_category === cat ? { ...r, barrier_choices: choices, barrier: choices[0] } : r);
          const again = shapeProposal(entry, raw, patched);
          if (again.available !== false) {
            const m2 = await proposeThrottled(again.fields);
            okRes = !!m2.proposal;
            usedRetry = okRes;
          }
        }
      }
      symType[sym][key] = okRes ? (usedRetry ? 'ok(2nd)' : 'ok') : 'FAIL';
      if (!okRes) failures.push({ sym, key, type: entry.typeId, err: (m.error?.code || '') + ': ' + (m.error?.message || '').slice(0, 80), barrier: fields.barrier });
      await sleep(120);
    }
  }
  console.log('=== FAILURES ===');
  console.log(failures.length ? failures.map(f => `${f.sym} ${f.key} (${f.type}) barrier=${f.barrier} -> ${f.err}`).join('\n') : 'none');
  console.log('\n=== PER SYMBOL (ok/na/fail) ===');
  for (const sym of SYMS) {
    const c = { ok: 0, na: 0, FAIL: 0, second: 0 };
    for (const v of Object.values(symType[sym] || {})) {
      if (v === 'ok(2nd)') { c.ok++; c.second++; } else c[v]++;
    }
    console.log(`${sym.padEnd(9)} ok=${c.ok} na=${c.na} fail=${c.FAIL}${c.second ? ` (retried=${c.second})` : ''}`);
  }
  process.exit(failures.length ? 1 : 0);
});
setTimeout(() => { console.log('TIMEOUT'); process.exit(2); }, 300000);
