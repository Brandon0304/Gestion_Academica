import type { StudyPlanRepository } from '../../../../domain/repositories/study-plan-repository.js'
import { StudyPlan } from '../../../../domain/entities/study-plan.js'

export class InMemoryStudyPlanRepository implements StudyPlanRepository {
  private items: Map<string, StudyPlan> = new Map()

  async findById(id: string): Promise<StudyPlan | null> {
    return this.items.get(id) ?? null
  }

  async findByCode(code: string): Promise<StudyPlan | null> {
    for (const s of this.items.values()) {
      if (s.code === code) return s
    }
    return null
  }

  async findAll(page: number, pageSize: number): Promise<{ studyPlans: StudyPlan[]; total: number }> {
    const all = Array.from(this.items.values())
    const total = all.length
    const studyPlans = all.slice((page - 1) * pageSize, page * pageSize)
    return { studyPlans, total }
  }

  async save(s: StudyPlan): Promise<void> { this.items.set(s.id, s) }
  async update(s: StudyPlan): Promise<void> { this.items.set(s.id, s) }
  async delete(id: string): Promise<void> { this.items.delete(id) }

  clear(): void { this.items.clear() }
}
