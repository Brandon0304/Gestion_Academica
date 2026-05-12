import type { AcademicPeriodOutput } from '../../application/dtos/academic-period.js'
import type { PaginatedOutput } from '../../application/dtos/student.js'

export function serializeAcademicPeriod(period: AcademicPeriodOutput) {
  return period
}

export function serializePaginatedAcademicPeriods(result: PaginatedOutput<AcademicPeriodOutput>) {
  return result
}
