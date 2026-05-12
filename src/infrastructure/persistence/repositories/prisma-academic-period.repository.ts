import { PrismaClient } from '@prisma/client'
import { AcademicPeriod } from '../../../domain/entities/academic-period.js'
import type { AcademicPeriodRepository } from '../../../domain/repositories/academic-period-repository.js'

export class PrismaAcademicPeriodRepository implements AcademicPeriodRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<AcademicPeriod | null> {
    const row = await this.prisma.academicPeriod.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findAll(page: number, pageSize: number): Promise<{ periods: AcademicPeriod[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.academicPeriod.findMany({ where: { deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { startDate: 'desc' } }),
      this.prisma.academicPeriod.count({ where: { deletedAt: null } }),
    ])
    return { periods: rows.map((r) => this.toDomain(r)), total }
  }

  async save(period: AcademicPeriod): Promise<void> {
    await this.prisma.academicPeriod.create({ data: { id: period.id, name: period.name, startDate: period.startDate, endDate: period.endDate, enrollmentStart: period.enrollmentStart, enrollmentEnd: period.enrollmentEnd, status: period.status } })
  }

  async update(period: AcademicPeriod): Promise<void> {
    await this.prisma.academicPeriod.update({ where: { id: period.id }, data: { name: period.name, startDate: period.startDate, endDate: period.endDate, enrollmentStart: period.enrollmentStart, enrollmentEnd: period.enrollmentEnd, status: period.status } })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.academicPeriod.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  private toDomain(row: { id: string; name: string; startDate: Date; endDate: Date; enrollmentStart: Date; enrollmentEnd: Date; status: string; createdAt: Date; updatedAt: Date }): AcademicPeriod {
    return AcademicPeriod.create({ id: row.id, name: row.name, startDate: row.startDate, endDate: row.endDate, enrollmentStart: row.enrollmentStart, enrollmentEnd: row.enrollmentEnd, status: row.status as AcademicPeriod['status'], createdAt: row.createdAt, updatedAt: row.updatedAt })
  }
}
