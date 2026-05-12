import { describe, it, expect, beforeEach } from 'vitest'
import { CreateAcademicPeriodUseCase } from './create-academic-period.use-case.js'
import { GetAcademicPeriodUseCase } from './get-academic-period.use-case.js'
import { InMemoryAcademicPeriodRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-academic-period.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('GetAcademicPeriodUseCase', () => {
  let repo: InMemoryAcademicPeriodRepository
  let getUseCase: GetAcademicPeriodUseCase

  beforeEach(() => { repo = new InMemoryAcademicPeriodRepository(); getUseCase = new GetAcademicPeriodUseCase(repo) })

  it('should return period when found', async () => {
    const create = new CreateAcademicPeriodUseCase(repo)
    const created = await create.execute({ name: '2026-1', startDate: '2026-03-01', endDate: '2026-07-15', enrollmentStart: '2026-02-01', enrollmentEnd: '2026-03-10' })
    const r = await getUseCase.execute(created.id)
    expect(r.name).toBe('2026-1'); expect(r.status).toBe('planned')
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(getUseCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
