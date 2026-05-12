#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo "  E2E Tests — G_ACADEMICA"
echo "========================================"

echo "Waiting for backend to be ready..."
for i in $(seq 1 30); do
  if wget -qO- http://backend-test:3000/health > /dev/null 2>&1; then
    echo "Backend is ready!"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "ERROR: Backend not available after 30s"
    exit 1
  fi
  sleep 2
done

echo "Running E2E tests..."
npx vitest run --config vitest.config.e2e.ts
