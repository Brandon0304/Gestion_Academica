import type { CourseOutput } from '../../application/dtos/course.js'
import type { PaginatedOutput } from '../../application/dtos/student.js'

export function serializeCourse(course: CourseOutput) {
  return course
}

export function serializePaginatedCourses(result: PaginatedOutput<CourseOutput>) {
  return result
}
