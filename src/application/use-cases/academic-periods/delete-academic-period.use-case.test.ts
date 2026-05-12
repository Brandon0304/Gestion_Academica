import { describe, it, expect, beforeEach } from 'vitest'
import { CreateAcademicPeriodUseCase } from './create-academic-period.use-case.js'
import { DeleteAcademicPeriodUseCase } from './delete-academic-period.use-case.js'
import { InMemoryAcademicPeriodRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-academic-period.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('DeleteAcademicPeriodUseCase', () => {
  let repo: InMemoryAcademicPeriodRepository
  let deleteUseCase: DeleteAcademicPeriodUseCase

  beforeEach(() => { repo = new InMemoryAcademicPeriodRepository(); deleteUseCase = new DeleteAcademicPeriodUseCase(repo) })

  it('should delete existing period', async () => {
    const create = new CreateAcademicPeriodUseCase(repo)
    const created = await create.execute({ name: '2026-1', startDate: '2026-03-01', endDate: '2026-07-15', enrollmentStart: '2026-02-01', enrollmentEnd: '2026-03-10' })
    await expect(deleteUseCase.execute(created.id)).resolves.toBeUndefined()
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(deleteUseCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
