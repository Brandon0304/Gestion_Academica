import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { env } from './env.js'
import { swaggerSpec } from './swagger.js'
import { prisma } from '../persistence/prisma-client.js'
import { errorHandler } from '../../presentation/middleware/error-handler.middleware.js'
import { requestIdMiddleware } from '../../presentation/middleware/request-id.middleware.js'
import { apiRoutes } from '../../presentation/routes/index.js'

export function createApp() {
  const app = express()

  // Request ID
  app.use(requestIdMiddleware)

  // Security headers
  app.use(helmet())

  // CORS
  const allowedOrigins = env.CORS_ORIGINS.split(',').map((s) => s.trim())
  app.use(cors({
    origin: env.NODE_ENV === 'development' ? allowedOrigins : allowedOrigins,
    credentials: true,
  }))

  // Global rate limiting
  const limiter = rateLimit({
    windowMs: 60_000,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes, intente de nuevo en un minuto' },
  })
  app.use(limiter)

  app.use(express.json())

  // Swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'G_ACADEMICA API Docs',
  }))

  // Health check with DB connectivity
  app.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() })
    } catch {
      res.status(503).json({ status: 'error', db: 'disconnected', timestamp: new Date().toISOString() })
    }
  })

  // API routes
  app.use('/api/v1', apiRoutes)

  app.use(errorHandler)

  return app
}
