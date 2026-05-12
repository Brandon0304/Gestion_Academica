import { Student } from '../entities/student.js'
import { Email } from '../value-objects/email.js'
import { DocumentId } from '../value-objects/document-id.js'

export interface StudentRepository {
  findById(id: string): Promise<Student | null>
  findByEmail(email: Email): Promise<Student | null>
  findByDocumentId(documentId: DocumentId): Promise<Student | null>
  findByUserId(userId: string): Promise<Student | null>
  findAll(page: number, pageSize: number): Promise<{ students: Student[]; total: number }>
  save(student: Student): Promise<void>
  update(student: Student): Promise<void>
  delete(id: string): Promise<void>
}
