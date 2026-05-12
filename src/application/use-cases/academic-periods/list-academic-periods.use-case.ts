import type { AcademicPeriodRepository } from '../../../domain/repositories/academic-period-repository.js'
import type { AcademicPeriodOutput } from '../../dtos/academic-period.js'
import type { PaginatedOutput } from '../../dtos/student.js'

export class ListAcademicPeriodsUseCase {
  constructor(private readonly repository: AcademicPeriodRepository) {}
  async execute(page: number, pageSize: number): Promise<PaginatedOutput<AcademicPeriodOutput>> {
    const { periods, total } = await this.repository.findAll(page, pageSize)
    return {
      data: periods.map((p) => ({ id: p.id, name: p.name, startDate: p.startDate.toISOString(), endDate: p.endDate.toISOString(), enrollmentStart: p.enrollmentStart.toISOString(), enrollmentEnd: p.enrollmentEnd.toISOString(), status: p.status })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }
}
