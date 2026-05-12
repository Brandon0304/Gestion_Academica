import { describe, it, expect, beforeEach } from 'vitest'
import { CreateStudentUseCase } from './create-student.use-case.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { ConflictError } from '../../../shared/errors/index.js'

const mockPasswordHasher = {
  hash: async (p: string) => p,
  compare: async (p: string, h: string) => p === h,
}

describe('CreateStudentUseCase', () => {
  let repo: InMemoryStudentRepository
  let useCase: CreateStudentUseCase

  beforeEach(() => {
    repo = new InMemoryStudentRepository()
    useCase = new CreateStudentUseCase(repo, new InMemoryUserRepository(), mockPasswordHasher)
  })

  it('should create student', async () => {
    const result = await useCase.execute({
      firstName: 'Ana',
      lastName: 'López',
      email: 'ana@example.com',
      documentId: 'DNI99999',
    })
    expect(result.firstName).toBe('Ana')
    expect(result.email).toBe('ana@example.com')
    expect(result.status).toBe('active')
    expect(result.id).toBeTruthy()
  })

  it('should throw for duplicate email', async () => {
    await useCase.execute({ firstName: 'A', lastName: 'B', email: 'dup@example.com', documentId: 'DOC-12345' })
    await expect(
      useCase.execute({ firstName: 'C', lastName: 'D', email: 'dup@example.com', documentId: 'DOC-67890' }),
    ).rejects.toThrow(ConflictError)
  })

  it('should throw for duplicate document', async () => {
    await useCase.execute({ firstName: 'A', lastName: 'B', email: 'a@example.com', documentId: 'DOC-12345' })
    await expect(
      useCase.execute({ firstName: 'C', lastName: 'D', email: 'b@example.com', documentId: 'DOC-12345' }),
    ).rejects.toThrow(ConflictError)
  })
})
