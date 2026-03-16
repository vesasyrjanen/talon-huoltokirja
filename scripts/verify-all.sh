#!/usr/bin/env bash
set -e

PORT=4010

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

RESULT=$?

echo
echo "Stopping server..."
kill $SERVER_PID

if [ $RESULT -eq 0 ]; then
  echo
  echo "=============================="
  echo "SMOKE TEST PASSED"
  echo "=============================="
else
  echo
  echo "=============================="
  echo "SMOKE TEST FAILED"
  echo "=============================="
fi

exit $RESULT
