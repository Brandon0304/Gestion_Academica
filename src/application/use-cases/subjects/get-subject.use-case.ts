import type { SubjectRepository } from '../../../domain/repositories/subject-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { SubjectOutput } from '../../dtos/subject.js'

export class GetSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}
  async execute(id: string): Promise<SubjectOutput> {
    const s = await this.subjectRepository.findById(id)
    if (!s) throw new NotFoundError('Asignatura')
    return { id: s.id, code: s.code, name: s.name, description: s.description, credits: s.credits, theoryHours: s.theoryHours, practiceHours: s.practiceHours, studyPlanId: s.studyPlanId }
  }
}
