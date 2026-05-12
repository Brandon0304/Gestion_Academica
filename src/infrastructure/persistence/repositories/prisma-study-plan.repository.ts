import { PrismaClient } from '@prisma/client'
import { StudyPlan } from '../../../domain/entities/study-plan.js'
import type { StudyPlanRepository } from '../../../domain/repositories/study-plan-repository.js'

export class PrismaStudyPlanRepository implements StudyPlanRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<StudyPlan | null> {
    const row = await this.prisma.studyPlan.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByCode(code: string): Promise<StudyPlan | null> {
    const row = await this.prisma.studyPlan.findUnique({ where: { code, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findAll(page: number, pageSize: number): Promise<{ studyPlans: StudyPlan[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.studyPlan.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { year: 'desc' },
      }),
      this.prisma.studyPlan.count({ where: { deletedAt: null } }),
    ])
    return { studyPlans: rows.map((r) => this.toDomain(r)), total }
  }

  async save(studyPlan: StudyPlan): Promise<void> {
    await this.prisma.studyPlan.create({ data: this.toPersistence(studyPlan) })
  }

  async update(studyPlan: StudyPlan): Promise<void> {
    await this.prisma.studyPlan.update({
      where: { id: studyPlan.id },
      data: this.toPersistence(studyPlan),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.studyPlan.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  private toDomain(row: {
    id: string; name: string; code: string; description: string | null
    year: number; totalCredits: number; status: string
    createdAt: Date; updatedAt: Date
  }): StudyPlan {
    return StudyPlan.create({
      id: row.id, name: row.name, code: row.code, description: row.description,
      year: row.year, totalCredits: row.totalCredits,
      status: row.status as StudyPlan['status'],
      createdAt: row.createdAt, updatedAt: row.updatedAt,
    })
  }

  private toPersistence(s: StudyPlan) {
    return {
      id: s.id, name: s.name, code: s.code, description: s.description,
      year: s.year, totalCredits: s.totalCredits, status: s.status,
    }
  }
}
