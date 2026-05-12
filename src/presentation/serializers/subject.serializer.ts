import type { SubjectOutput } from '../../application/dtos/subject.js'
import type { PaginatedOutput } from '../../application/dtos/student.js'

export function serializeSubject(subject: SubjectOutput) {
  return subject
}

export function serializePaginatedSubjects(result: PaginatedOutput<SubjectOutput>) {
  return result
}
