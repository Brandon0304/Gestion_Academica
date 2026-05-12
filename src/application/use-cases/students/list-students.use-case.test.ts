import { describe, it, expect, beforeEach } from 'vitest'
import { CreateStudentUseCase } from './create-student.use-case.js'
import { ListStudentsUseCase } from './list-students.use-case.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'

const mockPasswordHasher = {
  hash: async (p: string) => p,
  compare: async (p: string, h: string) => p === h,
}

describe('ListStudentsUseCase', () => {
  let repo: InMemoryStudentRepository
  let listUseCase: ListStudentsUseCase

  beforeEach(async () => {
    repo = new InMemoryStudentRepository()
    listUseCase = new ListStudentsUseCase(repo)
    const create = new CreateStudentUseCase(repo, new InMemoryUserRepository(), mockPasswordHasher)

    for (let i = 0; i < 5; i++) {
      await create.execute({ firstName: `S${i}`, lastName: 'Test', email: `s${i}@test.com`, documentId: `DOC-${i}000` })
    }
  })

  it('should list paginated students', async () => {
    const result = await listUseCase.execute(1, 2)
    expect(result.data).toHaveLength(2)
    expect(result.pagination.total).toBe(5)
    expect(result.pagination.totalPages).toBe(3)
  })

  it('should return empty for page beyond total', async () => {
    const result = await listUseCase.execute(10, 20)
    expect(result.data).toHaveLength(0)
    expect(result.pagination.total).toBe(5)
  })
})
