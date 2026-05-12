import { describe, it, expect, beforeEach } from 'vitest'
import { GetStudyPlanUseCase } from './get-study-plan.use-case.js'
import { InMemoryStudyPlanRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-study-plan.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { StudyPlan } from '../../../domain/entities/study-plan.js'

describe('GetStudyPlanUseCase', () => {
  let repo: InMemoryStudyPlanRepository
  let useCase: GetStudyPlanUseCase

  beforeEach(() => { repo = new InMemoryStudyPlanRepository(); useCase = new GetStudyPlanUseCase(repo) })

  it('should return study plan when found', async () => {
    await repo.save(StudyPlan.create({
      id: 'sp-1', name: 'Plan 2024', code: 'PLAN-2024',
      description: null, year: 2024, totalCredits: 200, status: 'active',
      createdAt: new Date(), updatedAt: new Date(),
    }))

    const result = await useCase.execute('sp-1')
    expect(result.name).toBe('Plan 2024')
    expect(result.code).toBe('PLAN-2024')
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(useCase.execute('sp-999')).rejects.toThrow(NotFoundError)
  })
})
