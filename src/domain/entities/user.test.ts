import { describe, it, expect } from 'vitest'
import { User } from './user.js'
import { Email } from '../value-objects/email.js'

const makeUser = (role: 'admin' | 'directive' | 'teacher' | 'student' | 'secretary' = 'admin') =>
  User.create({
    id: '1',
    email: new Email('user@academia.edu'),
    passwordHash: 'hash123',
    role,
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('User', () => {
  it('should create a user', () => {
    const u = makeUser('admin')
    expect(u.role).toBe('admin')
    expect(u.isActive).toBe(true)
    expect(u.lastLogin).toBeNull()
  })

  describe('can()', () => {
    it('admin can do anything', () => {
      const u = makeUser('admin')
      expect(u.can('read:all')).toBe(true)
      expect(u.can('write:grades')).toBe(true)
      expect(u.can('whatever')).toBe(true)
    })

    it('directive can read:all and write:reports', () => {
      const u = makeUser('directive')
      expect(u.can('read:all')).toBe(true)
      expect(u.can('write:reports')).toBe(true)
      expect(u.can('write:grades')).toBe(false)
    })

    it('teacher can read:courses and write:grades', () => {
      const u = makeUser('teacher')
      expect(u.can('read:courses')).toBe(true)
      expect(u.can('write:grades')).toBe(true)
      expect(u.can('read:all')).toBe(false)
    })

    it('student can read:own', () => {
      const u = makeUser('student')
      expect(u.can('read:own')).toBe(true)
      expect(u.can('read:courses')).toBe(false)
    })

    it('secretary can read:all, write:students, write:courses', () => {
      const u = makeUser('secretary')
      expect(u.can('read:all')).toBe(true)
      expect(u.can('write:students')).toBe(true)
      expect(u.can('write:courses')).toBe(true)
      expect(u.can('write:grades')).toBe(false)
    })
  })

  it('should record login', () => {
    const u = makeUser()
    const logged = u.recordLogin()
    expect(logged.lastLogin).toBeInstanceOf(Date)
  })

  it('should deactivate', () => {
    const u = makeUser()
    expect(u.deactivate().isActive).toBe(false)
  })

  it('should activate', () => {
    const u = makeUser().deactivate()
    expect(u.activate().isActive).toBe(true)
  })

  it('should change password', () => {
    const u = makeUser()
    const changed = u.changePassword('newHash456')
    expect(changed.passwordHash).toBe('newHash456')
  })

  it('should update role', () => {
    const u = makeUser('student')
    const updated = u.updateInfo({ role: 'teacher' })
    expect(updated.role).toBe('teacher')
    expect(updated.isActive).toBe(true)
  })
})
