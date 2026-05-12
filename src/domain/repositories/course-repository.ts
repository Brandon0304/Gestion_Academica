import { Course } from '../entities/course.js'
import { Schedule } from '../value-objects/schedule.js'

export interface CourseWithEnrolledCount extends Course {
  enrolledCount: number
}

export interface CourseRepository {
  findById(id: string): Promise<Course | null>
  findByCode(code: string): Promise<Course | null>
  findAll(page: number, pageSize: number, filters?: { academicPeriodId?: string; subjectId?: string; teacherId?: string; status?: string }): Promise<{ courses: CourseWithEnrolledCount[]; total: number }>
  save(course: Course): Promise<void>
  update(course: Course): Promise<void>
  delete(id: string): Promise<void>
  findConflictingSchedules(schedule: Schedule, academicPeriodId: string, studentId: string, excludeCourseId?: string): Promise<Course[]>
}
