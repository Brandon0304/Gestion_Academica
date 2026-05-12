import { PrismaClient } from '@prisma/client'
import { Enrollment } from '../../../domain/entities/enrollment.js'
import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'

export class PrismaEnrollmentRepository implements EnrollmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Enrollment | null> {
    const row = await this.prisma.enrollment.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByStudentAndCourse(studentId: string, courseId: string): Promise<Enrollment | null> {
    const row = await this.prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId, courseId }, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    const rows = await this.prisma.enrollment.findMany({ where: { studentId, deletedAt: null } })
    return rows.map((r) => this.toDomain(r))
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    const rows = await this.prisma.enrollment.findMany({ where: { courseId, deletedAt: null } })
    return rows.map((r) => this.toDomain(r))
  }

  async findAll(page: number, pageSize: number): Promise<{ enrollments: Enrollment[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.enrollment.findMany({ where: { deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { enrollmentDate: 'desc' } }),
      this.prisma.enrollment.count({ where: { deletedAt: null } }),
    ])
    return { enrollments: rows.map((r) => this.toDomain(r)), total }
  }

  async save(e: Enrollment): Promise<void> {
    await this.prisma.enrollment.create({ data: { id: e.id, studentId: e.studentId, courseId: e.courseId, enrollmentDate: e.enrollmentDate, status: e.status, finalGrade: e.finalGrade } })
  }

  async update(e: Enrollment): Promise<void> {
    await this.prisma.enrollment.update({ where: { id: e.id }, data: { status: e.status, finalGrade: e.finalGrade } })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.enrollment.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async countByCourse(courseId: string): Promise<number> {
    return this.prisma.enrollment.count({ where: { courseId, deletedAt: null, status: { not: 'withdrawn' } } })
  }

  async findApprovedByStudent(studentId: string): Promise<Enrollment[]> {
    const rows = await this.prisma.enrollment.findMany({ where: { studentId, status: 'approved', deletedAt: null } })
    return rows.map((r) => this.toDomain(r))
  }

  async findApprovedByStudentAndSubject(studentId: string, subjectId: string): Promise<Enrollment | null> {
    const row = await this.prisma.enrollment.findFirst({
      where: { studentId, status: 'approved', deletedAt: null, course: { subjectId } },
    })
    return row ? this.toDomain(row) : null
  }

  private toDomain(row: { id: string; studentId: string; courseId: string; enrollmentDate: Date; status: string; finalGrade: unknown; createdAt: Date; updatedAt: Date }): Enrollment {
    return Enrollment.create({ id: row.id, studentId: row.studentId, courseId: row.courseId, enrollmentDate: row.enrollmentDate, status: row.status as Enrollment['status'], finalGrade: row.finalGrade ? Number(row.finalGrade) : null, createdAt: row.createdAt, updatedAt: row.updatedAt })
  }
}
