import type { TokenService } from '../../ports/token-service.js'
import type { RefreshTokenOutput } from '../../dtos/auth.js'

export class RefreshTokenUseCase {
  constructor(private readonly tokenService: TokenService) {}

  async execute(input: { refreshToken: string }): Promise<RefreshTokenOutput> {
    const payload = this.tokenService.verifyToken(input.refreshToken)

    const token = this.tokenService.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    })

    return {
      token,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    }
  }
}
