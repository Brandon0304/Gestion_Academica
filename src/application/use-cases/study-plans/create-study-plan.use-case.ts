import { StudyPlan } from '../../../domain/entities/study-plan.js'
import type { StudyPlanRepository } from '../../../domain/repositories/study-plan-repository.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { v4 as uuid } from 'uuid'
import type { CreateStudyPlanInput, StudyPlanOutput } from '../../dtos/study-plan.js'

export class CreateStudyPlanUseCase {
  constructor(private readonly studyPlanRepository: StudyPlanRepository) {}

  async execute(input: CreateStudyPlanInput): Promise<StudyPlanOutput> {
    const existing = await this.studyPlanRepository.findByCode(input.code)
    if (existing) throw new ConflictError('Ya existe un plan de estudios con ese código')

    const studyPlan = StudyPlan.create({
      id: uuid(),
      name: input.name,
      code: input.code,
      description: input.description ?? null,
      year: input.year,
      totalCredits: input.totalCredits,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.studyPlanRepository.save(studyPlan)
    return this.toOutput(studyPlan)
  }

  private toOutput(s: StudyPlan): StudyPlanOutput {
    return {
      id: s.id, name: s.name, code: s.code, description: s.description,
      year: s.year, totalCredits: s.totalCredits, status: s.status,
    }
  }
}
