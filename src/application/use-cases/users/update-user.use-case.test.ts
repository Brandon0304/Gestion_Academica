import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateUserUseCase } from './update-user.use-case.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { User } from '../../../domain/entities/user.js'
import { Email } from '../../../domain/value-objects/email.js'

describe('UpdateUserUseCase', () => {
  let repo: InMemoryUserRepository
  let useCase: UpdateUserUseCase

  beforeEach(() => { repo = new InMemoryUserRepository(); useCase = new UpdateUserUseCase(repo) })

  it('should update user role and isActive', async () => {
    await repo.save(User.create({
      id: 'u-1', email: new Email('user1@test.com'), passwordHash: 'hash',
      role: 'admin', isActive: true, lastLogin: null,
      createdAt: new Date(), updatedAt: new Date(),
    }))

    const result = await useCase.execute('u-1', { role: 'teacher', isActive: false })
    expect(result.role).toBe('teacher')
    expect(result.isActive).toBe(false)
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(useCase.execute('u-999', { role: 'teacher' })).rejects.toThrow(NotFoundError)
  })
})
