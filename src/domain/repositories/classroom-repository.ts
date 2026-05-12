import { Classroom } from '../entities/classroom.js'

export interface ClassroomRepository {
  findById(id: string): Promise<Classroom | null>
  findByCode(code: string): Promise<Classroom | null>
  findAll(page: number, pageSize: number): Promise<{ classrooms: Classroom[]; total: number }>
  save(classroom: Classroom): Promise<void>
  update(classroom: Classroom): Promise<void>
  delete(id: string): Promise<void>
}
