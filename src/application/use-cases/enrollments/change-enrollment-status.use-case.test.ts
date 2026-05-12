import { describe, it, expect, beforeEach } from 'vitest'
import { ChangeEnrollmentStatusUseCase } from './change-enrollment-status.use-case.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { Enrollment } from '../../../domain/entities/enrollment.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('ChangeEnrollmentStatusUseCase', () => {
  let repo: InMemoryEnrollmentRepository
  let useCase: ChangeEnrollmentStatusUseCase

  beforeEach(() => {
    repo = new InMemoryEnrollmentRepository()
    useCase = new ChangeEnrollmentStatusUseCase(repo)
  })

  const createEnrollment = async (id: string) => {
    const enrollment = Enrollment.create({ id, studentId: 's-1', courseId: 'c-1', enrollmentDate: new Date(), status: 'enrolled', finalGrade: null, createdAt: new Date(), updatedAt: new Date() })
    await repo.save(enrollment)
    return enrollment
  }

  it('should change status to withdrawn', async () => {
    await createEnrollment('e-1')
    const result = await useCase.execute('e-1', 'withdrawn')
    expect(result.status).toBe('withdrawn')
    expect(result.finalGrade).toBeNull()
  })

  it('should change to approved with grade', async () => {
    await createEnrollment('e-2')
    const result = await useCase.execute('e-2', 'approved', 95)
    expect(result.status).toBe('approved')
    expect(result.finalGrade).toBe(95)
  })

  it('should change to failed with grade', async () => {
    await createEnrollment('e-3')
    const result = await useCase.execute('e-3', 'failed', 55)
    expect(result.status).toBe('failed')
    expect(result.finalGrade).toBe(55)
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(useCase.execute('non-existent', 'withdrawn')).rejects.toThrow(NotFoundError)
  })
})
