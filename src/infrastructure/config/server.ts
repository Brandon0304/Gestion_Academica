import { createApp } from './app.js'
import { env } from './env.js'
import { logger } from '../logging/logger.js'
import { prisma } from '../persistence/prisma-client.js'

const app = createApp()

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started')
})

function gracefulShutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received')
  server.close(async () => {
    await prisma.$disconnect()
    logger.info('Server shut down gracefully')
    process.exit(0)
  })
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10_000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
