import type { StudentRepository } from '../../../../domain/repositories/student-repository.js'

import { Student } from '../../../../domain/entities/student.js'
import { Email } from '../../../../domain/value-objects/email.js'
import { DocumentId } from '../../../../domain/value-objects/document-id.js'

export class InMemoryStudentRepository implements StudentRepository {
  private students: Map<string, Student> = new Map()

  async findById(id: string): Promise<Student | null> {
    return this.students.get(id) ?? null
  }

  async findByEmail(email: Email): Promise<Student | null> {
    for (const s of this.students.values()) {
      if (s.email.equals(email)) return s
    }
    return null
  }

  async findByDocumentId(documentId: DocumentId): Promise<Student | null> {
    for (const s of this.students.values()) {
      if (s.documentId.equals(documentId)) return s
    }
    return null
  }

  async findByUserId(_userId: string): Promise<Student | null> {
    return null
  }

  async findAll(page: number, pageSize: number): Promise<{ students: Student[]; total: number }> {
    const all = Array.from(this.students.values())
    const total = all.length
    const start = (page - 1) * pageSize
    const students = all.slice(start, start + pageSize)
    return { students, total }
  }

  async save(student: Student): Promise<void> {
    this.students.set(student.id, student)
  }

  async update(student: Student): Promise<void> {
    this.students.set(student.id, student)
  }

  async delete(id: string): Promise<void> {
    this.students.delete(id)
  }

  clear(): void {
    this.students.clear()
  }
}
