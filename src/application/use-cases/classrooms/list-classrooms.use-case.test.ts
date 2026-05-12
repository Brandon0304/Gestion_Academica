import { describe, it, expect, beforeEach } from 'vitest'
import { CreateClassroomUseCase } from './create-classroom.use-case.js'
import { ListClassroomsUseCase } from './list-classrooms.use-case.js'
import { InMemoryClassroomRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-classroom.repository.js'

describe('ListClassroomsUseCase', () => {
  let repo: InMemoryClassroomRepository
  let listUseCase: ListClassroomsUseCase

  beforeEach(async () => {
    repo = new InMemoryClassroomRepository()
    listUseCase = new ListClassroomsUseCase(repo)
    const create = new CreateClassroomUseCase(repo)

    for (let i = 0; i < 5; i++) {
      await create.execute({ code: `A-${101 + i}`, name: `Aula ${i + 1}`, capacity: 40 })
    }
  })

  it('should list paginated classrooms', async () => {
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
