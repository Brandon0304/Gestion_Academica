import { describe, it, expect, beforeEach } from 'vitest'
import { ListUsersUseCase } from './list-users.use-case.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { User } from '../../../domain/entities/user.js'
import { Email } from '../../../domain/value-objects/email.js'

describe('ListUsersUseCase', () => {
  let repo: InMemoryUserRepository
  let useCase: ListUsersUseCase

  beforeEach(() => { repo = new InMemoryUserRepository(); useCase = new ListUsersUseCase(repo) })

  it('should list paginated users', async () => {
    await repo.save(User.create({
      id: 'u-1', email: new Email('user1@test.com'), passwordHash: 'hash1',
      role: 'admin', isActive: true, lastLogin: null,
      createdAt: new Date(), updatedAt: new Date(),
    }))
    await repo.save(User.create({
      id: 'u-2', email: new Email('user2@test.com'), passwordHash: 'hash2',
      role: 'teacher', isActive: true, lastLogin: null,
      createdAt: new Date(), updatedAt: new Date(),
    }))

    const result = await useCase.execute(1, 20)
    expect(result.data).toHaveLength(2)
    expect(result.pagination.total).toBe(2)
    expect(result.pagination.totalPages).toBe(1)
  })

  it('should return empty for page beyond total', async () => {
    await repo.save(User.create({
      id: 'u-1', email: new Email('user1@test.com'), passwordHash: 'hash',
      role: 'admin', isActive: true, lastLogin: null,
      createdAt: new Date(), updatedAt: new Date(),
    }))

    const result = await useCase.execute(2, 20)
    expect(result.data).toHaveLength(0)
    expect(result.pagination.total).toBe(1)
  })
})
