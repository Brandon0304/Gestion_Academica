import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { TokenService, TokenPayload } from '../../application/ports/token-service.js'

export class JwtTokenService implements TokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as `${number}h` })
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as `${number}d` })
  }

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload
  }
}
