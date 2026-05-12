import { describe, it, expect, beforeEach } from 'vitest'
import { LoginUseCase } from './login.use-case.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { BcryptPasswordHasher } from '../../../infrastructure/auth/bcrypt-password-hasher.js'
import { JwtTokenService } from '../../../infrastructure/auth/jwt-token.service.js'
import { User } from '../../../domain/entities/user.js'
import { Email } from '../../../domain/value-objects/email.js'
import { UnauthorizedError } from '../../../shared/errors/index.js'

describe('LoginUseCase', () => {
  let repo: InMemoryUserRepository
  let useCase: LoginUseCase

  beforeEach(async () => {
    repo = new InMemoryUserRepository()
    const hasher = new BcryptPasswordHasher()
    const tokenService = new JwtTokenService()
    useCase = new LoginUseCase(repo, hasher, tokenService)

    const hash = await hasher.hash('correct-password')
    const user = User.create({
      id: 'user-1',
      email: new Email('test@example.com'),
      passwordHash: hash,
      role: 'admin',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await repo.save(user)
  })

  it('should login with valid credentials', async () => {
    const result = await useCase.execute({ email: 'test@example.com', password: 'correct-password' })
    expect(result.token).toBeTruthy()
    expect(result.user.email).toBe('test@example.com')
    expect(result.user.role).toBe('admin')
  })

  it('should throw for invalid password', async () => {
    await expect(useCase.execute({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(UnauthorizedError)
  })

  it('should throw for unknown email', async () => {
    await expect(useCase.execute({ email: 'unknown@example.com', password: 'anything' })).rejects.toThrow(UnauthorizedError)
  })

  it('should throw for inactive user', async () => {
    const hasher = new BcryptPasswordHasher()
    const hash = await hasher.hash('pass')
    const user = User.create({
      id: 'inactive-user',
      email: new Email('inactive@example.com'),
      passwordHash: hash,
      role: 'student',
      isActive: false,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await repo.save(user)

    await expect(useCase.execute({ email: 'inactive@example.com', password: 'pass' })).rejects.toThrow(UnauthorizedError)
  })
})
