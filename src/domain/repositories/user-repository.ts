import { User } from '../entities/user.js'
import { Email } from '../value-objects/email.js'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
  findAll(page: number, pageSize: number): Promise<{ users: User[]; total: number }>
  save(user: User): Promise<void>
  update(user: User): Promise<void>
  linkStudent(userId: string, studentId: string): Promise<void>
  linkTeacher(userId: string, teacherId: string): Promise<void>
}
