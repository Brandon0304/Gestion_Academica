import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaCourseRepository } from './prisma-course.repository.js'
import { Course } from '../../../domain/entities/course.js'
import { Schedule } from '../../../domain/value-objects/schedule.js'
import { v4 as uuid } from 'uuid'

describe('PrismaCourseRepository (integration)', () => {
  const testId = uuid()
  const subjectId = uuid()
  const teacherId = uuid()
  const periodId = uuid()
  let prisma: PrismaClient
  let repo: PrismaCourseRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaCourseRepository(prisma)
    await prisma.$connect()

    await prisma.academicPeriod.create({
      data: { id: periodId, name: '2025-I', startDate: new Date('2025-01-01'), endDate: new Date('2025-06-30'), enrollmentStart: new Date('2024-12-01'), enrollmentEnd: new Date('2025-01-15'), status: 'active' },
    })
    await prisma.teacher.create({
      data: { id: teacherId, firstName: 'Jane', lastName: 'Smith', email: `course-teacher-${testId}@example.com`, documentId: `CTDOC${testId}`.slice(0, 20), hireDate: new Date('2020-01-01'), status: 'active' },
    })
    await prisma.subject.create({
      data: { id: subjectId, code: `CRS-SUBJ-${testId}`.slice(0, 20), name: 'Calculus I', credits: 5, theoryHours: 3, practiceHours: 2 },
    })
  })

  afterAll(async () => {
    await prisma.course.delete({ where: { id: testId } }).catch(() => {})
    await prisma.subject.delete({ where: { id: subjectId } }).catch(() => {})
    await prisma.teacher.delete({ where: { id: teacherId } }).catch(() => {})
    await prisma.academicPeriod.delete({ where: { id: periodId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find a course', async () => {
    const course = Course.create({
      id: testId, code: `CRS-${testId}`.slice(0, 20), name: 'Calculus I - Group A',
      description: 'Morning group', credits: 5, maxCapacity: 30,
      subjectId, teacherId, academicPeriodId: periodId, classroomId: null,
      schedule: new Schedule(['monday', 'wednesday'], '08:00', '10:00'), status: 'open',
      createdAt: new Date(), updatedAt: new Date(),
    })
    await repo.save(course)
    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.code).toBe(course.code)
  })

  it('should find course by code', async () => {
    const code = `CRS-${testId}`.slice(0, 20)
    const found = await repo.findByCode(code)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
