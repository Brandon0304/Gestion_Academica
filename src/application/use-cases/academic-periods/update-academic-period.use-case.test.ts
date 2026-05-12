import { describe, it, expect, beforeEach } from 'vitest'
import { CreateAcademicPeriodUseCase } from './create-academic-period.use-case.js'
import { UpdateAcademicPeriodUseCase } from './update-academic-period.use-case.js'
import { InMemoryAcademicPeriodRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-academic-period.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('UpdateAcademicPeriodUseCase', () => {
  let repo: InMemoryAcademicPeriodRepository
  let updateUseCase: UpdateAcademicPeriodUseCase

  beforeEach(() => { repo = new InMemoryAcademicPeriodRepository(); updateUseCase = new UpdateAcademicPeriodUseCase(repo) })

  it('should update name', async () => {
    const create = new CreateAcademicPeriodUseCase(repo)
    const created = await create.execute({ name: '2026-1', startDate: '2026-03-01', endDate: '2026-07-15', enrollmentStart: '2026-02-01', enrollmentEnd: '2026-03-10' })
    const r = await updateUseCase.execute(created.id, { name: '2026-I' })
    expect(r.name).toBe('2026-I')
  })

  it('should change status to active', async () => {
    const create = new CreateAcademicPeriodUseCase(repo)
    const created = await create.execute({ name: '2026-1', startDate: '2026-03-01', endDate: '2026-07-15', enrollmentStart: '2026-02-01', enrollmentEnd: '2026-03-10' })
    const r = await updateUseCase.execute(created.id, { status: 'active' })
    expect(r.status).toBe('active')
  })

  it('should change status to closed', async () => {
    const create = new CreateAcademicPeriodUseCase(repo)
    const created = await create.execute({ name: '2026-1', startDate: '2026-03-01', endDate: '2026-07-15', enrollmentStart: '2026-02-01', enrollmentEnd: '2026-03-10' })
    const r = await updateUseCase.execute(created.id, { status: 'closed' })
    expect(r.status).toBe('closed')
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(updateUseCase.execute('non-existent', { name: 'Test' })).rejects.toThrow(NotFoundError)
  })
})
