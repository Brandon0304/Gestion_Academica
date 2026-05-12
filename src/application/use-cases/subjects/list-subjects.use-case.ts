import type { SubjectRepository } from '../../../domain/repositories/subject-repository.js'
import type { SubjectOutput } from '../../dtos/subject.js'
import type { PaginatedOutput } from '../../dtos/student.js'

export class ListSubjectsUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}
  async execute(page: number, pageSize: number): Promise<PaginatedOutput<SubjectOutput>> {
    const { subjects, total } = await this.subjectRepository.findAll(page, pageSize)
    return {
      data: subjects.map((s) => ({ id: s.id, code: s.code, name: s.name, description: s.description, credits: s.credits, theoryHours: s.theoryHours, practiceHours: s.practiceHours, studyPlanId: s.studyPlanId })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }
}
