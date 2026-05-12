import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaStudentRepository } from './prisma-student.repository.js'
import { Student } from '../../../domain/entities/student.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'
import { v4 as uuid } from 'uuid'

describe('PrismaStudentRepository (integration)', () => {
  const testId = uuid()
  let prisma: PrismaClient
  let repo: PrismaStudentRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaStudentRepository(prisma)
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.student.delete({ where: { id: testId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find a student', async () => {
    const email = new Email(`student-${testId}@example.com`)
    const docId = new DocumentId(`DOC${testId}`.slice(0, 20))
    const student = Student.create({
      id: testId,
      firstName: 'John',
      lastName: 'Doe',
      email,
      documentId: docId,
      birthDate: new Date('2000-01-01'),
      phone: '123456789',
      address: '123 Main St',
      enrollmentDate: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await repo.save(student)

    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.email.toString()).toBe(email.toString())
    expect(found!.documentId.toString()).toBe(docId.toString())
  })

  it('should find student by email', async () => {
    const email = new Email(`student-${testId}@example.com`)
    const found = await repo.findByEmail(email)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should find student by document id', async () => {
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
