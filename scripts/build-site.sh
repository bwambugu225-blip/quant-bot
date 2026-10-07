#!/usr/bin/env bash
# Assembles the Vercel output: the React rebuild at the root ("/") and the
# original bot.html kept at "/bot.html". Run by Vercel via vercel.json buildCommand.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public_out"

cd "$ROOT/deriv-replica"
npm install
npm run build

cd "$ROOT"
rm -rf "$OUT"
mkdir -p "$OUT"

cp -r deriv-replica/dist/. "$OUT/"
cp bot.html "$OUT/bot.html"
if [ -f callback.html ]; then cp callback.html "$OUT/callback.html"; fi

echo "Assembled $OUT"
