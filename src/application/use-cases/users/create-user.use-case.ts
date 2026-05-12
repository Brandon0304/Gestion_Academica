import type { UserRepository } from '../../../domain/repositories/user-repository.js'
import type { PasswordHasher } from '../../ports/password-hasher.js'
import { User } from '../../../domain/entities/user.js'
import { Email } from '../../../domain/value-objects/email.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { v4 as uuid } from 'uuid'
import type { CreateUserInput, UserOutput } from '../../dtos/user.js'

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    const email = new Email(input.email)

    const existing = await this.userRepository.findByEmail(email)
    if (existing) throw new ConflictError('El email ya está registrado')

    const passwordHash = await this.passwordHasher.hash(input.password)

    const user = User.create({
      id: uuid(),
      email,
      passwordHash,
      role: input.role,
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.userRepository.save(user)

    return {
      id: user.id,
      email: user.email.toString(),
      role: user.role,
      isActive: user.isActive,
      lastLogin: null,
      createdAt: user.createdAt.toISOString(),
    }
  }
}
