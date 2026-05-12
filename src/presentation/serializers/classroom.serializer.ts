import type { ClassroomOutput } from '../../application/dtos/classroom.js'
import type { PaginatedOutput } from '../../application/dtos/student.js'

export function serializeClassroom(classroom: ClassroomOutput) {
  return classroom
}

export function serializePaginatedClassrooms(result: PaginatedOutput<ClassroomOutput>) {
  return result
}
