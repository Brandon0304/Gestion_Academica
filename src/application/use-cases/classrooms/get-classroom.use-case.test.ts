import { describe, it, expect, beforeEach } from 'vitest'
import { CreateClassroomUseCase } from './create-classroom.use-case.js'
import { GetClassroomUseCase } from './get-classroom.use-case.js'
import { InMemoryClassroomRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-classroom.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('GetClassroomUseCase', () => {
  let repo: InMemoryClassroomRepository
  let getUseCase: GetClassroomUseCase

  beforeEach(() => { repo = new InMemoryClassroomRepository(); getUseCase = new GetClassroomUseCase(repo) })

  it('should return classroom when found', async () => {
    const create = new CreateClassroomUseCase(repo)
    const created = await create.execute({ code: 'A-101', name: 'Aula Magna', capacity: 80 })
    const r = await getUseCase.execute(created.id)
    expect(r.code).toBe('A-101'); expect(r.capacity).toBe(80)
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(getUseCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
