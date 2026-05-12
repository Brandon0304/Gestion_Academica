import type { UserRepository } from '../../../../domain/repositories/user-repository.js'

import { User } from '../../../../domain/entities/user.js'
import { Email } from '../../../../domain/value-objects/email.js'

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map()
  private studentLinks: Map<string, string> = new Map()
  private teacherLinks: Map<string, string> = new Map()

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null
  }

  async findAll(page: number, pageSize: number): Promise<{ users: User[]; total: number }> {
    const all = Array.from(this.users.values())
    const total = all.length
    const users = all.slice((page - 1) * pageSize, page * pageSize)
    return { users, total }
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.equals(email)) return user
    }
    return null
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user)
  }

  async update(user: User): Promise<void> {
    this.users.set(user.id, user)
  }

  async linkStudent(userId: string, studentId: string): Promise<void> {
    this.studentLinks.set(userId, studentId)
  }

  async linkTeacher(userId: string, teacherId: string): Promise<void> {
    this.teacherLinks.set(userId, teacherId)
  }

  clear(): void {
    this.users.clear()
    this.studentLinks.clear()
    this.teacherLinks.clear()
  }
}
