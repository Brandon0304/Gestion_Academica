import { describe, it, expect, beforeEach } from 'vitest'
import { GetMeUseCase } from './me.use-case.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { User } from '../../../domain/entities/user.js'
import { Email } from '../../../domain/value-objects/email.js'

describe('GetMeUseCase', () => {
  let userRepo: InMemoryUserRepository
  let useCase: GetMeUseCase

  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    useCase = new GetMeUseCase(userRepo)
  })

  it('should return user info', async () => {
    const user = User.create({
      id: 'u-1',
      email: new Email('test@example.com'),
      passwordHash: 'hash',
      role: 'student',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await userRepo.save(user)

    const result = await useCase.execute('u-1')

    expect(result.id).toBe('u-1')
    expect(result.email).toBe('test@example.com')
    expect(result.role).toBe('student')
  })

  it('should throw NotFoundError for non-existent user', async () => {
    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })
})
