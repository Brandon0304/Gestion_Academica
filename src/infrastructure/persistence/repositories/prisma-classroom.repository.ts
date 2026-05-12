import { PrismaClient } from '@prisma/client'
import { Classroom } from '../../../domain/entities/classroom.js'
import type { ClassroomRepository } from '../../../domain/repositories/classroom-repository.js'

export class PrismaClassroomRepository implements ClassroomRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Classroom | null> {
    const row = await this.prisma.classroom.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByCode(code: string): Promise<Classroom | null> {
    const row = await this.prisma.classroom.findUnique({ where: { code, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findAll(page: number, pageSize: number): Promise<{ classrooms: Classroom[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.classroom.findMany({ where: { deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.classroom.count({ where: { deletedAt: null } }),
    ])
    return { classrooms: rows.map((r) => this.toDomain(r)), total }
  }

  async save(classroom: Classroom): Promise<void> {
    await this.prisma.classroom.create({ data: { id: classroom.id, code: classroom.code, name: classroom.name, capacity: classroom.capacity, type: classroom.type, location: classroom.location } })
  }

  async update(classroom: Classroom): Promise<void> {
    await this.prisma.classroom.update({ where: { id: classroom.id }, data: { name: classroom.name, capacity: classroom.capacity, type: classroom.type, location: classroom.location } })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.classroom.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  private toDomain(row: { id: string; code: string; name: string | null; capacity: number; type: string; location: string | null; createdAt: Date; updatedAt: Date }): Classroom {
    return Classroom.create({ id: row.id, code: row.code, name: row.name, capacity: row.capacity, type: row.type as Classroom['type'], location: row.location, createdAt: row.createdAt, updatedAt: row.updatedAt })
  }
}
