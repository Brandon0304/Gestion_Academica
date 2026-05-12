import type { UserRepository } from '../../../domain/repositories/user-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateUserInput, UserOutput } from '../../dtos/user.js'
import type { UserRole } from '../../../domain/entities/user.js'

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, input: UpdateUserInput): Promise<UserOutput> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundError('Usuario')
    }

    const updated = user.updateInfo({
      role: input.role as UserRole | undefined,
      isActive: input.isActive,
    })

    await this.userRepository.update(updated)

    return {
      id: updated.id,
      email: updated.email.toString(),
      role: updated.role,
      isActive: updated.isActive,
      lastLogin: updated.lastLogin?.toISOString() ?? null,
      createdAt: updated.createdAt.toISOString(),
    }
  }
}
