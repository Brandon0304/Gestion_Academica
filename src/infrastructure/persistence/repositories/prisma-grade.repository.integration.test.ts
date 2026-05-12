import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaGradeRepository } from './prisma-grade.repository.js'
import { Grade } from '../../../domain/entities/grade.js'
import { v4 as uuid } from 'uuid'

describe('PrismaGradeRepository (integration)', () => {
  const testId = uuid()
  const enrollmentId = uuid()
  const studentId = uuid()
  const courseId = uuid()
  const subjectId = uuid()
  const teacherId = uuid()
  const periodId = uuid()
  let prisma: PrismaClient
  let repo: PrismaGradeRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaGradeRepository(prisma)
    await prisma.$connect()

    await prisma.academicPeriod.create({
      data: { id: periodId, name: '2025-I', startDate: new Date('2025-01-01'), endDate: new Date('2025-06-30'), enrollmentStart: new Date('2024-12-01'), enrollmentEnd: new Date('2025-01-15'), status: 'active' },
    })
    await prisma.teacher.create({
      data: { id: teacherId, firstName: 'Jane', lastName: 'Smith', email: `grade-teacher-${testId}@example.com`, documentId: `GTDOC${testId}`.slice(0, 20), hireDate: new Date('2020-01-01'), status: 'active' },
    })
    await prisma.subject.create({
      data: { id: subjectId, code: `GRD-SUBJ-${testId}`.slice(0, 20), name: 'Calculus I', credits: 5, theoryHours: 3, practiceHours: 2 },
    })
    await prisma.student.create({
      data: { id: studentId, firstName: 'John', lastName: 'Doe', email: `grade-student-${testId}@example.com`, documentId: `GSTDOC${testId}`.slice(0, 20), enrollmentDate: new Date(), status: 'active' },
    })
    await prisma.course.create({
      data: { id: courseId, code: `GRD-CRS-${testId}`.slice(0, 20), name: 'Calculus I - Group A', credits: 5, maxCapacity: 30, subjectId, teacherId, academicPeriodId: periodId, status: 'open' },
    })
    await prisma.enrollment.create({
      data: { id: enrollmentId, studentId, courseId, status: 'enrolled' },
    })
  })

  afterAll(async () => {
    await prisma.grade.delete({ where: { id: testId } }).catch(() => {})
    await prisma.enrollment.delete({ where: { id: enrollmentId } }).catch(() => {})
    await prisma.course.delete({ where: { id: courseId } }).catch(() => {})
    await prisma.student.delete({ where: { id: studentId } }).catch(() => {})
    await prisma.subject.delete({ where: { id: subjectId } }).catch(() => {})
    await prisma.teacher.delete({ where: { id: teacherId } }).catch(() => {})
    await prisma.academicPeriod.delete({ where: { id: periodId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find a grade', async () => {
    const grade = Grade.create({
      id: testId, enrollmentId, evaluationType: 'midterm', value: 15, percentage: 30, maxValue: 20,
      observation: 'Good work', registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    })
    await repo.save(grade)
    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.enrollmentId).toBe(enrollmentId)
    expect(found!.value).toBe(15)
  })

  it('should find grades by enrollment', async () => {
    const grades = await repo.findByEnrollment(enrollmentId)
    expect(grades.length).toBeGreaterThanOrEqual(1)
    expect(grades.some((g) => g.id === testId)).toBe(true)
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
