import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RegisterStudentUseCase } from './register-student.use-case.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { User } from '../../../domain/entities/user.js'
import { Email } from '../../../domain/value-objects/email.js'

const mockPasswordHasher = {
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn().mockResolvedValue(true),
}

const mockTokenService = {
  generateAccessToken: vi.fn().mockReturnValue('access-token'),
  generateRefreshToken: vi.fn().mockReturnValue('refresh-token'),
  verifyToken: vi.fn().mockReturnValue({ userId: 'u-1', email: 'test@test.com', role: 'student' }),
}

describe('RegisterStudentUseCase', () => {
  let userRepo: InMemoryUserRepository
  let studentRepo: InMemoryStudentRepository
  let useCase: RegisterStudentUseCase

  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    studentRepo = new InMemoryStudentRepository()
    useCase = new RegisterStudentUseCase(userRepo, studentRepo, mockPasswordHasher, mockTokenService)
  })

  it('should register a student and return tokens', async () => {
    const result = await useCase.execute({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      password: 'secure123',
      phone: '+111111111',
    })

    expect(result.token).toBe('access-token')
    expect(result.refreshToken).toBe('refresh-token')
    expect(result.user.email).toBe('juan@example.com')
    expect(result.user.role).toBe('student')
  })

  it('should throw ConflictError for duplicate email', async () => {
    const existing = User.create({
      id: 'u-1',
      email: new Email('juan@example.com'),
      passwordHash: 'hash',
      role: 'student',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await userRepo.save(existing)

    await expect(useCase.execute({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      password: 'secure123',
    })).rejects.toThrow(ConflictError)
  })
})
