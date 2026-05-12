import type { Request, Response, NextFunction } from 'express'
import { JwtTokenService } from '../../infrastructure/auth/jwt-token.service.js'
import { UnauthorizedError } from '../../shared/errors/index.js'

const tokenService = new JwtTokenService()

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string; role: string }
}

export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token no proporcionado')
  }

  const token = header.slice(7)
  try {
    const payload = tokenService.verifyToken(token)
    req.user = payload
    next()
  } catch {
    throw new UnauthorizedError('Token inválido o expirado')
  }
}
