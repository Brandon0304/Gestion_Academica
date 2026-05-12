import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteGradeUseCase } from './delete-grade.use-case.js'
import { InMemoryGradeRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-grade.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { Grade } from '../../../domain/entities/grade.js'

describe('DeleteGradeUseCase', () => {
  let repo: InMemoryGradeRepository
  let useCase: DeleteGradeUseCase

  beforeEach(() => { repo = new InMemoryGradeRepository(); useCase = new DeleteGradeUseCase(repo) })

  it('should delete existing grade', async () => {
    await repo.save(Grade.create({
      id: 'g-1', enrollmentId: 'e-1', evaluationType: 'exam', value: 16, percentage: 100, maxValue: 20,
      observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    }))

    await useCase.execute('g-1')
    const found = await repo.findById('g-1')
    expect(found).toBeNull()
  })

  it('should throw NotFoundError for non-existent grade', async () => {
    await expect(useCase.execute('g-999')).rejects.toThrow(NotFoundError)
  })
})
