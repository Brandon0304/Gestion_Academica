import { PrismaClient } from '@prisma/client'
import { Student } from '../../../domain/entities/student.js'
import type { StudentRepository } from '../../../domain/repositories/student-repository.js'

import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'

export class PrismaStudentRepository implements StudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Student | null> {
    const row = await this.prisma.student.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByEmail(email: Email): Promise<Student | null> {
    const row = await this.prisma.student.findUnique({ where: { email: email.toString(), deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByDocumentId(documentId: DocumentId): Promise<Student | null> {
    const row = await this.prisma.student.findUnique({ where: { documentId: documentId.toString(), deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const row = await this.prisma.student.findFirst({
      where: { deletedAt: null, users: { some: { userId } } },
    })
    return row ? this.toDomain(row) : null
  }

  async findAll(page: number, pageSize: number): Promise<{ students: Student[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.student.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where: { deletedAt: null } }),
    ])
    return { students: rows.map((r) => this.toDomain(r)), total }
  }

  async save(student: Student): Promise<void> {
    await this.prisma.student.create({ data: this.toPersistence(student) })
  }

  async update(student: Student): Promise<void> {
    await this.prisma.student.update({
      where: { id: student.id },
      data: this.toPersistence(student),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  private toDomain(row: {
    id: string; firstName: string; lastName: string; email: string
    documentId: string; birthDate: Date | null; phone: string | null
    address: string | null; enrollmentDate: Date; status: string
    createdAt: Date; updatedAt: Date
  }): Student {
    return Student.create({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: new Email(row.email),
      documentId: new DocumentId(row.documentId),
      birthDate: row.birthDate,
      phone: row.phone,
      address: row.address,
      enrollmentDate: row.enrollmentDate,
      status: row.status as Student['status'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  private toPersistence(student: Student) {
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email.toString(),
      documentId: student.documentId.toString(),
      birthDate: student.birthDate,
      phone: student.phone,
      address: student.address,
      enrollmentDate: student.enrollmentDate,
      status: student.status,
    }
  }
}
