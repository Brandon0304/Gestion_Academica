import { describe, it, expect, beforeEach } from 'vitest'
import { CreateAcademicPeriodUseCase } from './create-academic-period.use-case.js'
import { InMemoryAcademicPeriodRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-academic-period.repository.js'

describe('CreateAcademicPeriodUseCase', () => {
  let repo: InMemoryAcademicPeriodRepository
  let useCase: CreateAcademicPeriodUseCase

  beforeEach(() => { repo = new InMemoryAcademicPeriodRepository(); useCase = new CreateAcademicPeriodUseCase(repo) })

  it('should create period', async () => {
    const r = await useCase.execute({ name: '2026-1', startDate: '2026-03-01', endDate: '2026-07-15', enrollmentStart: '2026-02-01', enrollmentEnd: '2026-03-10' })
    expect(r.name).toBe('2026-1'); expect(r.status).toBe('planned')
  })
})
