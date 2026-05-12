import { describe, it, expect, beforeEach } from 'vitest'
import { ListEnrollmentsUseCase } from './list-enrollments.use-case.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { Enrollment } from '../../../domain/entities/enrollment.js'

describe('ListEnrollmentsUseCase', () => {
  let repo: InMemoryEnrollmentRepository
  let useCase: ListEnrollmentsUseCase

  beforeEach(async () => {
    repo = new InMemoryEnrollmentRepository()
    useCase = new ListEnrollmentsUseCase(repo)

    for (let i = 0; i < 3; i++) {
      const enrollment = Enrollment.create({ id: `e-${i}`, studentId: 's-1', courseId: `c-${i}`, enrollmentDate: new Date(), status: 'enrolled', finalGrade: null, createdAt: new Date(), updatedAt: new Date() })
      await repo.save(enrollment)
    }
  })

  it('should list paginated enrollments', async () => {
    const result = await useCase.execute(1, 2)
    expect(result.data).toHaveLength(2)
    expect(result.pagination.total).toBe(3)
  })

  it('should filter by studentId when provided', async () => {
    const extra = Enrollment.create({ id: 'e-other', studentId: 's-2', courseId: 'c-other', enrollmentDate: new Date(), status: 'enrolled', finalGrade: null, createdAt: new Date(), updatedAt: new Date() })
    await repo.save(extra)
    const result = await useCase.execute(1, 10, 's-1')
    expect(result.data).toHaveLength(3)
    result.data.forEach((e) => expect(e.studentId).toBe('s-1'))
  })

  it('should return empty for page beyond total', async () => {
    const result = await useCase.execute(10, 20)
    expect(result.data).toHaveLength(0)
    expect(result.pagination.total).toBe(3)
  })
})
