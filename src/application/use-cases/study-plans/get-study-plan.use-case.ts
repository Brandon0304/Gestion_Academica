import type { StudyPlanRepository } from '../../../domain/repositories/study-plan-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { StudyPlanOutput } from '../../dtos/study-plan.js'

export class GetStudyPlanUseCase {
  constructor(private readonly studyPlanRepository: StudyPlanRepository) {}

  async execute(id: string): Promise<StudyPlanOutput> {
    const studyPlan = await this.studyPlanRepository.findById(id)
    if (!studyPlan) throw new NotFoundError('Plan de estudios')
    return {
      id: studyPlan.id, name: studyPlan.name, code: studyPlan.code,
      description: studyPlan.description, year: studyPlan.year,
      totalCredits: studyPlan.totalCredits, status: studyPlan.status,
    }
  }
}
