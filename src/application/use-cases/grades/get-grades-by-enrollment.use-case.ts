import type { GradeRepository } from '../../../domain/repositories/grade-repository.js'
import type { GradeOutput } from '../../dtos/grade.js'

export class GetGradesByEnrollmentUseCase {
  constructor(private readonly gradeRepository: GradeRepository) {}
  async execute(enrollmentId: string): Promise<GradeOutput[]> {
    const grades = await this.gradeRepository.findByEnrollment(enrollmentId)
    return grades.map((g) => ({
      id: g.id, enrollmentId: g.enrollmentId, evaluationType: g.evaluationType,
      value: g.value, percentage: g.percentage, maxValue: g.maxValue,
      observation: g.observation, registeredAt: g.registeredAt.toISOString(),
    }))
  }
}
