import type { EnrollmentRepository } from '../../../../domain/repositories/enrollment-repository.js'
import type { CourseRepository } from '../../../../domain/repositories/course-repository.js'
import { Enrollment } from '../../../../domain/entities/enrollment.js'

export class InMemoryEnrollmentRepository implements EnrollmentRepository {
  private items: Map<string, Enrollment> = new Map()
  constructor(private readonly courseRepository?: CourseRepository) {}

  async findById(id: string) { return this.items.get(id) ?? null }
  async findByStudentAndCourse(studentId: string, courseId: string) { for (const e of this.items.values()) { if (e.studentId === studentId && e.courseId === courseId) return e } return null }
  async findByStudent(studentId: string) { return Array.from(this.items.values()).filter((e) => e.studentId === studentId) }
  async findByCourse(courseId: string) { return Array.from(this.items.values()).filter((e) => e.courseId === courseId) }

  async findAll(page: number, pageSize: number) {
    const all = Array.from(this.items.values())
    return { enrollments: all.slice((page - 1) * pageSize, page * pageSize), total: all.length }
  }

  async save(e: Enrollment) { this.items.set(e.id, e) }
  async update(e: Enrollment) { this.items.set(e.id, e) }
  async delete(id: string) { this.items.delete(id) }

  async countByCourse(courseId: string) {
    return Array.from(this.items.values()).filter((e) => e.courseId === courseId && e.status !== 'withdrawn').length
  }

  async findApprovedByStudent(studentId: string) {
    return Array.from(this.items.values()).filter((e) => e.studentId === studentId && e.status === 'approved')
  }

  async findApprovedByStudentAndSubject(studentId: string, subjectId: string) {
    if (!this.courseRepository) return null
    const approved = Array.from(this.items.values()).filter((e) => e.studentId === studentId && e.status === 'approved')
    for (const e of approved) {
      const course = await this.courseRepository.findById(e.courseId)
      if (course && course.subjectId === subjectId) return e
    }
    return null
  }

  clear() { this.items.clear() }
}
