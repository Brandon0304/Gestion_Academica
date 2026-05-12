import { describe, it, expect, beforeEach } from 'vitest'
import { CreateStudyPlanUseCase } from './create-study-plan.use-case.js'
import { ListStudyPlansUseCase } from './list-study-plans.use-case.js'
import { InMemoryStudyPlanRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-study-plan.repository.js'

describe('ListStudyPlansUseCase', () => {
  let repo: InMemoryStudyPlanRepository
  let createUseCase: CreateStudyPlanUseCase
  let listUseCase: ListStudyPlansUseCase

  beforeEach(() => {
    repo = new InMemoryStudyPlanRepository()
    createUseCase = new CreateStudyPlanUseCase(repo)
    listUseCase = new ListStudyPlansUseCase(repo)
  })

  it('should return empty list when no plans exist', async () => {
    const result = await listUseCase.execute(1, 20)
    expect(result.data).toHaveLength(0)
    expect(result.pagination.total).toBe(0)
  })

  it('should return paginated list', async () => {
    await createUseCase.execute({ name: 'Plan A', code: 'A-001', year: 2024, totalCredits: 100 })
    await createUseCase.execute({ name: 'Plan B', code: 'B-001', year: 2025, totalCredits: 120 })

    const result = await listUseCase.execute(1, 20)
    expect(result.data).toHaveLength(2)
    expect(result.pagination.total).toBe(2)
    expect(result.pagination.totalPages).toBe(1)
  })
})
