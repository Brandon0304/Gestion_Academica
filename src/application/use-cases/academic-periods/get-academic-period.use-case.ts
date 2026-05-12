import type { AcademicPeriodRepository } from '../../../domain/repositories/academic-period-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { AcademicPeriodOutput } from '../../dtos/academic-period.js'

export class GetAcademicPeriodUseCase {
  constructor(private readonly repository: AcademicPeriodRepository) {}
  async execute(id: string): Promise<AcademicPeriodOutput> {
    const p = await this.repository.findById(id)
    if (!p) throw new NotFoundError('Período académico')
    return { id: p.id, name: p.name, startDate: p.startDate.toISOString(), endDate: p.endDate.toISOString(), enrollmentStart: p.enrollmentStart.toISOString(), enrollmentEnd: p.enrollmentEnd.toISOString(), status: p.status }
  }
}
