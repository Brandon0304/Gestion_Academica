import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaTeacherRepository } from './prisma-teacher.repository.js'
import { Teacher } from '../../../domain/entities/teacher.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'
import { v4 as uuid } from 'uuid'

describe('PrismaTeacherRepository (integration)', () => {
  const testId = uuid()
  let prisma: PrismaClient
  let repo: PrismaTeacherRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaTeacherRepository(prisma)
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.teacher.delete({ where: { id: testId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find a teacher', async () => {
    const email = new Email(`teacher-${testId}@example.com`)
    const docId = new DocumentId(`DOC${testId}`.slice(0, 20))
    const teacher = Teacher.create({
      id: testId,
      firstName: 'Jane',
      lastName: 'Smith',
      email,
      documentId: docId,
      specialty: 'Mathematics',
      degree: 'PhD',
      hireDate: new Date('2020-01-01'),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await repo.save(teacher)

    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.email.toString()).toBe(email.toString())
    expect(found!.documentId.toString()).toBe(docId.toString())
  })

  it('should find teacher by email', async () => {
    const email = new Email(`teacher-${testId}@example.com`)
    const found = await repo.findByEmail(email)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should find teacher by document id', async () => {
    const docId = new DocumentId(`DOC${testId}`.slice(0, 20))
    const found = await repo.findByDocumentId(docId)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
