import { describe, it, expect, beforeEach } from 'vitest'
import { CreateClassroomUseCase } from './create-classroom.use-case.js'
import { DeleteClassroomUseCase } from './delete-classroom.use-case.js'
import { InMemoryClassroomRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-classroom.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('DeleteClassroomUseCase', () => {
  let repo: InMemoryClassroomRepository
  let deleteUseCase: DeleteClassroomUseCase

  beforeEach(() => { repo = new InMemoryClassroomRepository(); deleteUseCase = new DeleteClassroomUseCase(repo) })

  it('should delete existing classroom', async () => {
    const create = new CreateClassroomUseCase(repo)
    const created = await create.execute({ code: 'A-101', name: 'Aula Magna', capacity: 80 })
    await expect(deleteUseCase.execute(created.id)).resolves.toBeUndefined()
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(deleteUseCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
