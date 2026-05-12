import { Email } from '../value-objects/email.js'

export type UserRole = 'admin' | 'directive' | 'teacher' | 'student' | 'secretary'

export interface UserData {
  id: string
  email: Email
  passwordHash: string
  role: UserRole
  isActive: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

export class User {
  private constructor(private data: UserData) {}

  static create(data: UserData): User {
    return new User(data)
  }

  get id(): string { return this.data.id }
  get email(): Email { return this.data.email }
  get passwordHash(): string { return this.data.passwordHash }
  get role(): UserRole { return this.data.role }
  get isActive(): boolean { return this.data.isActive }
  get lastLogin(): Date | null { return this.data.lastLogin }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  can(permission: string): boolean {
    const permissions: Record<UserRole, string[]> = {
      admin: ['*'],
      directive: ['read:all', 'write:reports'],
      teacher: ['read:courses', 'write:grades'],
      student: ['read:own'],
      secretary: ['read:all', 'write:students', 'write:courses'],
    }
    const rolePermissions = permissions[this.data.role]
    return rolePermissions.includes('*') || rolePermissions.includes(permission)
  }

  recordLogin(): User {
    return new User({ ...this.data, lastLogin: new Date() })
  }

  deactivate(): User {
    return new User({ ...this.data, isActive: false })
  }

  activate(): User {
    return new User({ ...this.data, isActive: true })
  }

  changePassword(newHash: string): User {
    return new User({ ...this.data, passwordHash: newHash, updatedAt: new Date() })
  }

  updateInfo(data: { role?: UserRole; isActive?: boolean }): User {
    return new User({
      ...this.data,
      ...(data.role !== undefined ? { role: data.role } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      updatedAt: new Date(),
    })
  }
}
