import type { Request, Response, NextFunction } from 'express'
import { LoginUseCase, GetMeUseCase, RegisterStudentUseCase, ChangePasswordUseCase, RefreshTokenUseCase } from '../../application/use-cases/auth/index.js'
import { JwtTokenService } from '../../infrastructure/auth/jwt-token.service.js'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly tokenService: JwtTokenService,
    private readonly registerStudentUseCase: RegisterStudentUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body
      const result = await this.loginUseCase.execute({ email, password })
      res.status(200).json({
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
      })
    } catch (err) {
      next(err)
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.getMeUseCase.execute(req.user!.userId)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.registerStudentUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.changePasswordUseCase.execute(req.user!.userId, req.body)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.refreshTokenUseCase.execute(req.body)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}
