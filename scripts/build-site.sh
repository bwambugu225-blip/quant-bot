#!/usr/bin/env bash
# Assembles the Vercel output: bot.html at the root ("/") and the
# React rebuild under "/deriv/". Run by Vercel via vercel.json buildCommand.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public_out"

cd "$ROOT/deriv-replica"
npm install
npm run build

cd "$ROOT"
rm -rf "$OUT"
mkdir -p "$OUT/deriv"

cp bot.html "$OUT/bot.html"
if [ -f callback.html ]; then cp callback.html "$OUT/callback.html"; fi
cp -r deriv-replica/dist/. "$OUT/deriv/"

echo "Assembled $OUT"
