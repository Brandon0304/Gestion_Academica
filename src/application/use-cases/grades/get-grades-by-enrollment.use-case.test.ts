import { describe, it, expect, beforeEach } from 'vitest'
import { GetGradesByEnrollmentUseCase } from './get-grades-by-enrollment.use-case.js'
import { InMemoryGradeRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-grade.repository.js'
import { Grade } from '../../../domain/entities/grade.js'

describe('GetGradesByEnrollmentUseCase', () => {
  let repo: InMemoryGradeRepository
  let useCase: GetGradesByEnrollmentUseCase

  beforeEach(() => { repo = new InMemoryGradeRepository(); useCase = new GetGradesByEnrollmentUseCase(repo) })

  it('should return grades for enrollment', async () => {
    await repo.save(Grade.create({
      id: 'g-1', enrollmentId: 'e-1', evaluationType: 'exam', value: 16, percentage: 60, maxValue: 20,
      observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    }))
    await repo.save(Grade.create({
      id: 'g-2', enrollmentId: 'e-1', evaluationType: 'quiz', value: 8, percentage: 40, maxValue: 10,
      observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    }))

    const result = await useCase.execute('e-1')
    expect(result).toHaveLength(2)
    expect(result[0]?.evaluationType).toBe('exam')
    expect(result[1]?.evaluationType).toBe('quiz')
  })

  it('should return empty array when no grades', async () => {
    const result = await useCase.execute('e-1')
    expect(result).toHaveLength(0)
  })
})
