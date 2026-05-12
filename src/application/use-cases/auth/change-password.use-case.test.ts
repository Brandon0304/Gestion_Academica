import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ChangePasswordUseCase } from './change-password.use-case.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { NotFoundError, UnauthorizedError } from '../../../shared/errors/index.js'
import { User } from '../../../domain/entities/user.js'
import { Email } from '../../../domain/value-objects/email.js'

const mockPasswordHasher = {
  hash: vi.fn().mockResolvedValue('new-hashed-password'),
  compare: vi.fn().mockResolvedValue(true),
}

describe('ChangePasswordUseCase', () => {
  let userRepo: InMemoryUserRepository
  let useCase: ChangePasswordUseCase

  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    mockPasswordHasher.compare.mockResolvedValue(true)
    useCase = new ChangePasswordUseCase(userRepo, mockPasswordHasher)
  })

  it('should change password when current password is correct', async () => {
    const user = User.create({
      id: 'u-1',
      email: new Email('test@example.com'),
      passwordHash: 'old-hash',
      role: 'admin',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await userRepo.save(user)

    await useCase.execute('u-1', { currentPassword: 'old-pass', newPassword: 'new-pass' })

    expect(mockPasswordHasher.compare).toHaveBeenCalledWith('old-pass', 'old-hash')
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('new-pass')
    const updated = await userRepo.findById('u-1')
    expect(updated?.passwordHash).toBe('new-hashed-password')
  })

  it('should throw NotFoundError for non-existent user', async () => {
    await expect(useCase.execute('nonexistent', { currentPassword: 'x', newPassword: 'y' })).rejects.toThrow(NotFoundError)
  })

  it('should throw UnauthorizedError when current password is wrong', async () => {
    mockPasswordHasher.compare.mockResolvedValue(false)

    const user = User.create({
      id: 'u-1',
      email: new Email('test@example.com'),
      passwordHash: 'hash',
      role: 'admin',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await userRepo.save(user)

    await expect(useCase.execute('u-1', { currentPassword: 'wrong', newPassword: 'new' })).rejects.toThrow(UnauthorizedError)
  })
})
