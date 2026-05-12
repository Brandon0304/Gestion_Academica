import { PrismaClient } from '@prisma/client'
import { Course } from '../../../domain/entities/course.js'
import { Schedule } from '../../../domain/value-objects/schedule.js'
import type { CourseRepository, CourseWithEnrolledCount } from '../../../domain/repositories/course-repository.js'
import type { DayOfWeek } from '../../../domain/value-objects/schedule.js'

export class PrismaCourseRepository implements CourseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Course | null> {
    const row = await this.prisma.course.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByCode(code: string): Promise<Course | null> {
    const row = await this.prisma.course.findUnique({ where: { code, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findAll(page: number, pageSize: number, filters?: { academicPeriodId?: string; subjectId?: string; teacherId?: string; status?: string }): Promise<{ courses: CourseWithEnrolledCount[]; total: number }> {
    const where: Record<string, unknown> = { deletedAt: null }
    if (filters?.academicPeriodId) where['academicPeriodId'] = filters.academicPeriodId
    if (filters?.subjectId) where['subjectId'] = filters.subjectId
    if (filters?.teacherId) where['teacherId'] = filters.teacherId
    if (filters?.status) where['status'] = filters.status

    const [rows, total] = await Promise.all([
      this.prisma.course.findMany({ where: where as never, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.course.count({ where: where as never }),
    ])
    const courses = await Promise.all(rows.map(async (r) => {
      const c = this.toDomain(r)
      const enrolledCount = await this.prisma.enrollment.count({ where: { courseId: r.id, deletedAt: null, status: { not: 'withdrawn' } } })
      return Object.assign(c, { enrolledCount }) as CourseWithEnrolledCount
    }))
    return { courses, total }
  }

  async save(course: Course): Promise<void> {
    const data = this.toPersistence(course)
    await this.prisma.course.create({ data: data as never })
  }

  async update(course: Course): Promise<void> {
    const data = this.toPersistence(course)
    await this.prisma.course.update({ where: { id: course.id }, data: data as never })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async findConflictingSchedules(schedule: Schedule, academicPeriodId: string, studentId: string, excludeCourseId?: string): Promise<Course[]> {
    const studentEnrollments = await this.prisma.enrollment.findMany({
      where: { studentId, deletedAt: null, status: { not: 'withdrawn' }, course: { academicPeriodId, deletedAt: null } },
      include: { course: true },
    })

    const conflicting: Course[] = []
    for (const enrollment of studentEnrollments) {
      if (enrollment.courseId === excludeCourseId) continue
      const cs = enrollment.course.schedule
      if (!cs) continue
      const s = cs as { days: string[]; startTime: string; endTime: string }
      const otherSchedule = new Schedule(s.days as DayOfWeek[], s.startTime, s.endTime)
      if (schedule.conflictsWith(otherSchedule)) {
        conflicting.push(this.toDomain(enrollment.course))
      }
    }
    return conflicting
  }

  private toDomain(row: { id: string; code: string; name: string; description: string | null; credits: number; maxCapacity: number; subjectId: string; teacherId: string; academicPeriodId: string; classroomId: string | null; schedule: unknown; status: string; createdAt: Date; updatedAt: Date }): Course {
    const schedule = row.schedule
      ? Schedule.fromJSON(row.schedule as { days: DayOfWeek[]; startTime: string; endTime: string })
      : null
    return Course.create({ id: row.id, code: row.code, name: row.name, description: row.description, credits: row.credits, maxCapacity: row.maxCapacity, subjectId: row.subjectId, teacherId: row.teacherId, academicPeriodId: row.academicPeriodId, classroomId: row.classroomId, schedule, status: row.status as Course['status'], createdAt: row.createdAt, updatedAt: row.updatedAt })
  }

  private toPersistence(c: Course) {
    return { id: c.id, code: c.code, name: c.name, description: c.description, credits: c.credits, maxCapacity: c.maxCapacity, subjectId: c.subjectId, teacherId: c.teacherId, academicPeriodId: c.academicPeriodId, classroomId: c.classroomId, schedule: c.schedule?.toJSON() ?? null, status: c.status }
  }
}
