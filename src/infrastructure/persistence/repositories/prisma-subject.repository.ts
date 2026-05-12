import { PrismaClient } from '@prisma/client'
import { Subject } from '../../../domain/entities/subject.js'
import type { SubjectRepository } from '../../../domain/repositories/subject-repository.js'

export class PrismaSubjectRepository implements SubjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Subject | null> {
    const row = await this.prisma.subject.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findByCode(code: string): Promise<Subject | null> {
    const row = await this.prisma.subject.findUnique({ where: { code, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findAll(page: number, pageSize: number): Promise<{ subjects: Subject[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.subject.findMany({ where: { deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.subject.count({ where: { deletedAt: null } }),
    ])
    return { subjects: rows.map((r) => this.toDomain(r)), total }
  }

  async findPrerequisites(subjectId: string): Promise<Subject[]> {
    const rows = await this.prisma.prerequisite.findMany({
      where: { subjectId, prerequisite: { deletedAt: null } },
      include: { prerequisite: true },
    })
    return rows.map((r) => this.toDomain(r.prerequisite))
  }

  async save(subject: Subject): Promise<void> {
    await this.prisma.subject.create({ data: { id: subject.id, code: subject.code, name: subject.name, description: subject.description, credits: subject.credits, theoryHours: subject.theoryHours, practiceHours: subject.practiceHours, studyPlanId: subject.studyPlanId } })
  }

  async update(subject: Subject): Promise<void> {
    await this.prisma.subject.update({ where: { id: subject.id }, data: { name: subject.name, description: subject.description, credits: subject.credits, theoryHours: subject.theoryHours, practiceHours: subject.practiceHours, studyPlanId: subject.studyPlanId } })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subject.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  private toDomain(row: { id: string; code: string; name: string; description: string | null; credits: number; theoryHours: number; practiceHours: number; studyPlanId: string | null; createdAt: Date; updatedAt: Date }): Subject {
    return Subject.create({ id: row.id, code: row.code, name: row.name, description: row.description, credits: row.credits, theoryHours: row.theoryHours, practiceHours: row.practiceHours, studyPlanId: row.studyPlanId, createdAt: row.createdAt, updatedAt: row.updatedAt })
  }
}
