import { describe, it, expect, beforeEach } from 'vitest'
import { CreateClassroomUseCase } from './create-classroom.use-case.js'
import { UpdateClassroomUseCase } from './update-classroom.use-case.js'
import { InMemoryClassroomRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-classroom.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('UpdateClassroomUseCase', () => {
  let repo: InMemoryClassroomRepository
  let updateUseCase: UpdateClassroomUseCase

  beforeEach(() => { repo = new InMemoryClassroomRepository(); updateUseCase = new UpdateClassroomUseCase(repo) })

  it('should update classroom fields', async () => {
    const create = new CreateClassroomUseCase(repo)
    const created = await create.execute({ code: 'A-101', name: 'Aula Magna', capacity: 80 })
    const r = await updateUseCase.execute(created.id, { name: 'Lab Computación', capacity: 30, type: 'theory' })
    expect(r.name).toBe('Lab Computación'); expect(r.capacity).toBe(30); expect(r.type).toBe('theory')
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(updateUseCase.execute('non-existent', { name: 'Test' })).rejects.toThrow(NotFoundError)
  })
})
