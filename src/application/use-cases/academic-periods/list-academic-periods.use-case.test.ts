import { describe, it, expect, beforeEach } from 'vitest'
import { CreateAcademicPeriodUseCase } from './create-academic-period.use-case.js'
import { ListAcademicPeriodsUseCase } from './list-academic-periods.use-case.js'
import { InMemoryAcademicPeriodRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-academic-period.repository.js'

describe('ListAcademicPeriodsUseCase', () => {
  let repo: InMemoryAcademicPeriodRepository
  let listUseCase: ListAcademicPeriodsUseCase

  beforeEach(async () => {
    repo = new InMemoryAcademicPeriodRepository()
    listUseCase = new ListAcademicPeriodsUseCase(repo)
    const create = new CreateAcademicPeriodUseCase(repo)

    for (let i = 0; i < 5; i++) {
      await create.execute({ name: `2026-${i + 1}`, startDate: '2026-03-01', endDate: '2026-07-15', enrollmentStart: '2026-02-01', enrollmentEnd: '2026-03-10' })
    }
  })

  it('should list paginated periods', async () => {
    const result = await listUseCase.execute(1, 2)
    expect(result.data).toHaveLength(2)
    expect(result.pagination.total).toBe(5)
    expect(result.pagination.totalPages).toBe(3)
  })

  it('should return empty for page beyond total', async () => {
    const result = await listUseCase.execute(10, 20)
    expect(result.data).toHaveLength(0)
    expect(result.pagination.total).toBe(5)
  })
})
