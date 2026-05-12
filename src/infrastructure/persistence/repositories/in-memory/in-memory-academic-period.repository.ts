import type { AcademicPeriodRepository } from '../../../../domain/repositories/academic-period-repository.js'
import { AcademicPeriod } from '../../../../domain/entities/academic-period.js'

export class InMemoryAcademicPeriodRepository implements AcademicPeriodRepository {
  private items: Map<string, AcademicPeriod> = new Map()
  async findById(id: string) { return this.items.get(id) ?? null }
  async findAll(page: number, pageSize: number) { const all = Array.from(this.items.values()); return { periods: all.slice((page - 1) * pageSize, page * pageSize), total: all.length } }
  async save(p: AcademicPeriod) { this.items.set(p.id, p) }
  async update(p: AcademicPeriod) { this.items.set(p.id, p) }
  async delete(id: string) { this.items.delete(id) }
  clear() { this.items.clear() }
}
