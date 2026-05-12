import type { GradeRepository } from '../../../domain/repositories/grade-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateGradeInput, GradeOutput } from '../../dtos/grade.js'

export class UpdateGradeUseCase {
  constructor(private readonly gradeRepository: GradeRepository) {}
  async execute(id: string, input: UpdateGradeInput): Promise<GradeOutput> {
    const grade = await this.gradeRepository.findById(id)
    if (!grade) throw new NotFoundError('Calificación')

    const updated = grade.update(input)
    await this.gradeRepository.update(updated)

    return {
      id: updated.id, enrollmentId: updated.enrollmentId, evaluationType: updated.evaluationType,
      value: updated.value, percentage: updated.percentage, maxValue: updated.maxValue,
      observation: updated.observation, registeredAt: updated.registeredAt.toISOString(),
    }
  }
}
