import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaEnrollmentRepository } from './prisma-enrollment.repository.js'
import { Enrollment } from '../../../domain/entities/enrollment.js'
import { v4 as uuid } from 'uuid'

describe('PrismaEnrollmentRepository (integration)', () => {
  const testId = uuid()
  const studentId = uuid()
  const courseId = uuid()
  const subjectId = uuid()
  const teacherId = uuid()
  const periodId = uuid()
  let prisma: PrismaClient
  let repo: PrismaEnrollmentRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaEnrollmentRepository(prisma)
    await prisma.$connect()

    await prisma.academicPeriod.create({
      data: { id: periodId, name: '2025-I', startDate: new Date('2025-01-01'), endDate: new Date('2025-06-30'), enrollmentStart: new Date('2024-12-01'), enrollmentEnd: new Date('2025-01-15'), status: 'active' },
    })
    await prisma.teacher.create({
      data: { id: teacherId, firstName: 'Jane', lastName: 'Smith', email: `enroll-teacher-${testId}@example.com`, documentId: `ETDOC${testId}`.slice(0, 20), hireDate: new Date('2020-01-01'), status: 'active' },
    })
    await prisma.subject.create({
      data: { id: subjectId, code: `ENR-SUBJ-${testId}`.slice(0, 20), name: 'Calculus I', credits: 5, theoryHours: 3, practiceHours: 2 },
    })
    await prisma.student.create({
      data: { id: studentId, firstName: 'John', lastName: 'Doe', email: `enroll-student-${testId}@example.com`, documentId: `ESTDOC${testId}`.slice(0, 20), enrollmentDate: new Date(), status: 'active' },
    })
    await prisma.course.create({
      data: { id: courseId, code: `ENR-CRS-${testId}`.slice(0, 20), name: 'Calculus I - Group A', credits: 5, maxCapacity: 30, subjectId, teacherId, academicPeriodId: periodId, status: 'open' },
    })
  })

  afterAll(async () => {
    await prisma.enrollment.delete({ where: { id: testId } }).catch(() => {})
    await prisma.course.delete({ where: { id: courseId } }).catch(() => {})
    await prisma.student.delete({ where: { id: studentId } }).catch(() => {})
    await prisma.subject.delete({ where: { id: subjectId } }).catch(() => {})
    await prisma.teacher.delete({ where: { id: teacherId } }).catch(() => {})
    await prisma.academicPeriod.delete({ where: { id: periodId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find an enrollment', async () => {
    const enrollment = Enrollment.create({
      id: testId, studentId, courseId, enrollmentDate: new Date(), status: 'enrolled', finalGrade: null,
      createdAt: new Date(), updatedAt: new Date(),
    })
    await repo.save(enrollment)
    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.studentId).toBe(studentId)
    expect(found!.courseId).toBe(courseId)
  })

  it('should find enrollment by student and course', async () => {
    const found = await repo.findByStudentAndCourse(studentId, courseId)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
