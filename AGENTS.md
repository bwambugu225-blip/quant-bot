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
- `tests/engine.test.mjs` covers the registry, the 70 contracts firing in their
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

### Universal AI (any market, any contract, auto duration)

- `src/lib/universalAI.js` evaluates the **entire registry** — every contract
  family, across all indices, at several auto-picked durations — and returns the
  readings whose confidence clears the configured bar (`UNIVERSAL_MIN_CONF`,
  default 80%). The engine's `universal` mode keeps that list warm in the
  background and, on each tick, re-confirms the top candidate against the live
  tape before placing the trade (so a faded edge is skipped and the runner-up is
  tried). This is separate from the single-contract scanner and is off by
  default.
- Candidate parameters deliberately strip `minConf` out of the strategy and
  apply the threshold centrally, so "80%" means the same thing for every
  contract. The strategy's own z-score / edge gates stay on.
- The trade mirrors the winner back into `autoContractKey` / `autoMarket`, so
  the Trade tab and stats line show what is actually running. Execution uses the
  same proposal path (and the same sub-100ms decision timing) as the single
  contract.
- **Natural cadence.** Universal mode trades *at most* once per
  `UNIVERSAL_MIN_GAP_MS` (5s, ~10 ticks on the volatility indices). The gate is
  a ceiling on frequency, never a trigger: the AI still only trades when a live
  reading clears the confidence bar, so a quiet window correctly produces zero
  trades. It never fabricates an entry to hit a beat.
- Honest limit: only contracts whose own fair win rate is high can reach a high
  confidence. A Matches bet (~10% fair) can never honestly read 80%; the
  evaluator reports what the tape supports and never inflates a reading to clear
  the bar. On Deriv's fair random-walk indices an 80% reading is a statement
  about the measured recent sample, not a guarantee about the next contract.
- **Preferred markets.** The user can narrow the AI to the indices they want.
  `engine.universalMarkets` is an include list — `null` means the whole universe,
  and the first chip tap starts a set (see `toggleUniversalMarket` /
  `setUniversalMarkets` / `clearUniversalMarkets`). `universalSymbols()` resolves
  it in registry order and both `_runUniversalScan` and `warmup()` honour it, so
  a narrowed AI neither scans nor waits on excluded markets. The Automate tab
  renders the chip grid plus a "Money management" panel.
- **Martingale.** The AI has its own parameter block (`universalParams()` /
  `setUniversalParams`) so stake, martingale and the risk caps never inherit a
  value from whichever single contract is selected. Each bought contract pins
  the params it was opened under (`_onBuy`), and settlement reads them back
  (`_onContract`) instead of `paramsFor(autoContractKey)`. That was the bug: in
  universal mode the winner is mirrored into `autoContractKey`, whose params
  have martingale off, so a losing run never escalated the stake. A loss steps
  the ladder (`_stakeFor` → `base × mult^steps`), a win resets it, and it is
  capped at `martSteps`.

### Proposals are shaped to the market's own catalogue

- A contract can only be placed on a market that offers it, with a barrier and
  duration that market accepts. The engine reads `contracts_for` per market
  (`derivClient.requestContractsFor`), caches it with a TTL (`SPEC_TTL_MS`,
  60s) and prefetches every subscribed symbol at start. `shapeProposal` in
  `autoStrategies.js` then picks the correct catalogue row and a market-valid
  barrier/multiplier/duration; a contract the market does not list is skipped,
  never proposed blind.
- Spot-derived barriers (turbos, vanillas, ranges, touch products) are
  recalculated by the exchange every few seconds, so a catalogue read can be
  stale by the time the proposal lands. Vanilla strikes snap to the nearest
  in-the-money rung; turbo and higher/lower/touch barriers snap to the
  published ladder. On a barrier rejection the engine adopts the ladder the
  rejection reports and resends once (non-barrier rejections are left logged).
- Durations are clamped into the row's declared `[min, max]`. A row with no
  published `unit_options` (e.g. UPORDOWN intraday on the 1HZ indices, 2m–1d)
  rejects a sub-minimum hold outright with "Trading is not offered for this
  duration", so the wanted duration is lifted to the minimum instead of sent
  as-is. Without this every Universal AI entry defaulted to a 1m hold and was
  rejected — the AI looked dead while it was in fact deciding and failing.
- Honest limit: R_75's vanilla ladder moves by tens of points within a second,
  so those two contracts can still be rejected even on the retry. The engine
  skips them rather than sending a barrier the exchange will not take. A live
  harness (`scripts/verify-contracts.mjs`, run with `node`) fires every
  contract/symbol pair against the Deriv API to catch such gaps.

### Tick-based contract coverage

The registry covers Deriv's full tick-based catalogue (70 contracts). The
families added on top of the original directional/digit set:

| Family | Types | Inputs | Edge read from |
|--------|-------|--------|----------------|
| Stays/Goes | `RANGE`, `UPORDOWN` | `barrier` + `barrier2` | replay: did a step-scaled band survive the hold? |
| Ends Between/Outside | `EXPIRYRANGE`, `EXPIRYMISS` | `barrier` + `barrier2` | replay: did the endpoint close inside the band? |
| Only Ups/Downs | `RUNHIGH`, `RUNLOW` | duration (ticks) | run completion rate vs the `2^-d` fair baseline |
| Asian Up/Down | `ASIANU`, `ASIAND` | duration | last tick's standardised distance from the running mean |
| Reset Call/Put | `RESETCALL`, `RESETPUT` | duration | trend confirmation, with the reset as a second chance |
| High/Low Tick | `TICKHIGH`, `TICKLOW` | `selected_tick` (1–5) | AR(1) drift picks the slot; slot hit-rate vs 20% fair |
| Lookbacks | `LBFLOATCALL`, `LBFLOATPUT`, `LBHIGHLOW` | duration + `multiplier` | volatility expansion (short vs long avg move) |

Notes on honesty:

- The range ("Stays/Goes", "Ends") strategies are the most conservative. The
  band half-width is anchored to the instrument's typical per-tick step (scaled
  by `sqrt(hold)`), not the raw recent range, because the recent range is itself
  contaminated by any expansion we are trying to detect. The reading is a
  historical replay, so a high confidence means "this band held this often at
  this width over the sample", never "it will hold".
- Only Ups/Downs confidence is capped near 94% because the fair rate (2⁻ᵈ) is
  genuinely low; the strategy reports the measured run-completion rate, not a
  promise.
- High/Low Tick is a lottery contract: the 5 slots are exchangeable and the
  only structure is short-horizon autocorrelation. The signal refuses to fire
  unless a slot's hit rate clears the 20% baseline by a real margin.
- `selected_tick` is a parameter, not a separate contract: one `TICKHIGH` /
  `TICKLOW` entry, with the slot chosen in the Automate panel's segmented
  control.
- The Asian and High/Low Tick signals read the raw tick tape
  (`ctx.prices`, from `store.livePrices(sym)`), which the engine now passes into
  every signal context alongside `candles` and `digits`.

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

### Build toolchain and the React 18 pin

The Vite toolchain is on the current major: `vite@8` + `@vitejs/plugin-react@6`.
These two move together (plugin-react 6 requires Vite 8), so a Dependabot PR
that bumps only one of them can never `npm ci` on its own.

React is deliberately held on **18.x**. `@deriv-com/quill-ui` pins
`@headlessui/react@1.7.18`, whose peer range is `react ^16||^17||^18`. Installing
React 19 with `--legacy-peer-deps` resolves the tree and even builds, but the
app throws during render and the page comes up blank — which is exactly why the
Vercel Preview deployments for the React 19 Dependabot PRs failed. `react` and
`react-dom` **major** updates are ignored in `.github/dependabot.yml` until the
Deriv UI stack ships a React-19-compatible release; remove the `ignore` entries
at that point. React-patch/minor stays automatic.

## Deriv rebuild — live engine

`deriv-replica/` is not a static mock: it is wired to the real Deriv WebSocket
API (same transport as `bot.html`).

### Matching the real Deriv look

- `index.html` sets no `maximum-scale`/`user-scalable`, so pinch-zoom works as it
  does on deriv.com.
- `src/styles.css` sets `html { font-size: 62.5% }` (10px root). The Deriv
  packages (`@deriv-com/quill-tokens`, `quill-ui`, SmartCharts) size in `rem`
  against Deriv's 62.5% root; with a 16px root the left rail and chart controls
  render oversized. The rail is correct at 72px once the root is 10px.
- The marketing nav (`src/site/Nav.jsx`, `.site-nav`) and hero use Deriv's dark
  slate (`#181c25` nav, dark hero). Log in / Open account sit at the top-right
  as outline buttons (`.button.white_outline`); they are not in the centre pill.
- The trader deliberately has **no Automate/bot surface**: the bottom nav is
  Trade / Positions / Reports / Menu and the desktop rail is Home / Positions /
  Reports + Help / Language / Theme / Account. Language opens a sheet; Account
  opens the Accounts Centre.
- `src/components/screens.jsx` `MenuScreen` is the Accounts Centre: demo/real
  cards with balance + switch, then grouped Trading and Settings rows.
- `src/components/ChartErrorBoundary.jsx` wraps SmartChart so a chart remount
  (e.g. on a theme toggle) degrades to the lightweight `ChartArea` instead of
  blanking the whole app.

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
- `src/lib/autoStrategies.js` — the per-contract strategy registry (70
  contracts). Each contract carries its own signal function, tuned thresholds
  and defaults. `ACCURACY_LEVELS` (Max/High/Balanced) maps one UI choice onto
  the three gates every signal is checked against: `minConf`, `minEdge` and a
  `zMult` multiplier on the per-barrier z gate. Max is the default.
- `src/lib/useEngine.js` — React binding. Boots the public market feed on load
  (live prices without login) and restores a saved token from `localStorage`
  to reconnect on reload.

### AppV2 desktop shell (sidebar, chart + params grid)

The trading app is a faithful copy of Deriv's AppV2, whose layout is published
in `deriv-com/dtrader-template` (`packages/trader/src/AppV2/`). Two structural
facts drive the shell:

- **Desktop is a left icon rail, not a bottom bar.** AppV2 renders
  `AppV2/Components/Layout/Sidebar` (`sidebar.scss`) only when `!isMobile`. The
  rail is `7.2rem` wide, `--color-nav-bg` background, with a 6.4rem brand header,
  a separator, then Home / Positions / Reports and a bottom utility group of
  Help / Language / Theme / Account — each item 7.2rem tall with a 4rem icon
  box. `src/components/Sidebar.jsx` mirrors this. The bottom navigation and the
  top account header are mobile-only (`trade-desktop.tsx` puts `AccountHeader`
  inline in the desktop `trade__header`, but the rail carries the brand), so
  below `768px` the rail hides and the bottom nav returns.
- **Desktop grids the chart beside the parameters.** `trade-desktop.tsx` uses
  `trade.scss`'s `grid-template-columns: 1fr minmax(0, 28rem)`: chart left,
  params column right. `App.jsx` mirrors that with `.trade-grid` /
  `.trade-grid__chart` / `.trade-grid__params`; mobile stacks the dock under
  the chart. The market selector lives inside the chart column, and the round
  `32px` Guide button sits next to it.

Fonts follow the current Deriv stack: Inter for the trading app, Ubuntu +
IBM Plex for the marketing site.

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
  Stays Between/Goes Outside and Ends Between/Outside → duration + stake +
  `barrier` + `barrier2` (the two-barrier range); Only Ups/Downs, Asian Up/Down,
  Reset Call/Put → duration + stake; High/Low Tick → stake + `selected_tick`
  (the fixed five-tick window takes **no** duration); Lookbacks → duration +
  stake + `multiplier`; Matches/Differs and Over/Under → duration + stake +
  last-digit barrier; Even/Odd → duration + stake; Accumulators → stake +
  `growth_rate` + risk limits, **no duration**; Multipliers → stake +
  `multiplier` + risk + optional cancellation. `buildProposal()` maps form state
  onto the exact `proposal` payload.
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

## deriv.com marketing-site clone

The React build now serves **two applications from one bundle**, chosen in
`src/main.jsx` by pathname:

- `/` and every marketing path → `src/site/` — a clone of the public
  **deriv.com** marketing site.
- `/trader` and deeper → the existing live trading app (`App.jsx`).

`src/site/siteData.js` holds the navigation, footer and page copy transcribed
from the live site, so the components stay presentational.

- **Design values are the real ones.** `src/site/site.css` was written from
  `deriv.com`'s own published stylesheet (`/_next/static/chunks/*.css`), not
  eyeballed: coral brand `#ff444f`, up/buy `#00c390`, down/sell `#e5303b`,
  the slate ramp through `#181c25`, and the **Inter** type stack (the current
  site uses Inter, not Ubuntu/IBM Plex — those remain the trading app's stack).
- The brand logo is Deriv's own SVG, vendored at
  `src/site/assets/deriv-logo.svg`.
- `RouterProvider` / `Link` in `src/site/router.jsx` are a small history
  router; Vite `base` is `/` (absolute asset URLs) so deep client routes like
  `/markets/forex` resolve assets from the origin root. Vercel's SPA rewrite
  serves `index.html` for every non-asset path.
- Login is **functional**: `site/SiteAuth.jsx` authorises a real Deriv API
  token via `DerivClient.authorize`, stores it in `localStorage` under
  `deriv_token`, then sends the user to `/trader`, where the trading app
  restores the same session. Market data needs no login.
- Pages covered: home, markets index + 7 market detail pages, platforms index
  + 6 platform pages, help centre, payment methods, login, sign-up, plus a
  shared content page for legal/about/support/promo paths and a 404.

### The trade chart is Deriv's real SmartCharts

The chart on `/trader` is `@deriv-com/smartcharts-champion` — the same library
app.deriv.com ships — not a lookalike. Facts worth keeping:

- SmartCharts owns rendering but not the feed. The host answers its
  `ticks_history` history and stream (via `DerivClient.requestHistory` /
  `forgetHistory`, routed over the public socket and keyed by `req_id` in
  `_histCbs`) and hands over `active_symbols` + `trading_times` as the
  `chartData` prop so its own symbol and trading-time widgets work.
- It reads `chartData` only at mount, so `SmartChartArea` waits for that data
  (6s timeout) before mounting the chart instead of feeding it afterwards.
- The Flutter chart bundle is copied by a small `closeBundle` walker in
  `vite.config.js` to `dist/smartcharts`, preserving the exact layout the
  library asks for: the chunks and `sprite-*.svg` at the public-path root,
  `chart/**` (entrypoint, `canvaskit/`) under `/smartcharts/chart`, and
  Flutter `assets/**` at `/smartcharts/assets`. A glob-copy plugin flattened
  these into `node_modules/...` paths and broke runtime loading, which is why
  the walker exists. `setSmartChartsPublicPath('/smartcharts/')` points the
  library at it.
- `vercel.json`'s SPA rewrite excludes `smartcharts/` (as well as `assets/`)
  so those files are served as real static assets in production.
- `ChartArea.jsx` (the SVG sparkline) is kept as the fallback for when there
  is no market socket yet, not the default chart.

