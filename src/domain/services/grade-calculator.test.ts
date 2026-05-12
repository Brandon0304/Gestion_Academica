import { describe, it, expect, beforeEach } from 'vitest'
import { GradeCalculator } from './grade-calculator.js'
import { InMemoryGradeRepository } from '../../infrastructure/persistence/repositories/in-memory/in-memory-grade.repository.js'
import { InMemoryEnrollmentRepository } from '../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { Grade } from '../entities/grade.js'
import { Enrollment } from '../entities/enrollment.js'
import { ConflictError } from '../../shared/errors/index.js'

describe('GradeCalculator', () => {
  let gradeRepo: InMemoryGradeRepository
  let enrollmentRepo: InMemoryEnrollmentRepository
  let calculator: GradeCalculator

  beforeEach(() => {
    gradeRepo = new InMemoryGradeRepository()
    enrollmentRepo = new InMemoryEnrollmentRepository()
    calculator = new GradeCalculator(gradeRepo, enrollmentRepo)
  })

  const setupEnrollment = async (id: string) => {
    const e = Enrollment.create({ id, studentId: 's-1', courseId: 'c-1', enrollmentDate: new Date(), status: 'enrolled', finalGrade: null, createdAt: new Date(), updatedAt: new Date() })
    await enrollmentRepo.save(e)
    return e
  }

  it('should calculate and approve with 100% sum', async () => {
    await setupEnrollment('e-1')
    await gradeRepo.save(Grade.create({ id: 'g-1', enrollmentId: 'e-1', evaluationType: 'exam', value: 15, percentage: 60, maxValue: 20, observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date() }))
    await gradeRepo.save(Grade.create({ id: 'g-2', enrollmentId: 'e-1', evaluationType: 'project', value: 18, percentage: 40, maxValue: 20, observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date() }))

    const result = await calculator.calculateFinalGrade('e-1')
    // (15/20)*60 + (18/20)*40 = 45 + 36 = 81
    expect(result).toBeCloseTo(81, 1)

    const updated = await enrollmentRepo.findById('e-1')
    expect(updated?.status).toBe('approved')
    expect(updated?.finalGrade).toBeCloseTo(81, 1)
  })

  it('should fail student with low grade', async () => {
    await setupEnrollment('e-2')
    await gradeRepo.save(Grade.create({ id: 'g-3', enrollmentId: 'e-2', evaluationType: 'exam', value: 5, percentage: 100, maxValue: 20, observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date() }))

    // (5/20)*100 = 25 (en escala de 20 = 2.5, en escala de 100 = 25)
    // Wait, let me reconsider. The maxValue is 20, so (5/20)*100 = 25 out of 100
    // Then finalGrade = 25/100*20 = 5 out of 20
    // Hmm, let me think about this differently.
    // weightedValue = (value / maxValue) * percentage = (5/20) * 100 = 25
    // That's on a scale of 0-100. The passing threshold is 11/20 = 55/100
    // So 25/100 < 55/100 means failed. Correct!

    await calculator.calculateFinalGrade('e-2')
    const updated = await enrollmentRepo.findById('e-2')
    expect(updated?.status).toBe('failed')
  })

  it('should throw when percentage sum is not 100', async () => {
    await setupEnrollment('e-3')
    await gradeRepo.save(Grade.create({ id: 'g-4', enrollmentId: 'e-3', evaluationType: 'exam', value: 15, percentage: 50, maxValue: 20, observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date() }))

    await expect(calculator.calculateFinalGrade('e-3')).rejects.toThrow(ConflictError)
  })
})
