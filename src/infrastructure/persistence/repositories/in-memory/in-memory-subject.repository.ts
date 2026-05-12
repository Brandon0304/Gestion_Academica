import type { SubjectRepository } from '../../../../domain/repositories/subject-repository.js'
import { Subject } from '../../../../domain/entities/subject.js'

export class InMemorySubjectRepository implements SubjectRepository {
  private items: Map<string, Subject> = new Map()
  private prereqs: Map<string, string[]> = new Map()
  async findById(id: string) { return this.items.get(id) ?? null }
  async findByCode(code: string) { for (const s of this.items.values()) { if (s.code === code) return s } return null }
  async findAll(page: number, pageSize: number) { const all = Array.from(this.items.values()); return { subjects: all.slice((page - 1) * pageSize, page * pageSize), total: all.length } }
  async findPrerequisites(subjectId: string) { const ids = this.prereqs.get(subjectId) ?? []; return ids.map((id) => this.items.get(id)).filter(Boolean) as Subject[] }
  async save(s: Subject) { this.items.set(s.id, s) }
  async update(s: Subject) { this.items.set(s.id, s) }
  async delete(id: string) { this.items.delete(id) }
  addPrerequisite(subjectId: string, prerequisiteId: string) { const list = this.prereqs.get(subjectId) ?? []; list.push(prerequisiteId); this.prereqs.set(subjectId, list) }
  clear() { this.items.clear(); this.prereqs.clear() }
}
