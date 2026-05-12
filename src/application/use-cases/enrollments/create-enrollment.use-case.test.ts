import { describe, it, expect, beforeEach } from 'vitest'
import { CreateEnrollmentUseCase } from './create-enrollment.use-case.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { InMemoryAcademicPeriodRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-academic-period.repository.js'
import { InMemorySubjectRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-subject.repository.js'
import { EnrollmentValidator } from '../../../domain/services/enrollment-validator.js'
import { Course } from '../../../domain/entities/course.js'
import { Schedule } from '../../../domain/value-objects/schedule.js'
import { AcademicPeriod } from '../../../domain/entities/academic-period.js'
import { ConflictError } from '../../../shared/errors/index.js'

describe('CreateEnrollmentUseCase', () => {
  let enrollmentRepo: InMemoryEnrollmentRepository
  let courseRepo: InMemoryCourseRepository
  let periodRepo: InMemoryAcademicPeriodRepository
  let subjectRepo: InMemorySubjectRepository
  let useCase: CreateEnrollmentUseCase

  beforeEach(() => {
    enrollmentRepo = new InMemoryEnrollmentRepository()
    courseRepo = new InMemoryCourseRepository()
    periodRepo = new InMemoryAcademicPeriodRepository()
    subjectRepo = new InMemorySubjectRepository()
    const validator = new EnrollmentValidator(periodRepo, courseRepo, enrollmentRepo, subjectRepo)
    useCase = new CreateEnrollmentUseCase(enrollmentRepo, validator)
  })

  const createOpenCourse = async (id: string, schedule?: Schedule) => {
    const course = Course.create({ id, code: `C-${id}`, name: `Course ${id}`, description: null, credits: 4, maxCapacity: 2, subjectId: 's-1', teacherId: 't-1', academicPeriodId: 'per-1', classroomId: null, schedule: schedule ?? null, status: 'open', createdAt: new Date(), updatedAt: new Date() })
    await courseRepo.save(course)
    return course
  }

  const createActivePeriod = async () => {
    const now = new Date()
    const period = AcademicPeriod.create({ id: 'per-1', name: '2026-1', startDate: new Date(now.getTime() - 86400000), endDate: new Date(now.getTime() + 86400000 * 120), enrollmentStart: new Date(now.getTime() - 86400000 * 10), enrollmentEnd: new Date(now.getTime() + 86400000 * 10), status: 'active', createdAt: new Date(), updatedAt: new Date() })
    await periodRepo.save(period)
  }

  it('should enroll student in open course', async () => {
    await createActivePeriod(); await createOpenCourse('course-1')
    const r = await useCase.execute({ studentId: 'student-1', courseId: 'course-1' })
    expect(r.status).toBe('enrolled'); expect(r.studentId).toBe('student-1')
  })

  it('should throw for closed course', async () => {
    await createActivePeriod()
    const course = Course.create({ id: 'course-2', code: 'C-course-2', name: 'Closed', description: null, credits: 4, maxCapacity: 40, subjectId: 's-1', teacherId: 't-1', academicPeriodId: 'per-1', classroomId: null, schedule: null, status: 'closed', createdAt: new Date(), updatedAt: new Date() })
    await courseRepo.save(course)
    await expect(useCase.execute({ studentId: 'student-1', courseId: 'course-2' })).rejects.toThrow(ConflictError)
  })

  it('should throw for duplicate enrollment', async () => {
    await createActivePeriod(); await createOpenCourse('course-3')
    await useCase.execute({ studentId: 'student-1', courseId: 'course-3' })
    await expect(useCase.execute({ studentId: 'student-1', courseId: 'course-3' })).rejects.toThrow(ConflictError)
  })

  it('should throw when course is full', async () => {
    await createActivePeriod(); await createOpenCourse('course-4')
    await enrollmentRepo.save((await import('../../../domain/entities/enrollment.js')).Enrollment.create({
      id: 'e-other', studentId: 'other-student', courseId: 'course-4', enrollmentDate: new Date(), status: 'enrolled', finalGrade: null, createdAt: new Date(), updatedAt: new Date(),
    }))
    await enrollmentRepo.save((await import('../../../domain/entities/enrollment.js')).Enrollment.create({
      id: 'e-other2', studentId: 'other-student2', courseId: 'course-4', enrollmentDate: new Date(), status: 'enrolled', finalGrade: null, createdAt: new Date(), updatedAt: new Date(),
    }))
    await expect(useCase.execute({ studentId: 'student-1', courseId: 'course-4' })).rejects.toThrow(ConflictError)
  })
})
