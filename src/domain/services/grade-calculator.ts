import type { GradeRepository } from '../repositories/grade-repository.js'
import type { EnrollmentRepository } from '../repositories/enrollment-repository.js'
import { ConflictError } from '../../shared/errors/index.js'

const MIN_PASSING_GRADE = 55

export class GradeCalculator {
  constructor(
    private readonly gradeRepository: GradeRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  async calculateFinalGrade(enrollmentId: string): Promise<number> {
    const currentSum = await this.gradeRepository.sumPercentagesByEnrollment(enrollmentId)
    if (Math.abs(currentSum - 100) > 0.01) {
      throw new ConflictError(
        `La suma de porcentajes es ${currentSum.toFixed(2)}%. Debe ser exactamente 100% para calcular la nota final`,
      )
    }

    const grades = await this.gradeRepository.findByEnrollment(enrollmentId)
    const finalGrade = grades.reduce((sum, g) => sum + g.weightedValue, 0)

    const enrollment = await this.enrollmentRepository.findById(enrollmentId)
    if (!enrollment) throw new Error('Inscripción no encontrada')

    const updated = finalGrade >= MIN_PASSING_GRADE ? enrollment.approve(finalGrade) : enrollment.fail(finalGrade)
    await this.enrollmentRepository.update(updated)

    return finalGrade
  }
}
