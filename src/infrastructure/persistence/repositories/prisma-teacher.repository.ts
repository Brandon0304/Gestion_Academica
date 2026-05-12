import { PrismaClient } from '@prisma/client'
import { Teacher } from '../../../domain/entities/teacher.js'
import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'

export class PrismaTeacherRepository implements TeacherRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Teacher | null> {
    const row = await this.prisma.teacher.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByEmail(email: Email): Promise<Teacher | null> {
    const row = await this.prisma.teacher.findUnique({ where: { email: email.toString(), deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByDocumentId(documentId: DocumentId): Promise<Teacher | null> {
    const row = await this.prisma.teacher.findUnique({ where: { documentId: documentId.toString(), deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByUserId(userId: string): Promise<Teacher | null> {
    const row = await this.prisma.teacher.findFirst({
      where: { deletedAt: null, users: { some: { userId } } },
    })
    return row ? this.toDomain(row) : null
  }

  async findAll(page: number, pageSize: number): Promise<{ teachers: Teacher[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.teacher.findMany({ where: { deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.teacher.count({ where: { deletedAt: null } }),
    ])
    return { teachers: rows.map((r) => this.toDomain(r)), total }
  }

  async save(teacher: Teacher): Promise<void> {
    await this.prisma.teacher.create({ data: { id: teacher.id, firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email.toString(), documentId: teacher.documentId.toString(), specialty: teacher.specialty, degree: teacher.degree, hireDate: teacher.hireDate, status: teacher.status } })
  }

  async update(teacher: Teacher): Promise<void> {
    await this.prisma.teacher.update({ where: { id: teacher.id }, data: { firstName: teacher.firstName, lastName: teacher.lastName, specialty: teacher.specialty, degree: teacher.degree, status: teacher.status } })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.teacher.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  private toDomain(row: { id: string; firstName: string; lastName: string; email: string; documentId: string; specialty: string | null; degree: string | null; hireDate: Date; status: string; createdAt: Date; updatedAt: Date }): Teacher {
    return Teacher.create({ id: row.id, firstName: row.firstName, lastName: row.lastName, email: new Email(row.email), documentId: new DocumentId(row.documentId), specialty: row.specialty, degree: row.degree, hireDate: row.hireDate, status: row.status as Teacher['status'], createdAt: row.createdAt, updatedAt: row.updatedAt })
  }
}
