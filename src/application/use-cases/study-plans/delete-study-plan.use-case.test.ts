import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteStudyPlanUseCase } from './delete-study-plan.use-case.js'
import { InMemoryStudyPlanRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-study-plan.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { StudyPlan } from '../../../domain/entities/study-plan.js'

describe('DeleteStudyPlanUseCase', () => {
  let repo: InMemoryStudyPlanRepository
  let useCase: DeleteStudyPlanUseCase

  beforeEach(() => { repo = new InMemoryStudyPlanRepository(); useCase = new DeleteStudyPlanUseCase(repo) })

  it('should delete existing study plan', async () => {
    await repo.save(StudyPlan.create({
      id: 'sp-1', name: 'Plan 2024', code: 'PLAN-2024',
      description: null, year: 2024, totalCredits: 200, status: 'active',
      createdAt: new Date(), updatedAt: new Date(),
    }))

    await useCase.execute('sp-1')
    const found = await repo.findById('sp-1')
    expect(found).toBeNull()
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(useCase.execute('sp-999')).rejects.toThrow(NotFoundError)
  })
})
