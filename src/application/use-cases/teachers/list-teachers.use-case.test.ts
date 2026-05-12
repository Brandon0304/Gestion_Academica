import { describe, it, expect, beforeEach } from 'vitest'
import { CreateTeacherUseCase } from './create-teacher.use-case.js'
import { ListTeachersUseCase } from './list-teachers.use-case.js'
import { InMemoryTeacherRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-teacher.repository.js'

describe('ListTeachersUseCase', () => {
  let repo: InMemoryTeacherRepository
  let listUseCase: ListTeachersUseCase

  beforeEach(async () => {
    repo = new InMemoryTeacherRepository()
    listUseCase = new ListTeachersUseCase(repo)
    const create = new CreateTeacherUseCase(repo)

    for (let i = 0; i < 5; i++) {
      await create.execute({ firstName: `T${i}`, lastName: 'Test', email: `t${i}@test.com`, documentId: `DOC-${i}000` })
    }
  })

  it('should list paginated teachers', async () => {
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
