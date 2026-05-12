import type { StudyPlanRepository } from '../../../domain/repositories/study-plan-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateStudyPlanInput, StudyPlanOutput } from '../../dtos/study-plan.js'

export class UpdateStudyPlanUseCase {
  constructor(private readonly studyPlanRepository: StudyPlanRepository) {}

  async execute(id: string, input: UpdateStudyPlanInput): Promise<StudyPlanOutput> {
    const studyPlan = await this.studyPlanRepository.findById(id)
    if (!studyPlan) throw new NotFoundError('Plan de estudios')

    const updated = studyPlan.updateInfo({
      name: input.name,
      description: input.description,
      year: input.year,
      totalCredits: input.totalCredits,
    })

    await this.studyPlanRepository.update(updated)
    return {
      id: updated.id, name: updated.name, code: updated.code,
      description: updated.description, year: updated.year,
      totalCredits: updated.totalCredits, status: updated.status,
    }
  }
}
