import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaAcademicPeriodRepository } from './prisma-academic-period.repository.js'
import { AcademicPeriod } from '../../../domain/entities/academic-period.js'
import { v4 as uuid } from 'uuid'

describe('PrismaAcademicPeriodRepository (integration)', () => {
  const testId = uuid()
  let prisma: PrismaClient
  let repo: PrismaAcademicPeriodRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaAcademicPeriodRepository(prisma)
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.academicPeriod.delete({ where: { id: testId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find an academic period', async () => {
    const period = AcademicPeriod.create({
      id: testId,
      name: '2024-I',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-07-31'),
      enrollmentStart: new Date('2024-02-01'),
      enrollmentEnd: new Date('2024-02-28'),
      status: 'planned',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await repo.save(period)

    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.name).toBe('2024-I')
    expect(found!.status).toBe('planned')
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
