import { describe, it, expect, beforeEach } from 'vitest'
import { GetEnrollmentUseCase } from './get-enrollment.use-case.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { Enrollment } from '../../../domain/entities/enrollment.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('GetEnrollmentUseCase', () => {
  let repo: InMemoryEnrollmentRepository
  let useCase: GetEnrollmentUseCase

  beforeEach(() => {
    repo = new InMemoryEnrollmentRepository()
    useCase = new GetEnrollmentUseCase(repo)
  })

  it('should return enrollment when found', async () => {
    const enrollment = Enrollment.create({ id: 'e-1', studentId: 's-1', courseId: 'c-1', enrollmentDate: new Date(), status: 'enrolled', finalGrade: null, createdAt: new Date(), updatedAt: new Date() })
    await repo.save(enrollment)
    const result = await useCase.execute('e-1')
    expect(result.id).toBe('e-1')
    expect(result.studentId).toBe('s-1')
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
