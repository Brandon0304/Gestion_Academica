import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/e2e/**/*.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 15_000,
    env: {
      DATABASE_URL: process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5433/g_academica_test',
      JWT_SECRET: 'test-secret-for-e2e',
      NODE_ENV: 'test',
      RATE_LIMIT_MAX: '10000',
      LOG_LEVEL: 'error',
    },
  },
})
