import { Teacher } from '../entities/teacher.js'
import { Email } from '../value-objects/email.js'
import { DocumentId } from '../value-objects/document-id.js'

export interface TeacherRepository {
  findById(id: string): Promise<Teacher | null>
  findByEmail(email: Email): Promise<Teacher | null>
  findByDocumentId(documentId: DocumentId): Promise<Teacher | null>
  findByUserId(userId: string): Promise<Teacher | null>
  findAll(page: number, pageSize: number): Promise<{ teachers: Teacher[]; total: number }>
  save(teacher: Teacher): Promise<void>
  update(teacher: Teacher): Promise<void>
  delete(id: string): Promise<void>
}
