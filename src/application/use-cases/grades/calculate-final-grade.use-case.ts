import { GradeCalculator } from '../../../domain/services/grade-calculator.js'

export class CalculateFinalGradeUseCase {
  constructor(private readonly gradeCalculator: GradeCalculator) {}
  async execute(enrollmentId: string): Promise<{ finalGrade: number }> {
    const finalGrade = await this.gradeCalculator.calculateFinalGrade(enrollmentId)
    return { finalGrade }
  }
}
