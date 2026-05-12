import { describe, it, expect, beforeEach } from 'vitest'
import { CreateSubjectUseCase } from './create-subject.use-case.js'
import { ListSubjectsUseCase } from './list-subjects.use-case.js'
import { InMemorySubjectRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-subject.repository.js'

describe('ListSubjectsUseCase', () => {
  let repo: InMemorySubjectRepository
  let listUseCase: ListSubjectsUseCase

  beforeEach(async () => {
    repo = new InMemorySubjectRepository()
    listUseCase = new ListSubjectsUseCase(repo)
    const create = new CreateSubjectUseCase(repo)

    for (let i = 0; i < 5; i++) {
      await create.execute({ code: `MAT${i}`, name: `Matemáticas ${i}`, credits: 4 })
    }
  })

  it('should list paginated subjects', async () => {
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
