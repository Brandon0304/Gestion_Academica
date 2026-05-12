import { Subject } from '../entities/subject.js'

export interface SubjectRepository {
  findById(id: string): Promise<Subject | null>
  findByCode(code: string): Promise<Subject | null>
  findAll(page: number, pageSize: number): Promise<{ subjects: Subject[]; total: number }>
  findPrerequisites(subjectId: string): Promise<Subject[]>
  save(subject: Subject): Promise<void>
  update(subject: Subject): Promise<void>
  delete(id: string): Promise<void>
}
