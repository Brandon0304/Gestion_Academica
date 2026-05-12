import { PrismaClient } from '@prisma/client'
import { User } from '../../../domain/entities/user.js'
import type { UserRepository } from '../../../domain/repositories/user-repository.js'

import { Email } from '../../../domain/value-objects/email.js'

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id, deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async findAll(page: number, pageSize: number): Promise<{ users: User[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({ where: { deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where: { deletedAt: null } }),
    ])
    return { users: rows.map((r) => this.toDomain(r)), total }
  }

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email: email.toString(), deletedAt: null } })
    return row ? this.toDomain(row) : null
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({ data: this.toPersistence(user) })
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: this.toPersistence(user),
    })
  }

  async linkStudent(userId: string, studentId: string): Promise<void> {
    await this.prisma.studentUser.create({ data: { userId, studentId } })
  }

  async linkTeacher(userId: string, teacherId: string): Promise<void> {
    await this.prisma.teacherUser.create({ data: { userId, teacherId } })
  }

  private toDomain(row: { id: string; email: string; passwordHash: string; role: string; isActive: boolean; lastLogin: Date | null; createdAt: Date; updatedAt: Date }): User {
    return User.create({
      id: row.id,
      email: new Email(row.email),
      passwordHash: row.passwordHash,
      role: row.role as User['role'],
      isActive: row.isActive,
      lastLogin: row.lastLogin,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  private toPersistence(user: User) {
    return {
      id: user.id,
      email: user.email.toString(),
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    }
  }
}
