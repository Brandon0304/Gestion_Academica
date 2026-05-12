import type { TeacherRepository } from '../../../../domain/repositories/teacher-repository.js'
import { Teacher } from '../../../../domain/entities/teacher.js'
import { Email } from '../../../../domain/value-objects/email.js'
import { DocumentId } from '../../../../domain/value-objects/document-id.js'

export class InMemoryTeacherRepository implements TeacherRepository {
  private items: Map<string, Teacher> = new Map()
  async findById(id: string) { return this.items.get(id) ?? null }
  async findByEmail(email: Email) { for (const t of this.items.values()) { if (t.email.equals(email)) return t } return null }
  async findByDocumentId(doc: DocumentId) { for (const t of this.items.values()) { if (t.documentId.equals(doc)) return t } return null }
  async findByUserId(_userId: string) { return null }
  async findAll(page: number, pageSize: number) { const all = Array.from(this.items.values()); return { teachers: all.slice((page - 1) * pageSize, page * pageSize), total: all.length } }
  async save(t: Teacher) { this.items.set(t.id, t) }
  async update(t: Teacher) { this.items.set(t.id, t) }
  async delete(id: string) { this.items.delete(id) }
  clear() { this.items.clear() }
}
