import { describe, it, expect, beforeEach } from 'vitest'
import { CreateSubjectUseCase } from './create-subject.use-case.js'
import { UpdateSubjectUseCase } from './update-subject.use-case.js'
import { InMemorySubjectRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-subject.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('UpdateSubjectUseCase', () => {
  let repo: InMemorySubjectRepository
  let updateUseCase: UpdateSubjectUseCase

  beforeEach(() => { repo = new InMemorySubjectRepository(); updateUseCase = new UpdateSubjectUseCase(repo) })

  it('should update subject fields', async () => {
    const create = new CreateSubjectUseCase(repo)
    const created = await create.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4 })
    const r = await updateUseCase.execute(created.id, { name: 'Matemáticas II', credits: 5 })
    expect(r.name).toBe('Matemáticas II'); expect(r.credits).toBe(5)
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(updateUseCase.execute('non-existent', { name: 'Test' })).rejects.toThrow(NotFoundError)
  })
})
