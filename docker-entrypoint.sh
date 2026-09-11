#!/bin/sh
set -eu

echo "[meridian] applying migrations…"
node scripts/apply-config.mjs node scripts/migrate.mjs

echo "[meridian] starting"
exec node scripts/apply-config.mjs node .output/server/index.mjs
