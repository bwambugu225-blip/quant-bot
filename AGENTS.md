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
```

Verification approach: serve the build, drive it with the browser, and sample
screenshot colours to confirm they match Deriv tokens.

## Deployment (Vercel)

`bot.html` is served at `/` and the React rebuild at `/deriv/`. Vercel runs
`scripts/build-site.sh` (see `vercel.json`), which builds deriv-replica and
assembles `public_out/` with `bot.html` at the root and the build under
`deriv/`. Ordered rewrites route `/deriv` and `/deriv/*` to the SPA, and
everything else falls through to `bot.html`. `deriv-replica/vite.config.js`
uses `base: '/deriv/'` so asset URLs match.

Note: `node_modules/` and `dist/` are normally gitignored, but the current
history also contains a forced commit of them (kept intentionally).
`public_out/` is gitignored.
