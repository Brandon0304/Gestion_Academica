import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaStudyPlanRepository } from './prisma-study-plan.repository.js'
import { StudyPlan } from '../../../domain/entities/study-plan.js'
import { v4 as uuid } from 'uuid'

describe('PrismaStudyPlanRepository (integration)', () => {
  const testId = uuid()
  let prisma: PrismaClient
  let repo: PrismaStudyPlanRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaStudyPlanRepository(prisma)
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.studyPlan.delete({ where: { id: testId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find a study plan', async () => {
    const plan = StudyPlan.create({
      id: testId,
      name: 'Computer Science 2024',
      code: `CS-${testId}`.slice(0, 20),
      description: 'Computer Science program',
      year: 2024,
      totalCredits: 200,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await repo.save(plan)

    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.name).toBe('Computer Science 2024')
    expect(found!.year).toBe(2024)
  })

  it('should find study plan by code', async () => {
    const code = `CS-${testId}`.slice(0, 20)
    const found = await repo.findByCode(code)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
