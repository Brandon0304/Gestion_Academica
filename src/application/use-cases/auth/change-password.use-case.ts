import type { UserRepository } from '../../../domain/repositories/user-repository.js'
import type { PasswordHasher } from '../../ports/password-hasher.js'
import { NotFoundError, UnauthorizedError } from '../../../shared/errors/index.js'

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(userId: string, input: { currentPassword: string; newPassword: string }): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('Usuario')
    }

    const valid = await this.passwordHasher.compare(input.currentPassword, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedError('Contraseña actual incorrecta')
    }

    const newHash = await this.passwordHasher.hash(input.newPassword)
    const updated = user.changePassword(newHash)
    await this.userRepository.update(updated)
  }
}
