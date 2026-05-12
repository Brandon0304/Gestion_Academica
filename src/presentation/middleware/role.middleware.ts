import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from './auth.middleware.js'
import { ForbiddenError } from '../../shared/errors/index.js'

export function roleMiddleware(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('No autenticado')
    }
    if (!allowedRoles.includes(req.user.role) && !allowedRoles.includes('*')) {
      throw new ForbiddenError('Rol sin permisos suficientes')
    }
    next()
  }
}
