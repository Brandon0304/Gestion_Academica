import type { UserRepository } from '../../../domain/repositories/user-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<{ id: string; email: string; role: string }> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('Usuario')
    }
    return {
      id: user.id,
      email: user.email.toString(),
      role: user.role,
    }
  }
}
