import type { StudyPlanRepository } from '../../../domain/repositories/study-plan-repository.js'
import type { StudyPlanOutput } from '../../dtos/study-plan.js'
import type { PaginatedOutput } from '../../dtos/student.js'

export class ListStudyPlansUseCase {
  constructor(private readonly studyPlanRepository: StudyPlanRepository) {}

  async execute(page: number, pageSize: number): Promise<PaginatedOutput<StudyPlanOutput>> {
    const { studyPlans, total } = await this.studyPlanRepository.findAll(page, pageSize)
    return {
      data: studyPlans.map((s) => ({
        id: s.id, name: s.name, code: s.code, description: s.description,
        year: s.year, totalCredits: s.totalCredits, status: s.status,
      })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }
}
