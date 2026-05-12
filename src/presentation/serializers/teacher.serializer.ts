import type { TeacherOutput } from '../../application/dtos/teacher.js'
import type { PaginatedOutput } from '../../application/dtos/student.js'

export function serializeTeacher(teacher: TeacherOutput) {
  return teacher
}

export function serializePaginatedTeachers(result: PaginatedOutput<TeacherOutput>) {
  return result
}
