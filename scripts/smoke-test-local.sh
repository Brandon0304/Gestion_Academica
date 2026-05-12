#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3000}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================"
echo "  Smoke Tests (local) — G_ACADEMICA"
echo "========================================"

# Kill any existing dev server on the port
PORT="$(echo "$API_URL" | grep -oP ':\K\d+')"
kill "$(lsof -ti:"$PORT")" 2>/dev/null || true
sleep 1

# Start fresh dev server
echo "Starting dev server on port $PORT..."
nohup npx tsx --env-file=.env "$PROJECT_DIR/src/infrastructure/config/server.ts" > /tmp/server.log 2>&1 &
SERVER_PID=$!
disown

# Wait for server to be healthy
echo "Waiting for API to be ready..."
for i in $(seq 1 15); do
  if curl -sf "$API_URL/health" > /dev/null 2>&1; then
    echo "API is ready!"
    break
  fi
  if [ "$i" -eq 15 ]; then
    echo "ERROR: API not available after 15s"
    kill "$SERVER_PID" 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

# Run the smoke tests
API_URL="$API_URL" npx vitest run --config "$PROJECT_DIR/vitest.config.smoke.ts"
TEST_EXIT=$?

# Kill the dev server
echo "Stopping dev server..."
kill "$SERVER_PID" 2>/dev/null || true

exit $TEST_EXIT
