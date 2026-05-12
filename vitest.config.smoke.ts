import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/smoke/**/*.test.ts'],
    testTimeout: 15_000,
    env: {
      API_URL: process.env['API_URL'] ?? 'http://localhost:3000',
    },
  },
})
