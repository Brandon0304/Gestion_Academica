import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateStudyPlanUseCase } from './update-study-plan.use-case.js'
import { InMemoryStudyPlanRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-study-plan.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { StudyPlan } from '../../../domain/entities/study-plan.js'

describe('UpdateStudyPlanUseCase', () => {
  let repo: InMemoryStudyPlanRepository
  let useCase: UpdateStudyPlanUseCase

  beforeEach(() => { repo = new InMemoryStudyPlanRepository(); useCase = new UpdateStudyPlanUseCase(repo) })

  it('should update name and totalCredits', async () => {
    await repo.save(StudyPlan.create({
      id: 'sp-1', name: 'Plan 2024', code: 'PLAN-2024',
      description: null, year: 2024, totalCredits: 200, status: 'active',
      createdAt: new Date(), updatedAt: new Date(),
    }))

    const result = await useCase.execute('sp-1', { name: 'Plan 2025', totalCredits: 250 })
    expect(result.name).toBe('Plan 2025')
    expect(result.totalCredits).toBe(250)
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(useCase.execute('sp-999', { name: 'Nuevo' })).rejects.toThrow(NotFoundError)
  })
})
