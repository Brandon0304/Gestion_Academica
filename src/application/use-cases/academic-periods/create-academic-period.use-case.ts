import { AcademicPeriod } from '../../../domain/entities/academic-period.js'
import type { AcademicPeriodRepository } from '../../../domain/repositories/academic-period-repository.js'
import { v4 as uuid } from 'uuid'
import type { CreateAcademicPeriodInput, AcademicPeriodOutput } from '../../dtos/academic-period.js'

export class CreateAcademicPeriodUseCase {
  constructor(private readonly repository: AcademicPeriodRepository) {}
  async execute(input: CreateAcademicPeriodInput): Promise<AcademicPeriodOutput> {
    const period = AcademicPeriod.create({
      id: uuid(), name: input.name,
      startDate: new Date(input.startDate), endDate: new Date(input.endDate),
      enrollmentStart: new Date(input.enrollmentStart), enrollmentEnd: new Date(input.enrollmentEnd),
      status: 'planned', createdAt: new Date(), updatedAt: new Date(),
    })
    await this.repository.save(period)
    return this.toOutput(period)
  }

  private toOutput(p: AcademicPeriod): AcademicPeriodOutput {
    return { id: p.id, name: p.name, startDate: p.startDate.toISOString(), endDate: p.endDate.toISOString(), enrollmentStart: p.enrollmentStart.toISOString(), enrollmentEnd: p.enrollmentEnd.toISOString(), status: p.status }
  }
}
