# Repository notes

## What this repo contains

A single application: **Quant Terminal** in `deriv-replica/` — a self-contained
quantitative trading terminal (institutional dark theme) that imports 1000 ticks
per market, aggregates them into candles across a 19-timeframe ladder, computes
40+ indicators, runs a visual strategy builder and a backtester, shows live
analytics, places trades, and reports the session. The connection layer is the
real Deriv WebSocket + OAuth API; the chart and UI are our own, with no Deriv UI
packages.

Everything Deriv-UI-specific (SmartCharts, `@deriv-com/quill-*`,
`@deriv/quill-icons`), the marketing-site clone (`src/site/`), the old
`bot.html` dashboard, the payments/top-up paths and the per-contract auto
strategies were removed. What remains is the charting/analytics/strategy
terminal plus the untouched transport.

## deriv-replica

Commands:

```bash
cd deriv-replica
npm install
npm run dev       # vite dev server on port 12000
npm run build     # emits ./dist
npm run preview   # serve built output on port 12000
npm test          # node --test tests/*.test.mjs
```

Dependencies are only `react` + `react-dom` (deps) and `@vitejs/plugin-react` +
`vite` (dev). No Deriv UI packages — do not re-add them; the chart is canvas.

Verification approach: run `npm test`, then `npm run build`, then serve the
build and drive it in the browser. Sample screenshot colours to confirm candles
render. Run `npm test` before pushing — CI (`.github/workflows/ci.yml`) runs the
same command and the Dependabot auto-merge workflow only merges when that `test`
job is green.

### Layout

```
src/
  main.jsx              boot; completes OAuth PKCE on the /callback route
  App.jsx               shell: nav (Chart/Strategy/Positions/Reports/Log), header
  components/           Chart, StrategyBuilder, Analytics, TradeDock, Tables,
                        Panel, Modals
  lib/                  derivClient, oauth, symbols, marketStore, indicators,
                        strategyBuilder, backtest, contracts, engine, analytics,
                        useEngine, usePayout, format, studies, ticker
```

## Market data: 1000 ticks → 19 timeframes

- `derivClient.connectMarket()` opens the public market socket
  (`wss://api.derivws.com/trading/v1/options/ws/public`, no auth). `subscribeMarket`
  requests **1000 ticks** per symbol (`IMPORT_TICKS` in `marketStore.js` is the
  single source of truth) and streams live ticks after.
- `marketStore.js` `onHistory(sym, times, prices)` seeds the tick buffer and
  `bucketTicks` aggregates into candles for every timeframe; `onTick` extends
  the live candle and opens a new one on the bucket boundary.
- The same tape is also folded into **fixed-tick-count bars** (`TICK_BAR_SIZES`
  = `10 25 50 100 200`): `bucketTicksByCount(times, prices, n)` closes a bar
  every `n` ticks regardless of the clock, and `tickBars(sym, size)` reads them.
  The Chart header's "Tick bars" control switches the chart to these, with a
  size picker; "Tick chart" draws the raw tape as a line. Comparing a setup on
  time bars against the same setup on tick bars shows whether it is driven by
  the clock or by how much the tape actually moved.
- The timeframe ladder (`TIMEFRAMES`) is `5s 10s 15s 30s 1m 2m 3m 4m 5m 6m 7m
  8m 9m 10m 11m 12m 13m 14m 15m` — 19 entries. `TF_SEC` maps an id to seconds.
- `5s` is the default timeframe. A 1000-tick import spans ~33 min on the
  volatility indices, which is ~400 five-second candles — enough that every
  indicator window and the strategy builder have real data immediately. A 1m
  default left too few candles after EMA(21) warm-up and the builder produced
  zero backtest trades on first load, which is why 5s is the default.

### Digit precision

The API sends raw JSON numbers, so a real price of `1296.20` arrives as
`1296.2`; reading the last character yields `2` instead of `0`. `symbols.js`
pins each symbol to its authoritative `pip_size` (`R_10`/`R_25` = 3,
`R_50`/`R_75` = 4, `R_100`/`1HZ*V` = 2, `stpRNG*` = 1) and `digitOf(price, sym)`
formats with that many decimals before taking the last digit. `decimalsFor(sym)`
returns the same pip size for display.

## Indicators

`indicators.js` returns **series** for every indicator (aligned to the candle
array, `null` before warm-up), so the chart, the builder and the backtester all
read identical values. The library: SMA, EMA, WMA, DEMA, TEMA, Hull MA, RSI,
MACD, Bollinger Bands, Keltner Channel, Donchian Channel, ATR, ADX/DI,
Stochastic, Stoch RSI, Williams %R, CCI, Rate of Change, Momentum, Aroon,
Ichimoku, SuperTrend, VWAP, OBV, MFI, Volume, TRIX, Williams Alligator, Awesome
Oscillator, Chaikin Money Flow, Klinger Oscillator, Fisher Transform, Vortex,
Detrended Price Oscillator, Ease of Movement, Elder's Force Index, Ultimate
Oscillator, Parabolic SAR (`psarSeries`), `pivotPoints` and `volumeProfile`.
Helpers: `heikenAshi`, `isPinbar`, `isStrong`, `calcKelly`, `lastOf`, and
`indicatorSnapshot(candles)` which returns 50+ named scalar readings for the
analytics panel.

A **quantitative** family sits alongside the classic TA: `zscoreSeries`,
`efficiencyRatioSeries`, `choppinessSeries`, `hurstSeries`,
`fractalDimensionSeries`, `entropySeries`, `skewSeries`, `kurtosisSeries`,
`cusumSeries` and `kalmanSeries`. These describe the *character* of the series
(persistent vs mean-reverting, ordered vs noisy, tail-heavy) rather than a
direction, and each is a plain series so it is usable in the builder too.
`williamsRRanges` returns the %R series plus its zone label.

Two contracts worth keeping:

- Every new indicator is a `*Series` returning an aligned array; the snapshot
  reads the last defined value with `lastOf`. Register it in
  `strategyBuilder.js`'s `INDICATORS` (label, params, outputs, series) and it is
  immediately available in the builder UI — no other change needed.
- `candles()` in `marketStore.js` returns a **fresh array with the last candle
  cloned** on every read. The engine reads candles immutably, and React needs a
  new reference to re-render; returning the internal array (or the live,
  in-place-mutated last candle) is what froze the chart after mount. Keep the
  clone.

## Intelligence layers

Four modules sit on top of the raw tape and feed the Analytics panel. Each is
pure (no state, no I/O) and unit-tested against a deterministic tape, so a
reading is reproducible.

- `microstructure.js` — tick-level reads off `store.ticks(sym)` (prices + times):
  velocity, acceleration, tick frequency, direction ratio, streak, displacement,
  price efficiency, tick/realised volatility, a short-vs-long volatility burst
  ratio, trend strength, reversal rate and an exhaustion read. `tickIntelligence`
  bundles them and derives a bounded `pressure` in `[-1, 1]`.
- `marketStructure.js` — swing detection and structure labelling (HH/HL/LH/LL),
  break-of-structure / change-of-character events, fair-value gaps, order blocks,
  liquidity sweeps, equal highs/lows and a premium/discount split of the dealing
  range. `structureRead(candles)` returns the whole bundle.
- `candleIntelligence.js` — per-bar anatomy: body strength, upper/lower wick
  pressure, displacement vs the recent range, streak, rejection wicks, engulfing,
  inside/outside bars, three-candle reversals, imbalance and effort-vs-result.
  `candleRead(candles)` is the latest-bar read.
- `aiComposites.js` — ten named composites (Velocity Pulse, Exhaustion Radar,
  Liquidity Trap, Microstructure Pressure, Volatility Storm, Reversal
  Probability, Breakout Quality, Trend Persistence, Regime Classifier and a
  Confluence verdict) plus `aiRead({candles, prices, times})`. Each composite
  returns a `0–100` score with the evidence behind it; the Confluence line is the
  agreement-weighted verdict (`BUY` / `SELL` / `WAIT FOR CONFIRMATION` /
  `STAND ASIDE`). Honesty rule: a score is a statement about the measured sample,
  never a promise about the next contract.

## Strategy builder

`strategyBuilder.js` is the DSL. Three parts:

- `INDICATORS` — the registry the builder UI and the operand resolver share.
  Each entry declares `label`, `params` (with defaults/ranges) and `outputs`.
  `operandSeries(candles, operand)` resolves `{kind:'indicator'|'price'|'const'}`
  operands to a series, honouring an `output` selector and a lag `offset`.
- `OPERATORS` — `gt gte lt lte crossOver crossUnder rising falling within`.
- Groups — `{ logic: 'AND'|'OR', conditions: [...] }`, nestable. `evalGroupAt`
  evaluates a group at one candle index; `crossOver`/`crossUnder` fire only on
  the crossing bar.

`evaluateStrategy(strategy, candles)` returns `{action:'up'|'down'|'both'}`
when the long/short tree matches on the latest closed candle, else `null`.
`validateStrategy` returns a list of human-readable errors (used to gate the
Start button). `describeStrategy` renders the expression for the Preview line.
`defaultStrategy()` is the default (EMA 9/21 cross + RSI filter, 5s). The
builder's template menu is `TEMPLATE_MENU` — four hand-written starters
(`STRATEGY_TEMPLATES`) plus **one complete setup for every indicator** in the
registry (`INDICATOR_TEMPLATES`, built by `indicatorStrategy(name)`). `ALL_TEMPLATES`
is the flat factory list. A setup needs no editing: it ships a trigger leg and a
nested confirmation leg at the indicator's canonical parameters, and the entries
are normalised to AND groups so the tree is uniform.

The setups are calibrated, not arbitrary: a moving average is crossed by price, a
band is broken (with an ADX trend gate), a Donchian breakout compares against the
*prior* channel (offset 1 — a close can never exceed the current bar's own high),
an oscillator fires on its recovery cross out of the extreme gated by ADX > 20
(sitting at the extreme and trending up can never both be true, so the trigger is
the turn), a zero-line series crosses zero, and a "character" measure (Hurst,
entropy, skew, fractal dimension) gates a price/21-EMA cross. Thresholds are set
from each series' own measured distribution so every setup fires a handful of
times per session — `tests/strategyBuilder.test.mjs` asserts none never fires and
none fires on almost every bar.

The strategy's `action` is the trade it places — `{ type, contract, duration,
durationUnit, barrier?, allowEquals? }` — chosen in the builder's ContractEditor
against the `contracts.js` `TRADE_TYPES` catalogue, not a fixed Rise/Fall.

### DSL gotchas

- Operand resolution and the compiler both go through `INDICATORS`, so a new
  indicator needs only a registry entry — no builder or engine change.
- `crossOver` needs a previous bar; evaluating at index 0 is always false.

## Backtest

`backtest.js` `runBacktest(strategy, candles, opts)` is a **close-to-close**
simulation: it walks the candles, evaluates the entry trees, and exits at the
close `holdCandles(tf, duration, unit)` candles later. `holdCandles` converts a
duration in ticks/seconds/minutes/hours into candles of the chosen timeframe.
It reports count, wins, losses, win rate, net P&L, profit factor, expectancy,
max drawdown, an estimated Sharpe and end equity, plus the trade list. The
martingale ladder (`base × mult^steps`, capped at `martSteps`, reset on a win)
runs inside the backtest exactly as it does live.

Honest limit: close-to-close is a proxy for a tick contract, not the exchange's
own settlement — the panel says so.

## Manual strategy, contract selection, and chart studies

The bot is **manual only**: the trader builds one strategy and it trades the
selected market. There is no auto-tune and no auto-scan — `autoTune.js`,
`marketScanner.js` and the ScanBoard were removed, along with their tests. The
engine's tick handler evaluates the built strategy on the selected symbol's
closed bars and nothing else.

### Contract selection (`contracts.js` + `ContractEditor`)

- **The strategy picks its own contract.** `strategy.action` carries
  `{ type, contract, duration, durationUnit, barrier?, barrier2?, digit?,
  multiplier?, selectedTick?, equals? }`. The builder's **ContractEditor** shows
  only the inputs the chosen product needs, so a strategy is not locked to
  Rise/Fall.
- **Bar source is a strategy choice.** The builder header picks **Time bars**
  (the timeframe) or **Tick bars** (a fixed tick count, `TICK_BAR_SIZES`). A
  strategy carrying `barSize` reads `store.tickBars(sym, barSize)` instead of the
  clock; `engine.barsFor()` is the single switch and the backtester honours the
  same `barSize`.
- **`TRADE_TYPES` covers the directional catalogue**: Rise/Fall (incl. Equals),
  Higher/Lower, Touch/No Touch, Matches/Differs, Even/Odd, Over/Under,
  Stays/Goes, Ends Between/Outside, **Multipliers** (`multipliers`, leveraged
  long/short), and the digit/last-digit families. `findTradeType(id)` resolves a
  type by id.
- **Barrier derivation.** Types that need a barrier (Higher/Lower, Touch,
  Stays/Goes, Ends…) derive one from spot via ATR when the strategy leaves it
  blank; `engine._fillBarrier` snaps a spot-derived barrier to the published
  ladder from `contracts_for`. The barrier and `equals` flag pass straight into
  `buildProposal`.
- **Multipliers** are leveraged long/short: `buildProposal` maps the side to
  `MULTUP` / `MULTDOWN` with the chosen stake and multiplier.

### Chart studies (`studies.js` + `Chart.jsx`)

- A **study** is `{ name, params, panel }`. `defaultPanel(name)` splits the
  registry into price-scale overlays (`main`: MAs, bands, PSAR, Ichimoku, …) and
  everything else (`sub`, its own pane). `studyOutputs` resolves a study's
  series through the builder's own `operandSeries`, so a line on the chart and a
  rule in the builder read identical values.
- `Chart.jsx` draws price-scale studies over the candles and each sub study in
  its own pane (fixed range for RSI/Stochastic/MFI/Williams %R/ADX/Aroon, auto
  otherwise). The price plot keeps a floor of 120px, so a tall study stack only
  draws as many panes as fit. Sub-pane count is bounded by that floor.
- The `+ Indicator` button opens `IndicatorPicker` (every registry indicator,
  grouped by panel, one click to add); each legend entry carries an `×` to
  remove. The chart's pan handler ignores drags that start on `.chart-tools` or
  `.chart-legend` so those buttons receive the click.

## Engine

`engine.js` is execution. It holds the `MarketStore`, the selected symbol /
timeframe / strategy, and the session bookkeeping. It attaches to a
`DerivClient` (`attach(client)`) and subscribes to its events.

- **Warm-up gate.** `start()` queues a pending start if the target market has
  fewer than `WARMUP_TICKS` (100) ticks; `_onTick` engages the run the moment
  the tape is warm. In practice the 1000-tick import means the start is
  immediate.
- **Evaluation.** On each tick the engine checks whether a new candle has
  closed for the selected market's timeframe; if so it evaluates the built
  strategy on the closed candles and, on a signal, builds a proposal via
  `contracts.js` `buildProposal` and sends it. One entry per closed candle
  (`_lastEvalCandle`). Only the **selected symbol** is evaluated — there is no
  auto-scan across markets.
- **Catalogue shaping.** `_ensureSpecs` fetches each market's `contracts_for`
  (TTL-cached) and `_snapBarrier` snaps a spot-derived barrier to the published
  ladder; a contract the market does not list is skipped. `_fillBarrier` derives
  a barrier from spot via ATR when the strategy's contract type needs one and
  none was entered.
- **Lifecycle.** `_onProposal` → `_onBuy` → `_onContract`; settlement updates
  wins/losses/pnl and the report table. `_sessionAllows` enforces take-profit /
  stop-loss / max-trades / max-losses and stops the run when a cap is hit.
  `_stakeFor` applies the martingale ladder.
- **Persistence.** `_saveBot()` writes the strategy, market, timeframe and
  running flag to `localStorage`; `restoreBot()` restores them on boot and
  `attach()`'s `authorized` handler resumes a run that was live before a reload.
- **Latency.** `_recordExec` / `execStats` report the rolling p50/p95 of
  tick→proposal-received.
- The engine watchdog is a `ticker.js` subscription (see the connection
  section), so it keeps its 1s cadence in a hidden tab.

Constants: `DEFAULT_STAKE=0.35` (the venue minimum, and the default
everywhere a stake is entered), `MIN_STAKE=0.35`, `MAX_STAKE=200`,
`PROPOSAL_TIMEOUT=6000`, `WARMUP_TICKS=100`.

## Money is shown in Kenyan shillings

Every monetary figure in the terminal is presented in KES, and the default
stake is `KES 0.35`.

- `src/lib/format.js` owns the policy: `CURRENCY='KES'`, `DEFAULT_STAKE=0.35`,
  `USD_KES=130`, plus `kes(v)` (an amount already in shillings), `money(v,
  accountCurrency)` (an exchange-quoted figure, converted when the account is
  not KES) and `stakeLabel()`.
- `buildProposal` defaults to `currency: 'KES'`, and the engine passes the live
  account currency (`accountCurrency()`) so a real buy is always denominated in
  the account's own money. The snapshot carries `currency` for the UI.
- The manual trade dock and the strategy builder both ask Deriv for a **KES**
  proposal, so the quoted payout and the placed trade share one currency. A
  figure the exchange quotes in the account currency (balance, contract P&L,
  backtest equity) is converted to KES for display at `USD_KES`.

## Connection layer (retained, and made permanent)

- `derivClient.js` — Deriv API client. Public market socket for
  ticks/history (no auth); authenticated trading socket for balance, proposals,
  buys and contracts. Auth ladder: REST accounts (Bearer + `Deriv-App-ID`) → WS
  `authorize` → `POST /trading/v1/options/accounts/{id}/otp` → direct WS with
  the OTP URL. Account switching re-requests an OTP. `requestContractsFor`
  (TTL-cached by the engine) and `requestPayout` are retained.
- **The connection is a permanent service.** The market socket reconnects
  forever on a jittered backoff (no attempt cap). A watchdog closes and rebuilds
  a socket that has been silent for 45s. `_installNetHooks()` revives both
  sockets on `online`, window `focus` and tab `visibilitychange`, so a
  backgrounded tab or a laptop sleep needs no reload. `marketHealth()` returns
  `{ state, connected, age, rate, ticks, reconnects, reconnectIn }`; the engine
  surfaces it in the snapshot and `useEngine` polls it once a second for the
  status bar. Market-state transitions are logged through the `market-state`
  event.
- **Trading keeps running when the tab is hidden.** Browsers throttle window
  timers in a hidden tab (down to once a minute), which used to stall the engine
  watchdog, the socket heartbeat and the stale-feed watch exactly when the bot
  was meant to keep going. `src/lib/ticker.js` runs a shared 1s tick in a
  dedicated Web Worker (window timers are throttled; worker timers are not),
  with a `setInterval` fallback when Workers are unavailable. The engine
  watchdog, `startHeartbeat` and `_startStaleWatch` all subscribe to it; each
  subscriber is an unsubscribe function, not a raw interval id.
- **No self-logout.** `restoreSession`/`keepSessionAlive` in `useEngine.js`
  refresh an OAuth session in place (once a minute) and retry transient
  failures; a failure never clears the session. `oauth.js` only clears the
  session on a dead grant (invalid_grant / invalid refresh token) — a network
  error, timeout, 5xx or a backgrounded tab keeps it. The header and Trade panel
  key off `state.loggedIn` (session alive) rather than `state.auth` (socket
  live), so a reconnect blip shows "reconnecting", not a logout. Only the Log
  out button clears the session, and it also stops the bot.
- **The bot survives a reload.** `engine._saveBot()` persists the strategy,
  market, timeframe and running flag to `localStorage`; `restoreBot()` (called
  from `useEngine` on boot) brings them back and, if the bot was running, sets a
  resume flag so the run restarts the moment the restored session authorises.
  A tab close is therefore a pause, not a stop.
- `oauth.js` — OAuth 2.0 Authorization Code + PKCE. `beginOAuth` builds the
  authorize URL and stores verifier/state; `completeOAuth(search)` runs the
  token exchange and stores the session. The redirect URI is
  `<origin>/callback.html` (a static bridge that hands `code`/`state` to the
  SPA `/callback` route, where `main.jsx` completes the exchange). A pasted API
  token stays as an advanced fallback.

To trade, log in with Deriv (OAuth) or paste an API token with Read + Trade
scope. Market data needs no login.

## UI shell

- `App.jsx` is the shell: top bar (brand, tabs, account chip), the
  `TickerTape` marquee, the left icon `rail`, the workspace (chart + dock) and
  the bottom `StatusBar`.
- `styles.css` is one flat institutional dark palette — page `#0a0c11`, panels
  `#0f1218`, hairline `#1c222b`, up `#2bb673`, down `#e0524f`, accent `#4c86e0`.
  Hairlines and tabular monospace, no gradients or glows. Keep it that way.
- `Chart.jsx` is self-contained SVG (not canvas): candles/line/Heiken-Ashi,
  EMA/SMA/BB/SuperTrend/VWAP/Parabolic-SAR overlays, a volume histogram, an
  RSI/MACD/Williams-%R sub-pane, a price+time axis grid, a last-price tag and a
  pointer crosshair with an OHLC readout. The header switches the bar source
  (time / tick bars / raw tick line) and the chart mode. The view is a horizontal
  window over the candle buffer — drag to pan, scroll or pinch to zoom,
  double-click (or the ⟲ control) to snap back to the live edge. While the window
  sits at the live edge it follows new candles; once panned back it holds its
  place. The windowing math lives in `src/lib/chartView.js` (`visibleWindow` /
  `zoomWindow` / `panWindow`) so it is unit-tested without a DOM.
- `Analytics.jsx` leads with a one-line **Signal** read (blended trend bias +
  agreement, ADX regime, volatility state, momentum) and an **AI Confluence**
  panel (the ten composites with a verdict line), then Microstructure, Market
  Structure and Candle Intelligence panels, then the 50+ indicators grouped into
  Trend / Momentum / Volatility / Volume / Levels / Quant behind a segmented
  control, so only the important readings are on screen at once. Digit
  distribution and market structure stay as collapsed panels.
- `icons.jsx` holds the stroked rail icons — the rail carries no emoji.

## Tests and CI

- `tests/` runs on Node's built-in test runner (no extra dependency).
  `tests/helpers.mjs` builds deterministic tick tapes and a fake WebSocket
  client — only the socket boundary (`send`/`buy`) is faked; the store,
  indicators, strategy builder, backtester and engine routing are the real code.
- Suites: `marketStore.test.mjs`, `indicators.test.mjs`, `quant.test.mjs` (the
  quantitative family — PSAR, Williams %R zones, z-score, efficiency ratio,
  choppiness, Hurst, fractal dimension, entropy, skew, kurtosis, CUSUM, Kalman),
  `intelligence.test.mjs` (microstructure, market structure, candle intelligence,
  the AI composites and tick-bar folding), `strategyBuilder.test.mjs`,
  `backtest.test.mjs`, `studies.test.mjs` (panel split and study→series
  resolution), `engine.test.mjs` (incl. a Higher/Lower proposal with a derived
  barrier), `resilience.test.mjs` (bot persistence + resume-on-authorise) and
  `connection.test.mjs` (the reconnect loop, stream health and `close()` against
  a stub WebSocket).
- `.github/dependabot.yml` keeps npm deps and workflow actions current.
  Dependabot PRs run with a read-only token, so
  `.github/workflows/dependabot-auto-merge.yml` reacts to the **CI run
  completing** and merges only when the `test` job concluded `success`, the PR
  is Dependabot-authored, non-draft, and still open.

## Deployment (Vercel)

Vercel runs `scripts/build-site.sh` (see `vercel.json`), which builds
deriv-replica and assembles `public_out/` with the build at the root and
`callback.html` alongside it. The only rewrite sends non-asset paths to
`/index.html` (the SPA); `/callback.html` is served as a real static file.
`deriv-replica/vite.config.js` keeps `base: '/'`.

The build installs with `npm ci` (not `npm install`) so it is reproducible and
fails loudly on lockfile drift. **Vite 8 hard-requires Node ≥ 20.19 / 22.12** and
the CLI aborts on anything older, so the Node version is pinned in both `.nvmrc`
and `deriv-replica/package.json` (`engines.node`). Do not remove those pins: an
unpinned build can land on an older Node and fail at `vite build` even though it
passes locally.

Only `master` gets a **Production** deployment; every other branch produces a
**Preview** deployment (its own URL) plus a `Vercel` commit status. So a push to
a feature branch never updates `dv-quant.vercel.app` — that still serves the
bundle from the last `master` build, which is expected, not a failure.

Note: `node_modules/` and `dist/` are gitignored. `public_out/` is gitignored.
