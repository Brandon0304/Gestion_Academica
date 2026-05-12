import { describe, it, expect, beforeEach } from 'vitest'
import { CreateSubjectUseCase } from './create-subject.use-case.js'
import { InMemorySubjectRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-subject.repository.js'
import { ConflictError } from '../../../shared/errors/index.js'

describe('CreateSubjectUseCase', () => {
  let repo: InMemorySubjectRepository
  let useCase: CreateSubjectUseCase

  beforeEach(() => { repo = new InMemorySubjectRepository(); useCase = new CreateSubjectUseCase(repo) })

  it('should create subject', async () => {
    const r = await useCase.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4 })
    expect(r.code).toBe('MAT101'); expect(r.credits).toBe(4)
  })

  it('should throw for duplicate code', async () => {
    await useCase.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4 })
    await expect(useCase.execute({ code: 'MAT101', name: 'Matemáticas II', credits: 4 })).rejects.toThrow(ConflictError)
  })
})
