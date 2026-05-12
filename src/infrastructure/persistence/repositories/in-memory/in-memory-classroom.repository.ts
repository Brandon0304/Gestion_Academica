import type { ClassroomRepository } from '../../../../domain/repositories/classroom-repository.js'
import { Classroom } from '../../../../domain/entities/classroom.js'

export class InMemoryClassroomRepository implements ClassroomRepository {
  private items: Map<string, Classroom> = new Map()
  async findById(id: string) { return this.items.get(id) ?? null }
  async findByCode(code: string) { for (const c of this.items.values()) { if (c.code === code) return c } return null }
  async findAll(page: number, pageSize: number) { const all = Array.from(this.items.values()); return { classrooms: all.slice((page - 1) * pageSize, page * pageSize), total: all.length } }
  async save(c: Classroom) { this.items.set(c.id, c) }
  async update(c: Classroom) { this.items.set(c.id, c) }
  async delete(id: string) { this.items.delete(id) }
  clear() { this.items.clear() }
}
