import { describe, it, expect, beforeEach } from 'vitest'
import { CreateSubjectUseCase } from './create-subject.use-case.js'
import { GetSubjectUseCase } from './get-subject.use-case.js'
import { InMemorySubjectRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-subject.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('GetSubjectUseCase', () => {
  let repo: InMemorySubjectRepository
  let getUseCase: GetSubjectUseCase

  beforeEach(() => { repo = new InMemorySubjectRepository(); getUseCase = new GetSubjectUseCase(repo) })

  it('should return subject when found', async () => {
    const create = new CreateSubjectUseCase(repo)
    const created = await create.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4 })
    const r = await getUseCase.execute(created.id)
    expect(r.code).toBe('MAT101'); expect(r.credits).toBe(4)
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(getUseCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
