import type { SubjectRepository } from '../../../domain/repositories/subject-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateSubjectInput, SubjectOutput } from '../../dtos/subject.js'

export class UpdateSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}
  async execute(id: string, input: UpdateSubjectInput): Promise<SubjectOutput> {
    const s = await this.subjectRepository.findById(id)
    if (!s) throw new NotFoundError('Asignatura')
    const updated = s.updateInfo(input)
    await this.subjectRepository.update(updated)
    return { id: updated.id, code: updated.code, name: updated.name, description: updated.description, credits: updated.credits, theoryHours: updated.theoryHours, practiceHours: updated.practiceHours, studyPlanId: updated.studyPlanId }
  }
}
