import type { CourseRepository, CourseWithEnrolledCount } from '../../../../domain/repositories/course-repository.js'
import { Course } from '../../../../domain/entities/course.js'
import { Schedule } from '../../../../domain/value-objects/schedule.js'

export class InMemoryCourseRepository implements CourseRepository {
  private items: Map<string, Course> = new Map()
  private enrolledCounts: Map<string, number> = new Map()

  setEnrolledCount(courseId: string, count: number) { this.enrolledCounts.set(courseId, count) }

  async findById(id: string) { return this.items.get(id) ?? null }
  async findByCode(code: string) { for (const c of this.items.values()) { if (c.code === code) return c } return null }

  async findAll(page: number, pageSize: number) {
    const all = Array.from(this.items.values())
    const total = all.length
    const slice = all.slice((page - 1) * pageSize, page * pageSize)
    const courses = slice.map((c) => Object.assign(c, { enrolledCount: this.enrolledCounts.get(c.id) ?? 0 })) as CourseWithEnrolledCount[]
    return { courses, total }
  }

  async save(c: Course) { this.items.set(c.id, c) }
  async update(c: Course) { this.items.set(c.id, c) }
  async delete(id: string) { this.items.delete(id) }

  async findConflictingSchedules(schedule: Schedule, _academicPeriodId: string, _studentId: string, _excludeCourseId?: string): Promise<Course[]> {
    return Array.from(this.items.values()).filter((c) => c.schedule?.conflictsWith(schedule) ?? false)
  }

  clear() { this.items.clear(); this.enrolledCounts.clear() }
}
