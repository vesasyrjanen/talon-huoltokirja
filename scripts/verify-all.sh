#!/usr/bin/env bash
set -euo pipefail

PORT=4010
SERVER_PID=""

cleanup() {
  if [ -n "${SERVER_PID:-}" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    echo
    echo "Stopping server..."
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT

echo
echo "==> Build"
npm run build

echo
echo "==> Starting Next.js server"
PORT=$PORT npm start > /tmp/next-start.log 2>&1 &
SERVER_PID=$!

echo "Waiting for server..."
npx wait-on http://localhost:$PORT

echo
echo "==> Running smoke tests"
APP_URL=http://localhost:$PORT \
HOUSE_ID=${HOUSE_ID:-""} \
SYSTEM_ID=${SYSTEM_ID:-""} \
ITEM_ID=${ITEM_ID:-""} \
node scripts/route-smoke.mjs

echo
echo "=============================="
echo "SMOKE TEST PASSED"
echo "=============================="
