# Repository notes

## What this repo contains

- `bot.html` — the original single-file trading dashboard (hand-authored HTML/CSS/JS).
- `deriv-replica/` — a React rebuild of the Deriv Trader (AppV2) interface.

## deriv-replica

Built on Deriv's own published packages, not approximations:

- `@deriv-com/quill-tokens` — Quill design tokens. Imported wholesale via
  `@deriv-com/quill-tokens/dist/quill.css`. Every colour/radius/type value in
  the app resolves to these custom properties.
- `@deriv-com/quill-ui` — Deriv's React component library.
- `@deriv/quill-icons` — Deriv's official icons.

Key facts worth remembering:

- Trade colours come from the Deriv Trader template's
  `packages/shared/src/styles/constants/colors.scss`: buy teal `#4bb4b3`
  (`$color-success`), sell `#ec3f3f` (`$color-danger`).
- Slate ramp: `...-1100` = `#20242f`, `...-1200` = `#181c25` (page bg),
  `...-1000` = `#282c38`. Coral brand = `#ff444f`.
- Digit contracts are `DIGITOVER` / `DIGITUNDER` / `DIGITMATCH` / `DIGITDIFF`.
- Rise/Fall maps to contract types `CALL` / `PUT` upstream.

Commands:

```bash
cd deriv-replica
npm install
npm run dev       # vite dev server on port 12000
npm run build     # emits ./dist
npm run preview   # serve built output on port 12000
npm test          # node --test tests/*.test.mjs
```

Verification approach: serve the build, drive it with the browser, and sample
screenshot colours to confirm they match Deriv tokens. Run `npm test` before
pushing — CI (`.github/workflows/ci.yml`) runs the same command and the
Dependabot auto-merge workflow only merges when that `test` job is green.

### Testing and CI

- `tests/` holds the suite, run with Node's built-in test runner (no extra
  dependency). `tests/helpers.mjs` builds deterministic tick streams and a fake
  WebSocket client — only the socket boundary (`send`/`buy`) is faked; engine
  routing, strategies, and proposal construction are the real code.
- `tests/engine.test.mjs` covers the registry, the 55 contracts firing in their
  own regime, accuracy ordering, duration-aware analysis, the multi-market
  scanner, lightning execution, proposal→buy→settle, warm-up, and the session
  guards.
- `.github/dependabot.yml` keeps npm deps and workflow actions current.
  Dependabot PRs run with a read-only token, so
  `.github/workflows/dependabot-auto-merge.yml` reacts to the **CI run
  completing** and merges only when the `test` job concluded `success`, the PR
  is Dependabot-authored, non-draft, and still open.

### Duration-aware auto-trading and warm-up

- `durationProfile(params)` in `autoStrategies.js` turns the selected duration
  into the scale of the analysis. A longer hold widens every strategy window
  (`windowScale`) and raises the evidence bar (`durZ`), so a 1-minute bet is a
  harder, longer-context question than a 1-tick bet. Duration is also echoed on
  the signal (`sig.dur`) and flows into the proposal.
- The engine will not start on a cold tape. `start()` queues a pending start if
  the target market has fewer than `WARMUP_TICKS` (100) ticks, and `_onTick`
  engages the run automatically the moment the tape is warm — the user clicks
  START once. The market feed preloads ~1100 ticks per symbol on connect, so in
  practice the tape is already warm and the start is immediate.

## Deployment (Vercel)

`bot.html` is kept at `/bot.html` and the React rebuild is served at the root
`/`. Vercel runs `scripts/build-site.sh` (see `vercel.json`), which builds
deriv-replica and assembles `public_out/` with the build at the root and
`bot.html` alongside it. The only rewrite sends every non-asset path to
`/index.html` (the SPA); `/bot.html` and `/callback.html` are served as real
static files. `deriv-replica/vite.config.js` keeps `base: './'` so asset URLs
are relative and work at the root.

Production aliases (Vercel project `b0231911-2730s-projects/quant-bot`):
custom domain `https://dv-quant.vercel.app`, and
`https://quant-bot-b0231911-2730s-projects.vercel.app`.

Note: `node_modules/` and `dist/` are normally gitignored, but the current
history also contains a forced commit of them (kept intentionally).
`public_out/` is gitignored.

## Deriv rebuild — live engine

`deriv-replica/` is not a static mock: it is wired to the real Deriv WebSocket
API (same transport as `bot.html`).

- `src/lib/derivClient.js` — Deriv API client (current transport, per
  https://developers.deriv.com/llms.txt). Public market data connects to
  `wss://api.derivws.com/trading/v1/options/ws/public` (no app id, no auth);
  authenticated trading uses the OTP-issued `…/ws/real|demo` URL from
  `POST /trading/v1/options/accounts/{id}/otp`. Auth ladder: REST accounts
  (Bearer + `Deriv-App-ID`) → WS `authorize` → OTP URL → direct WS with token.
  The legacy `ws.derivws.com/websockets/v3` endpoint is kept only as a fallback.
  Two sockets: the authenticated trading socket for balance/proposals/buys/
  contracts, and the public market socket for tick history. Account switching
  (demo ↔ real) re-requests an OTP for the target account.
- `src/lib/marketStore.js` — tick/candle engine. `ticks_history` seeds candles
  per timeframe (5s/15s/30s/1m) and `tick` streams update them live; digit
  history is derived from the last digit of each quote.
- `src/lib/strategies.js` — the single confluent reversal strategy
  (`REV_BB`) plus the digit rolling-bias strategy, ported from `bot.html`.
- `src/lib/engine.js` — execution: proposals, buys, contract lifecycle,
  auto-engine run/stop, manual Rise/Fall and digit trades, martingale, Kelly
  sizing, win/loss bookkeeping.
- `src/lib/autoStrategies.js` — the per-contract strategy registry (55
  contracts). Each contract carries its own signal function, tuned thresholds
  and defaults. `ACCURACY_LEVELS` (Max/High/Balanced) maps one UI choice onto
  the three gates every signal is checked against: `minConf`, `minEdge` and a
  `zMult` multiplier on the per-barrier z gate. Max is the default.
- `src/lib/useEngine.js` — React binding. Boots the public market feed on load
  (live prices without login) and restores a saved token from `localStorage`
  to reconnect on reload.

### Automate tab: defaults over knobs

The Automate tab exposes only the two decisions that change the outcome — stake
and accuracy. Duration, barrier, digit, growth rate and multiplier are per-
contract defaults (`entry.defaults`), and risk/martingale knobs live behind an
Advanced toggle. The engine stores just `stake` + `accuracy` per contract
(`defaultParamsFor`), so switching contracts can never leave a stale barrier
behind.

Accuracy gates, in order of strictness:

| Level | minConf | minEdge | zMult | maxLosses |
|-------|---------|---------|-------|-----------|
| Max | 70 | 0.035 | 1.30 | 3 |
| High | 65 | 0.025 | 1.12 | 5 |
| Balanced | 60 | 0.015 | 1.00 | 8 |

`minConf` sits below the confidence ceiling of the high-probability contracts
(Differs, Accumulators cap around 76–79%), so `minEdge` and `zMult` do the real
work. All three levels stay silent on a 60% digit stream and fire on a 75%+ one.

### Execution speed

- Digit contracts are evaluated on the tick that just printed — no waiting for
  a candle to close. Directional contracts still wait for a completed candle.
- The multi-market ranking runs on its own 800ms cadence in the background
  (`_runScan`), never inside the tick handler, so the hot path only runs one
  contract's signal on one market. Measured tick → proposal: ~1ms.
- The auto-engine proposal request omits `subscribe`, so it gets a single
  response instead of a streaming subscription that would leave the contract
  map populated with duplicates.
- Proposal timeout is 6s (`PROPOSAL_TIMEOUT`), and the watchdog (1s) releases
  stale `sending`/`pending` entries after 8s, so a dropped request costs at most
  one tick instead of stalling the engine.
- `engine.execStats()` reports the rolling p50/p95 of tick → proposal-received,
  surfaced in the Market panel, so latency is measured rather than asserted.

### Multi-market scanner

`MarketScanner` (`src/lib/marketScanner.js`) scores **every** eligible market for
the selected contract on each pass and the engine bets on the leader. For digit
contracts, which are symbol-agnostic, this means the engine can take a
qualifying signal on whichever index is strongest at that instant instead of
idling on one hand-picked market — a decision a single-market strategy cannot
make. `autoSwitch` is on by default.

- The scan is throttled to `SCAN_INTERVAL_MS` (800ms) and runs from the
  watchdog, so it never slows the trade path.
- Scores use a capped accuracy (`balanced` gates) so markets stay comparable;
  the trade itself still applies the user's own Max/High/Balanced gates, so the
  scanner never loosens selectivity.
- The engine only rotates away from the current market when the leader beats it
  by 15%, so it does not flip between near-equal indices.
- `_scannedAt(sym)` gates the lightning path: a digit tick only fires if the
  scanner scored that market within the last two cadences.
- The Market panel renders the live top-8 board (rank, score bar, confidence),
  updating on each `scan` event without a full engine-state round trip.


To trade, click Log in and paste a Deriv API token with Read + Trade scope.
Market data needs no login. Notation: the engine speaks `RISE`/`FALL`
internally and sends `CALL`/`PUT` to Deriv; digit sub-types map to
`DIGITMATCH`/`DIGITDIFF`, `DIGITOVER`/`DIGITUNDER`, `DIGITEVEN`/`DIGITODD`
(Even/Odd are sent without a barrier).

### Per-trade-type inputs and digit precision

- `src/lib/contracts.js` is the trade-type catalogue. Each entry declares the
  `inputs` that type actually needs, because Deriv trade types do not share a
  parameter set: Rise/Fall → duration + stake (+ `equals` → `CALLE`/`PUTE`);
  Higher/Lower, Touch/No Touch, Turbos, Vanillas → duration + stake + barrier;
  Matches/Differs and Over/Under → duration + stake + last-digit barrier;
  Even/Odd → duration + stake; Accumulators → stake + `growth_rate` + risk
  limits, **no duration**; Multipliers → stake + `multiplier` + risk +
  optional cancellation. `buildProposal()` maps form state onto the exact
  `proposal` payload.
- Digits must be read at the symbol's pip precision. The API sends raw JSON
  numbers, so a real price of `1296.20` arrives as `1296.2` and reading the
  last character yields `2` instead of `0`. `marketStore.js` therefore pins
  each symbol to its authoritative `pip_size` (`R_10`/`R_25` = 3,
  `R_50`/`R_75` = 4, `R_100`/`1HZ*V` = 2, `stpRNG*` = 1) and
  `digitOf(price, sym)` formats with that many decimals before taking the last
  digit. `decimalsFor(sym)` returns the same pip size for display.
- `src/lib/digitAnalysis.js` computes the digit distribution, χ² bias test,
  entropy, hot/cold digits, even/odd split, streak, and a Markov-smoothed
  prediction. Predictions rank by edge relative to break-even (return-on-risk),
  so trivial high-probability low-payout calls are not surfaced first.
- The Trade tab is a fixed, non-scrolling column (`overflow: hidden`, chart is
  the only flexible region); the form dock sits at the bottom. Account
  switching is the header chip → popover (demo ↔ real), which re-requests an
  OTP for the target account.
