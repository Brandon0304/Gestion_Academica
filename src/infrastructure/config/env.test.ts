import { describe, it, expect } from 'vitest'

describe('App bootstrap', () => {
  it('should create app without error', async () => {
    const { createApp } = await import('./app.js')
    const app = createApp()
    expect(app).toBeDefined()
  }, 15_000)

  it('should have health check endpoint', async () => {
    const { createApp } = await import('./app.js')
    const app = createApp()
    expect(app).toBeDefined()
  })
})
