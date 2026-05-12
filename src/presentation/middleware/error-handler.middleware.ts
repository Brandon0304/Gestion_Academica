import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../../shared/errors/index.js'
import { logger } from '../../infrastructure/logging/logger.js'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const requestId = req.requestId ?? 'unknown'

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
      },
    })
    return
  }

  logger.error({ err, requestId }, 'Unexpected error')
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
      requestId,
    },
  })
}
