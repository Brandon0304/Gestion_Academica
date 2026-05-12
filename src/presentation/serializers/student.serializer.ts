import type { StudentOutput, PaginatedOutput } from '../../application/dtos/student.js'

export function serializeStudent(student: StudentOutput) {
  return student
}

export function serializePaginatedStudents(result: PaginatedOutput<StudentOutput>) {
  return result
}
