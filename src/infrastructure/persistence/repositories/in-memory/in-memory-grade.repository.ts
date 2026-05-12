import type { GradeRepository } from '../../../../domain/repositories/grade-repository.js'
import { Grade } from '../../../../domain/entities/grade.js'

export class InMemoryGradeRepository implements GradeRepository {
  private items: Map<string, Grade> = new Map()

  async findById(id: string) { return this.items.get(id) ?? null }
  async findByEnrollment(enrollmentId: string) { return Array.from(this.items.values()).filter((g) => g.enrollmentId === enrollmentId) }
  async findByCourse(_courseId: string) { return Array.from(this.items.values()) }
  async save(g: Grade) { this.items.set(g.id, g) }
  async update(g: Grade) { this.items.set(g.id, g) }
  async delete(id: string) { this.items.delete(id) }

  async sumPercentagesByEnrollment(enrollmentId: string) {
    return Array.from(this.items.values())
      .filter((g) => g.enrollmentId === enrollmentId)
      .reduce((sum, g) => sum + g.percentage, 0)
  }

  async countByEnrollment(enrollmentId: string) {
    return Array.from(this.items.values()).filter((g) => g.enrollmentId === enrollmentId).length
  }

  clear() { this.items.clear() }
}
