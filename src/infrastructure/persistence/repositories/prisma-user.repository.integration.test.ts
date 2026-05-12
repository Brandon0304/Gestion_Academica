import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaUserRepository } from './prisma-user.repository.js'
import { User } from '../../../domain/entities/user.js'
import { Email } from '../../../domain/value-objects/email.js'
import { v4 as uuid } from 'uuid'

describe('PrismaUserRepository (integration)', () => {
  const testId = uuid()
  let prisma: PrismaClient
  let repo: PrismaUserRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaUserRepository(prisma)
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.user.delete({ where: { id: testId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find a user', async () => {
    const email = new Email(`test-${testId}@example.com`)
    const user = User.create({
      id: testId, email, passwordHash: 'hash', role: 'admin', isActive: true, lastLogin: null, createdAt: new Date(), updatedAt: new Date(),
    })
    await repo.save(user)

    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.email.toString()).toBe(email.toString())
  })

  it('should find user by email', async () => {
    const email = new Email(`test-${testId}@example.com`)
    const found = await repo.findByEmail(email)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
