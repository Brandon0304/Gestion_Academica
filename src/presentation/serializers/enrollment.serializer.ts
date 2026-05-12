import type { EnrollmentOutput } from '../../application/dtos/enrollment.js'
import type { PaginatedOutput } from '../../application/dtos/student.js'

export function serializeEnrollment(enrollment: EnrollmentOutput) {
  return enrollment
}

export function serializePaginatedEnrollments(result: PaginatedOutput<EnrollmentOutput>) {
  return result
}
