import { Subject } from '../../../domain/entities/subject.js'
import type { SubjectRepository } from '../../../domain/repositories/subject-repository.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { v4 as uuid } from 'uuid'
import type { CreateSubjectInput, SubjectOutput } from '../../dtos/subject.js'

export class CreateSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}
  async execute(input: CreateSubjectInput): Promise<SubjectOutput> {
    const existing = await this.subjectRepository.findByCode(input.code)
    if (existing) throw new ConflictError('Ya existe una asignatura con ese código')

    const subject = Subject.create({
      id: uuid(), code: input.code, name: input.name, description: input.description ?? null,
      credits: input.credits, theoryHours: input.theoryHours ?? 0, practiceHours: input.practiceHours ?? 0,
      studyPlanId: input.studyPlanId ?? null, createdAt: new Date(), updatedAt: new Date(),
    })
    await this.subjectRepository.save(subject)
    return this.toOutput(subject)
  }

  private toOutput(s: Subject): SubjectOutput {
    return { id: s.id, code: s.code, name: s.name, description: s.description, credits: s.credits, theoryHours: s.theoryHours, practiceHours: s.practiceHours, studyPlanId: s.studyPlanId }
  }
}
