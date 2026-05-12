import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.integration.test.ts', 'src/**/*.integration.spec.ts'],
    testTimeout: 30_000,
    hookTimeout: 15_000,
    env: {
      DATABASE_URL: process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5433/g_academica_test',
      JWT_SECRET: 'test-secret-for-integration',
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
    },
  },
})
