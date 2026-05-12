import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaSubjectRepository } from './prisma-subject.repository.js'
import { Subject } from '../../../domain/entities/subject.js'
import { v4 as uuid } from 'uuid'

describe('PrismaSubjectRepository (integration)', () => {
  const testId = uuid()
  let prisma: PrismaClient
  let repo: PrismaSubjectRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaSubjectRepository(prisma)
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.subject.delete({ where: { id: testId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find a subject', async () => {
    const subject = Subject.create({
      id: testId,
      code: `SUBJ-${testId}`.slice(0, 20),
      name: 'Calculus I',
      description: 'Introduction to calculus',
      credits: 5,
      theoryHours: 3,
      practiceHours: 2,
      studyPlanId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await repo.save(subject)

    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.code).toBe(subject.code)
    expect(found!.name).toBe('Calculus I')
  })

  it('should find subject by code', async () => {
    const code = `SUBJ-${testId}`.slice(0, 20)
    const found = await repo.findByCode(code)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
