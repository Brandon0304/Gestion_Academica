import { describe, it, expect, beforeEach } from 'vitest'
import { CourseGradeReportUseCase } from './course-grade-report.use-case.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { InMemoryTeacherRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-teacher.repository.js'
import { InMemoryAcademicPeriodRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-academic-period.repository.js'
import { Course } from '../../../domain/entities/course.js'
import { Enrollment } from '../../../domain/entities/enrollment.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('CourseGradeReportUseCase', () => {
  let courseRepo: InMemoryCourseRepository
  let enrollmentRepo: InMemoryEnrollmentRepository
  let studentRepo: InMemoryStudentRepository
  let teacherRepo: InMemoryTeacherRepository
  let periodRepo: InMemoryAcademicPeriodRepository
  let useCase: CourseGradeReportUseCase

  beforeEach(() => {
    courseRepo = new InMemoryCourseRepository()
    enrollmentRepo = new InMemoryEnrollmentRepository()
    studentRepo = new InMemoryStudentRepository()
    teacherRepo = new InMemoryTeacherRepository()
    periodRepo = new InMemoryAcademicPeriodRepository()
    useCase = new CourseGradeReportUseCase(courseRepo, enrollmentRepo, studentRepo, teacherRepo, periodRepo)
  })

  it('should throw for non-existent course', async () => {
    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })

  it('should return grade report with student breakdown', async () => {
    const course = Course.create({
      id: 'c-1', code: 'MAT101', name: 'Matemáticas I',
      description: null, credits: 4, maxCapacity: 30,
      subjectId: 'sub-1', teacherId: 't-1', academicPeriodId: 'p-1',
      classroomId: null, schedule: null, status: 'in_progress',
      createdAt: new Date(), updatedAt: new Date(),
    })
    await courseRepo.save(course)

    const e1 = Enrollment.create({
      id: 'e-1', studentId: 's-1', courseId: 'c-1',
      enrollmentDate: new Date(), status: 'approved', finalGrade: 15,
      createdAt: new Date(), updatedAt: new Date(),
    })
    const e2 = Enrollment.create({
      id: 'e-2', studentId: 's-2', courseId: 'c-1',
      enrollmentDate: new Date(), status: 'failed', finalGrade: 8,
      createdAt: new Date(), updatedAt: new Date(),
    })
    const e3 = Enrollment.create({
      id: 'e-3', studentId: 's-3', courseId: 'c-1',
      enrollmentDate: new Date(), status: 'withdrawn', finalGrade: null,
      createdAt: new Date(), updatedAt: new Date(),
    })
    await enrollmentRepo.save(e1)
    await enrollmentRepo.save(e2)
    await enrollmentRepo.save(e3)

    const result = await useCase.execute('c-1')
    expect(result.courseCode).toBe('MAT101')
    expect(result.totalEnrolled).toBe(3)
    expect(result.approvedCount).toBe(1)
    expect(result.failedCount).toBe(1)
    expect(result.withdrawnCount).toBe(1)
    expect(result.averageGrade).toBe(11.5)
  })

  it('should return null average when no grades', async () => {
    const course = Course.create({
      id: 'c-2', code: 'FIS101', name: 'Física I',
      description: null, credits: 4, maxCapacity: 30,
      subjectId: 'sub-2', teacherId: 't-2', academicPeriodId: 'p-2',
      classroomId: null, schedule: null, status: 'open',
      createdAt: new Date(), updatedAt: new Date(),
    })
    await courseRepo.save(course)

    const result = await useCase.execute('c-2')
    expect(result.averageGrade).toBeNull()
    expect(result.totalEnrolled).toBe(0)
  })
})
