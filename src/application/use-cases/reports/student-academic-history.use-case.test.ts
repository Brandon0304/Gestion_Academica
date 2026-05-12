import { describe, it, expect, beforeEach } from 'vitest'
import { StudentAcademicHistoryUseCase } from './student-academic-history.use-case.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { InMemoryGradeRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-grade.repository.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { InMemoryAcademicPeriodRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-academic-period.repository.js'
import { Student } from '../../../domain/entities/student.js'
import { Enrollment } from '../../../domain/entities/enrollment.js'
import { Grade } from '../../../domain/entities/grade.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('StudentAcademicHistoryUseCase', () => {
  let studentRepo: InMemoryStudentRepository
  let enrollmentRepo: InMemoryEnrollmentRepository
  let gradeRepo: InMemoryGradeRepository
  let courseRepo: InMemoryCourseRepository
  let periodRepo: InMemoryAcademicPeriodRepository
  let useCase: StudentAcademicHistoryUseCase

  beforeEach(() => {
    studentRepo = new InMemoryStudentRepository()
    enrollmentRepo = new InMemoryEnrollmentRepository()
    gradeRepo = new InMemoryGradeRepository()
    courseRepo = new InMemoryCourseRepository()
    periodRepo = new InMemoryAcademicPeriodRepository()
    useCase = new StudentAcademicHistoryUseCase(studentRepo, enrollmentRepo, gradeRepo, courseRepo, periodRepo)
  })

  it('should throw for non-existent student', async () => {
    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })

  it('should return academic history with grades', async () => {
    const student = Student.create({
      id: 's-1', firstName: 'Ana', lastName: 'López',
      email: new Email('ana@test.com'), documentId: new DocumentId('DOC-001'),
      birthDate: null, phone: null, address: null,
      enrollmentDate: new Date(), status: 'active',
      createdAt: new Date(), updatedAt: new Date(),
    })
    await studentRepo.save(student)

    const enrollment = Enrollment.create({
      id: 'e-1', studentId: 's-1', courseId: 'c-1',
      enrollmentDate: new Date(), status: 'approved', finalGrade: 16,
      createdAt: new Date(), updatedAt: new Date(),
    })
    await enrollmentRepo.save(enrollment)

    const grade = Grade.create({
      id: 'g-1', enrollmentId: 'e-1', evaluationType: 'Parcial',
      value: 16, percentage: 100, maxValue: 20,
      observation: null, registeredAt: new Date(),
      createdAt: new Date(), updatedAt: new Date(),
    })
    await gradeRepo.save(grade)

    const result = await useCase.execute('s-1')
    expect(result.studentName).toBe('Ana López')
    expect(result.enrollments).toHaveLength(1)
    expect(result.enrollments[0]?.grades).toHaveLength(1)
    expect(result.overallAverage).toBe(16)
  })

  it('should return null average when no approved courses', async () => {
    const student = Student.create({
      id: 's-2', firstName: 'Luis', lastName: 'Pérez',
      email: new Email('luis@test.com'), documentId: new DocumentId('DOC-002'),
      birthDate: null, phone: null, address: null,
      enrollmentDate: new Date(), status: 'active',
      createdAt: new Date(), updatedAt: new Date(),
    })
    await studentRepo.save(student)

    const enrollment = Enrollment.create({
      id: 'e-2', studentId: 's-2', courseId: 'c-2',
      enrollmentDate: new Date(), status: 'enrolled', finalGrade: null,
      createdAt: new Date(), updatedAt: new Date(),
    })
    await enrollmentRepo.save(enrollment)

    const result = await useCase.execute('s-2')
    expect(result.overallAverage).toBeNull()
  })
})
