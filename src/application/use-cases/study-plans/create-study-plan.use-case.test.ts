import { describe, it, expect, beforeEach } from 'vitest'
import { CreateStudyPlanUseCase } from './create-study-plan.use-case.js'
import { InMemoryStudyPlanRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-study-plan.repository.js'
import { ConflictError } from '../../../shared/errors/index.js'

describe('CreateStudyPlanUseCase', () => {
  let repo: InMemoryStudyPlanRepository
  let useCase: CreateStudyPlanUseCase

  beforeEach(() => {
    repo = new InMemoryStudyPlanRepository()
    useCase = new CreateStudyPlanUseCase(repo)
  })

  it('should create a study plan', async () => {
    const result = await useCase.execute({
      name: 'Ingeniería',
      code: 'ING-2024',
      year: 2024,
      totalCredits: 200,
    })
    expect(result.name).toBe('Ingeniería')
    expect(result.code).toBe('ING-2024')
    expect(result.status).toBe('draft')
    expect(result.id).toBeTruthy()
  })

  it('should throw for duplicate code', async () => {
    await useCase.execute({ name: 'A', code: 'DUP', year: 2024, totalCredits: 100 })
    await expect(
      useCase.execute({ name: 'B', code: 'DUP', year: 2025, totalCredits: 120 }),
    ).rejects.toThrow(ConflictError)
  })

  it('should create with optional description', async () => {
    const result = await useCase.execute({
      name: 'Plan de Prueba', code: 'TEST-01', year: 2025, totalCredits: 180, description: 'Plan de prueba',
    })
    expect(result.description).toBe('Plan de prueba')
  })
})
