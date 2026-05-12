import type { StudyPlanRepository } from '../../../domain/repositories/study-plan-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class DeleteStudyPlanUseCase {
  constructor(private readonly studyPlanRepository: StudyPlanRepository) {}

  async execute(id: string): Promise<void> {
    const studyPlan = await this.studyPlanRepository.findById(id)
    if (!studyPlan) throw new NotFoundError('Plan de estudios')
    await this.studyPlanRepository.delete(id)
  }
}
