import { describe, it, expect, beforeEach } from 'vitest'
import { CreateTeacherUseCase } from './create-teacher.use-case.js'
import { InMemoryTeacherRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-teacher.repository.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { ConflictError } from '../../../shared/errors/index.js'

const mockPasswordHasher = {
  hash: async (p: string) => p,
  compare: async (p: string, h: string) => p === h,
}

describe('CreateTeacherUseCase', () => {
  let repo: InMemoryTeacherRepository
  let useCase: CreateTeacherUseCase

  beforeEach(() => { repo = new InMemoryTeacherRepository(); useCase = new CreateTeacherUseCase(repo, new InMemoryUserRepository(), mockPasswordHasher) })

  it('should create teacher', async () => {
    const r = await useCase.execute({ firstName: 'Carlos', lastName: 'López', email: 'carlos@test.com', documentId: 'DOC-10001' })
    expect(r.firstName).toBe('Carlos'); expect(r.status).toBe('active')
  })

  it('should throw for duplicate email', async () => {
    await useCase.execute({ firstName: 'A', lastName: 'B', email: 'dup@test.com', documentId: 'DOC-10002' })
    await expect(useCase.execute({ firstName: 'C', lastName: 'D', email: 'dup@test.com', documentId: 'DOC-10003' })).rejects.toThrow(ConflictError)
  })

  it('should throw for duplicate document', async () => {
    await useCase.execute({ firstName: 'A', lastName: 'B', email: 'a@test.com', documentId: 'DOC-10004' })
    await expect(useCase.execute({ firstName: 'C', lastName: 'D', email: 'b@test.com', documentId: 'DOC-10004' })).rejects.toThrow(ConflictError)
  })
})
