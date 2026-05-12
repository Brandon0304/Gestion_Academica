import { PrismaClient } from '@prisma/client'
import { Grade } from '../../../domain/entities/grade.js'
import type { GradeRepository } from '../../../domain/repositories/grade-repository.js'

export class PrismaGradeRepository implements GradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Grade | null> {
    const row = await this.prisma.grade.findUnique({ where: { id } })
    return row ? this.toDomain(row) : null
  }

  async findByEnrollment(enrollmentId: string): Promise<Grade[]> {
    const rows = await this.prisma.grade.findMany({ where: { enrollmentId }, orderBy: { registeredAt: 'asc' } })
    return rows.map((r) => this.toDomain(r))
  }

  async findByCourse(courseId: string): Promise<Grade[]> {
    const rows = await this.prisma.grade.findMany({
      where: { enrollment: { courseId } },
      include: { enrollment: true },
      orderBy: { registeredAt: 'asc' },
    })
    return rows.map((r) => this.toDomain(r))
  }

  async save(grade: Grade): Promise<void> {
    await this.prisma.grade.create({ data: this.toPersistence(grade) })
  }

  async update(grade: Grade): Promise<void> {
    await this.prisma.grade.update({ where: { id: grade.id }, data: this.toPersistence(grade) })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.grade.delete({ where: { id } })
  }

  async sumPercentagesByEnrollment(enrollmentId: string): Promise<number> {
    const result = await this.prisma.grade.aggregate({
      where: { enrollmentId },
      _sum: { percentage: true },
    })
    return Number(result._sum.percentage ?? 0)
  }

  async countByEnrollment(enrollmentId: string): Promise<number> {
    return this.prisma.grade.count({ where: { enrollmentId } })
  }

  private toDomain(row: { id: string; enrollmentId: string; evaluationType: string; value: unknown; percentage: unknown; maxValue: unknown; observation: string | null; registeredAt: Date; createdAt: Date; updatedAt: Date }): Grade {
    return Grade.create({
      id: row.id, enrollmentId: row.enrollmentId, evaluationType: row.evaluationType,
      value: Number(row.value), percentage: Number(row.percentage), maxValue: Number(row.maxValue),
      observation: row.observation, registeredAt: row.registeredAt, createdAt: row.createdAt, updatedAt: row.updatedAt,
    })
  }

  private toPersistence(g: Grade) {
    return {
      id: g.id, enrollmentId: g.enrollmentId, evaluationType: g.evaluationType,
      value: g.value, percentage: g.percentage, maxValue: g.maxValue,
      observation: g.observation, registeredAt: g.registeredAt,
    }
  }
}
