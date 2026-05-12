import { describe, it, expect, beforeEach } from 'vitest'
import { CalculateFinalGradeUseCase } from './calculate-final-grade.use-case.js'
import { GradeCalculator } from '../../../domain/services/grade-calculator.js'
import { InMemoryGradeRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-grade.repository.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { Grade } from '../../../domain/entities/grade.js'
import { Enrollment } from '../../../domain/entities/enrollment.js'

describe('CalculateFinalGradeUseCase', () => {
  let gradeRepo: InMemoryGradeRepository
  let enrollmentRepo: InMemoryEnrollmentRepository
  let useCase: CalculateFinalGradeUseCase

  beforeEach(() => {
    gradeRepo = new InMemoryGradeRepository()
    enrollmentRepo = new InMemoryEnrollmentRepository()
    useCase = new CalculateFinalGradeUseCase(new GradeCalculator(gradeRepo, enrollmentRepo))
  })

  it('should calculate final grade correctly', async () => {
    const now = new Date()
    await enrollmentRepo.save(Enrollment.create({
      id: 'e-1', studentId: 's-1', courseId: 'c-1',
      enrollmentDate: now, status: 'enrolled', finalGrade: null,
      createdAt: now, updatedAt: now,
    }))

    await gradeRepo.save(Grade.create({
      id: 'g-1', enrollmentId: 'e-1', evaluationType: 'exam', value: 16, percentage: 60, maxValue: 20,
      observation: null, registeredAt: now, createdAt: now, updatedAt: now,
    }))
    await gradeRepo.save(Grade.create({
      id: 'g-2', enrollmentId: 'e-1', evaluationType: 'quiz', value: 9, percentage: 40, maxValue: 10,
      observation: null, registeredAt: now, createdAt: now, updatedAt: now,
    }))

    const result = await useCase.execute('e-1')
    expect(result.finalGrade).toBe(16 * 60 / 20 + 9 * 40 / 10)
  })
})
