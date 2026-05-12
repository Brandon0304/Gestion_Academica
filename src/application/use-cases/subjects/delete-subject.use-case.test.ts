import { describe, it, expect, beforeEach } from 'vitest'
import { CreateSubjectUseCase } from './create-subject.use-case.js'
import { DeleteSubjectUseCase } from './delete-subject.use-case.js'
import { InMemorySubjectRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-subject.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('DeleteSubjectUseCase', () => {
  let repo: InMemorySubjectRepository
  let deleteUseCase: DeleteSubjectUseCase

  beforeEach(() => { repo = new InMemorySubjectRepository(); deleteUseCase = new DeleteSubjectUseCase(repo) })

  it('should delete existing subject', async () => {
    const create = new CreateSubjectUseCase(repo)
    const created = await create.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4 })
    await expect(deleteUseCase.execute(created.id)).resolves.toBeUndefined()
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(deleteUseCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
