import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateGradeUseCase } from './update-grade.use-case.js'
import { InMemoryGradeRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-grade.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { Grade } from '../../../domain/entities/grade.js'

describe('UpdateGradeUseCase', () => {
  let repo: InMemoryGradeRepository
  let useCase: UpdateGradeUseCase

  beforeEach(() => { repo = new InMemoryGradeRepository(); useCase = new UpdateGradeUseCase(repo) })

  it('should update grade value', async () => {
    await repo.save(Grade.create({
      id: 'g-1', enrollmentId: 'e-1', evaluationType: 'exam', value: 10, percentage: 100, maxValue: 20,
      observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    }))

    const result = await useCase.execute('g-1', { value: 18 })
    expect(result.value).toBe(18)
  })

  it('should throw NotFoundError for non-existent grade', async () => {
    await expect(useCase.execute('g-999', { value: 15 })).rejects.toThrow(NotFoundError)
  })
})
