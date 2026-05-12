import type { UserRepository } from '../../../domain/repositories/user-repository.js'
import { Email } from '../../../domain/value-objects/email.js'
import type { PasswordHasher } from '../../ports/password-hasher.js'
import type { TokenService } from '../../ports/token-service.js'
import { UnauthorizedError } from '../../../shared/errors/index.js'
import type { LoginInput, LoginOutput } from '../../dtos/auth.js'

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const email = new Email(input.email)
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas')
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Cuenta desactivada')
    }

    const passwordValid = await this.passwordHasher.compare(input.password, user.passwordHash)
    if (!passwordValid) {
      throw new UnauthorizedError('Credenciales inválidas')
    }

    const activeUser = user.recordLogin()
    await this.userRepository.update(activeUser)

    const token = this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email.toString(),
      role: user.role,
    })
    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
      email: user.email.toString(),
      role: user.role,
    })

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email.toString(),
        role: user.role,
      },
    }
  }
}
