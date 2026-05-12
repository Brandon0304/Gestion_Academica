import { describe, it, expect, beforeEach } from 'vitest'
import { CreateStudentUseCase } from './create-student.use-case.js'
import { GetStudentUseCase } from './get-student.use-case.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

const mockPasswordHasher = {
  hash: async (p: string) => p,
  compare: async (p: string, h: string) => p === h,
}

describe('GetStudentUseCase', () => {
  let repo: InMemoryStudentRepository
  let getUseCase: GetStudentUseCase
  let createUseCase: CreateStudentUseCase

  beforeEach(() => {
    repo = new InMemoryStudentRepository()
    getUseCase = new GetStudentUseCase(repo)
    createUseCase = new CreateStudentUseCase(repo, new InMemoryUserRepository(), mockPasswordHasher)
  })

  it('should return student when found', async () => {
    const created = await createUseCase.execute({ firstName: 'Ana', lastName: 'López', email: 'ana@example.com', documentId: 'DNI99999' })
    const result = await getUseCase.execute(created.id)
    expect(result.firstName).toBe('Ana')
    expect(result.email).toBe('ana@example.com')
  })

  it('should throw NotFoundError for non-existent id', async () => {
    await expect(getUseCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })
})
