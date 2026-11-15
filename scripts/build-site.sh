#!/usr/bin/env bash
# Assembles the Vercel output: the terminal build at the root, plus the OAuth
# callback bridge at "/callback.html". Run by Vercel via vercel.json.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public_out"

cd "$ROOT/deriv-replica"
npm ci --no-audit --no-fund
npm run build

cd "$ROOT"
rm -rf "$OUT"
mkdir -p "$OUT"

cp -r deriv-replica/dist/. "$OUT/"
if [ -f callback.html ]; then cp callback.html "$OUT/callback.html"; fi

echo "Assembled $OUT"
