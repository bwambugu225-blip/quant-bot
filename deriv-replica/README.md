# Quant Terminal

A self-contained quantitative trading terminal: institutional dark-theme
charting, a 40+ indicator library, a visual strategy builder with a backtest
engine, live analytics, a trade dock and a session report — wired to the real
Deriv WebSocket/OAuth connection layer for live execution.

It is a charting and execution tool, not a signal service. Every reading it
shows is computed from the tape it imported; nothing is pre-baked.

## What it does

- **Imports 1000 ticks** per market over the public Deriv market socket (no
  login required for market data) and **aggregates them into candles** for
  every timeframe in the ladder: `5s 10s 15s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m
  10m 11m 12m 13m 14m 15m` (19 timeframes).
- **40+ indicators**, each a real series (so the builder, the chart and the
  backtester all read the same values): SMA, EMA, WMA, DEMA, TEMA, Hull MA, RSI,
  MACD, Bollinger Bands, Keltner Channel, Donchian Channel, ATR, ADX/DI,
  Stochastic, Stoch RSI, Williams %R, CCI, Rate of Change, Momentum, Aroon,
  Ichimoku, SuperTrend, VWAP, OBV, MFI, Volume, TRIX, Williams Alligator,
  Awesome Oscillator, Chaikin Money Flow, Klinger Oscillator, Fisher Transform,
  Vortex, Detrended Price Oscillator, Ease of Movement, Elder's Force Index,
  Ultimate Oscillator, classic pivot points, a volume profile (point of
  control), plus raw price fields (open/high/low/close/hl2/hlc3/ohlc4).
  The Analytics panel groups them into Trend / Momentum / Volatility / Volume /
  Levels so the column stays scannable, and leads with a one-line **Signal**
  read: the blended trend bias, its agreement, the ADX regime, the volatility
  state and the momentum read.
- **Strategy builder**: a visual DSL — nested AND/OR groups of comparisons over
  indicators, price and constants, with operators `>`, `≥`, `<`, `≤`,
  `crosses above`, `crosses below`, `is rising`, `is falling`, `is within % of`.
  Separate long/short entry trees, a contract + duration, and a risk block
  (stake, take-profit, stop-loss, max trades, max consecutive losses,
  martingale multiplier/steps). Save/load strategies to `localStorage`. The
  stake defaults to `KES 0.35` and every money figure is shown in Kenyan
  shillings.
- **Backtest engine**: close-to-close simulation over the imported candles with
  win rate, net P&L, profit factor, expectancy, max drawdown, an estimated
  Sharpe and end equity, plus the full trade list.
- **Live chart**: the last candle updates in place on every tick and a new one
  opens on the timeframe boundary — the store hands out a fresh, cloned array
  each read so React re-renders the forming bar instead of a frozen snapshot.
  Overlays (EMA 9/21, Bollinger, SuperTrend, VWAP), a volume histogram and an
  RSI/MACD sub-pane sit over SVG candles/line with a crosshair readout.
- **Live analytics**: digit distribution with χ² bias test, entropy, hot/cold
  digits, even/odd split, current streak, and a market-structure panel (trend,
  ATR, volatility, swings).
- **Trade dock**: manual placement of any catalogue contract (Rise/Fall,
  Higher/Lower, Touch/No Touch, Matches/Differs, Even/Odd, Over/Under,
  Stays/Goes, Ends Between/Outside, Asians, Resets, High/Low Tick, Lookbacks)
  and the automation toggle that runs the built strategy live.
- **Reporting**: session win/loss bookkeeping, net P&L, and a per-trade report
  table.
- **Live tape + status bar**: a marquee ticker tape across the top shows every
  subscribed market with its session change; the bottom status bar reports the
  health of the feed (state, tick rate, tick age, tick count, reconnect count)
  alongside execution latency and the session P&L.

## Architecture

```
src/
  main.jsx              boot; completes the OAuth PKCE exchange on /callback
  App.jsx               shell: nav, header, tape, status bar, screens
  components/
    Chart.jsx           self-contained SVG candles/line + overlays + volume + panes + crosshair
    TickerTape.jsx      marquee live tape across all subscribed markets
    StatusBar.jsx       feed health, latency, session P&L
    icons.jsx           inline stroked rail icons
    StrategyBuilder.jsx visual DSL editor + backtest panel
    Analytics.jsx       signal readout + grouped indicators + digit/structure stats
    TradeDock.jsx       manual trade form + automation toggle
    Tables.jsx          positions + reports + logs tables
    Panel.jsx, Modals.jsx
  lib/
    derivClient.js      Deriv API client (public market WS + authed trading WS + reconnect/health)
    oauth.js            OAuth 2.0 PKCE (authorize URL, token exchange, refresh)
    symbols.js          symbol catalogue + per-symbol pip size
    marketStore.js      1000-tick import, candle aggregation for all timeframes
    indicators.js       the indicator library (series-returning)
    strategyBuilder.js  indicator registry, operators, DSL eval, compiler
    backtest.js         close-to-close backtester
    contracts.js        trade-type catalogue + proposal builder
    engine.js           execution: proposals, buys, contract lifecycle, risk
    analytics.js        digit stats + market stats
    useEngine.js        React binding
    usePayout.js        live payout quoting
```

The chart is self-contained (SVG), so the app has **no Deriv UI dependencies** —
only `react`, `react-dom` and Vite. The connection layer is retained: the public
market socket for ticks/history and the authenticated trading socket for
balance, proposals, buys and contracts.

## Connection layer (retained, and made permanent)

- **Market data** needs no login. `DerivClient.connectMarket()` opens
  `wss://api.derivws.com/trading/v1/options/ws/public`; `requestHistory` seeds
  1000 ticks per subscribed symbol and `tick` streams keep them live.
- **The stream is treated as a permanent service.** The market socket
  reconnects forever on a jittered backoff (no attempt cap), a watchdog drops
  and rebuilds a socket that has gone quiet for 45s, and the client revives the
  connection the moment the tab regains focus or the network returns — so a
  backgrounded tab or a laptop sleep never needs a reload. `marketHealth()`
  surfaces state / freshness / rate / reconnects for the status bar.
- **The session never logs out on its own.** A saved OAuth session is refreshed
  in place every minute; a transient failure is retried, never treated as a
  logout. Only the explicit Log out button clears the session.
- **Trading** uses the OAuth-issued OTP URL: REST accounts (Bearer +
  `Deriv-App-ID`) → WS `authorize` → `POST /trading/v1/options/accounts/{id}/otp`
  → direct WS. Account switching (demo ↔ real) re-requests an OTP.
- **Login** is Deriv OAuth 2.0 Authorization Code + PKCE. `src/lib/oauth.js`
  builds the authorize URL, stores the verifier/state, and exchanges the code
  at `/oauth2/token` from the browser. The redirect lands on `/callback.html`,
  which bridges to the SPA `/callback` route where `main.jsx` runs the
  exchange. A pasted API token remains as an advanced fallback.
- Proposals are shaped to each market's own `contracts_for` catalogue (with a
  TTL cache), so a contract the market does not list is skipped, never proposed
  blind; barriers snap to the published ladder.

## Commands

```bash
cd deriv-replica
npm install
npm run dev       # vite dev server on port 12000
npm run build     # emits ./dist
npm run preview   # serve the build on port 12000
npm test          # node --test tests/*.test.mjs
```

Run `npm test` before pushing — CI (`.github/workflows/ci.yml`) runs the same
command, and the Dependabot auto-merge workflow only merges when the `test` job
is green.

## Tests

`tests/` uses Node's built-in test runner (no extra dependency). `tests/helpers.mjs`
builds deterministic tick tapes and a fake WebSocket client — only the socket
boundary (`send`/`buy`) is faked; the store, indicators, strategy builder,
backtester and engine routing are the real code.

- `marketStore.test.mjs` — the timeframe ladder, tick→candle aggregation,
  1000-tick import, live extension, digit derivation, pip-size digits, and the
  fresh-reference contract that keeps the chart live (a held snapshot is never
  mutated in place).
- `indicators.test.mjs` — every indicator's numeric behaviour, the extended
  series (DEMA/TEMA/Hull/TRIX/Alligator/Awesome/CMF/Klinger/Fisher/Vortex/DPO/
  EOM/Force/Ultimate, pivots and the volume profile) and the 40+ reading
  snapshot.
- `strategyBuilder.test.mjs` — the indicator registry, operand resolution
  (price/const/indicator, output selectors, lag), AND/OR nesting, crossOver,
  rising/falling, validation, templates and compilation.
- `backtest.test.mjs` — duration→candle conversion, trade generation on a
  trending tape, the max-trades cap, martingale escalation, and the
  consistency of the reported statistics.
- `engine.test.mjs` — 1000-tick import, warm-up gating, strategy firing through
  the proposal socket, one-entry-per-candle, manual placement field mapping,
  buy→settle bookkeeping, loss caps, take-profit stop and exec latency stats.
- `connection.test.mjs` — the connection layer against a stub WebSocket: the
  market-state transitions, infinite auto-reconnect after a drop, the tick
  health readout (count/freshness/rate), `reconnectMarket()`, and that
  `close()` stops the reconnect loop.

## Deployment

Vercel runs `scripts/build-site.sh` (see `vercel.json`), which builds
deriv-replica and assembles `public_out/` with the build at the root and
`callback.html` alongside it. The only rewrite sends non-asset paths to
`/index.html` (the SPA); `/callback.html` is served as a real static file.
`vite.config.js` keeps `base: '/'`.
