# Deriv Trader replica

A pixel-faithful rebuild of the Deriv Trader (AppV2) interface, built with
Deriv's own open-source packages so the design language is not approximated but
imported.

Not affiliated with Deriv. Interface replica for demonstration only.

## Why this is a true replica

Instead of hand-picking hex codes, this project depends on Deriv's published
design system:

| Package | Role |
| --- | --- |
| `@deriv-com/quill-tokens` | The Quill design tokens (colour, radius, spacing, typography). Imported wholesale as `quill.css`. |
| `@deriv-com/quill-ui` | Deriv's own React component library (Button, Tag, ToggleSwitch, Navigation, ThemeProvider…). |
| `@deriv/quill-icons` | Deriv's official icon set, including the real `TradeTypesUpsAndDowns*` and `TradeTypesDigits*` icons. |

Everything visual therefore resolves to the same custom properties that power
`app.deriv.com`: `--core-color-solid-coral-700` (#ff444f), the slate ramp
through `--core-color-solid-slate-1200` (#181c25), the Ubuntu / IBM Plex Sans /
IBM Plex Mono type stack, and the Quill radius scale.

Trade colours match `packages/shared/src/styles/constants/colors.scss` from the
Deriv Trader template: buy `#4bb4b3` (`$color-success`), sell `#ec3f3f`
(`$color-danger`).

## What it does

- Live-simulated volatility indices (R_10 … R_100) with a rolling tick chart
- Rise/Fall and Digits trade types using Deriv's real contract names
- Digit distribution histogram (last-digit frequencies over the recent window)
- Stake stepper, duration chips, live payout, purchase buttons
- Positions list with won/lost settlement, account and settings screens

## Run

```bash
npm install
npm run dev      # http://localhost:12000
npm run build    # emits ./dist
npm run preview  # serve the built output
```

## Layout

```
src/
  App.jsx                 app shell + trade state machine
  main.jsx                Quill ThemeProvider bootstrap
  styles.css              AppV2 shell layout on top of the Quill tokens
  lib/market.js           tick synthesis, digit distribution, payouts
  components/
    Header.jsx            brand, account chip, balance, Deposit
    Chart.jsx             tick-line chart
    SymbolSheet.jsx       underlying-asset bottom sheet
    TradePanel.jsx        Rise/Fall + Digits, duration, stake
    PurchaseButtons.jsx   buy/sell / single-contract buttons
    BottomNav.jsx         Home, Positions, My account, Settings
    Positions.jsx         open and settled contracts
    Settings.jsx          preferences
```
