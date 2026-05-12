#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3000}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================"
echo "  Smoke Tests — G_ACADEMICA"
echo "  API URL: $API_URL"
echo "========================================"

# Wait for API to be healthy
echo "Waiting for API to be ready..."
for i in $(seq 1 30); do
  if curl -sf "$API_URL/health" > /dev/null 2>&1; then
    echo "API is ready!"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "ERROR: API not available after 30s"
    exit 1
  fi
  sleep 2
done

# Run the smoke tests
API_URL="$API_URL" npx vitest run --config "$PROJECT_DIR/vitest.config.smoke.ts"
