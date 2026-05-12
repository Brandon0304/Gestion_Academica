import { describe, it, expect, beforeEach } from 'vitest'
import { GetStudentTimetableUseCase } from './get-student-timetable.use-case.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { InMemoryTeacherRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-teacher.repository.js'
import { InMemoryClassroomRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-classroom.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { Student } from '../../../domain/entities/student.js'
import { Enrollment } from '../../../domain/entities/enrollment.js'
import { Course } from '../../../domain/entities/course.js'
import { Teacher } from '../../../domain/entities/teacher.js'
import { Classroom } from '../../../domain/entities/classroom.js'
import { Schedule } from '../../../domain/value-objects/schedule.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'

describe('GetStudentTimetableUseCase', () => {
  let studentRepo: InMemoryStudentRepository
  let enrollmentRepo: InMemoryEnrollmentRepository
  let courseRepo: InMemoryCourseRepository
  let teacherRepo: InMemoryTeacherRepository
  let classroomRepo: InMemoryClassroomRepository
  let useCase: GetStudentTimetableUseCase

  beforeEach(() => {
    studentRepo = new InMemoryStudentRepository()
    enrollmentRepo = new InMemoryEnrollmentRepository()
    courseRepo = new InMemoryCourseRepository()
    teacherRepo = new InMemoryTeacherRepository()
    classroomRepo = new InMemoryClassroomRepository()
    useCase = new GetStudentTimetableUseCase(studentRepo, enrollmentRepo, courseRepo, teacherRepo, classroomRepo)
  })

  it('should return timetable entries for enrolled courses with schedule', async () => {
    const student = Student.create({
      id: 's-1',
      firstName: 'Ana',
      lastName: 'López',
      email: new Email('ana@example.com'),
      documentId: new DocumentId('12345678'),
      birthDate: null,
      phone: null,
      address: null,
      enrollmentDate: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await studentRepo.save(student)

    const teacher = Teacher.create({
      id: 't-1',
      firstName: 'Carlos',
      lastName: 'Ruiz',
      email: new Email('carlos@example.com'),
      documentId: new DocumentId('87654321'),
      specialty: 'Math',
      degree: null,
      hireDate: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await teacherRepo.save(teacher)

    const classroom = Classroom.create({
      id: 'cr-1',
      code: 'A101',
      name: 'Aula 101',
      capacity: 30,
      type: 'classroom',
      location: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await classroomRepo.save(classroom)

    const schedule = new Schedule(['monday', 'wednesday'], '08:00', '10:00')

    const course = Course.create({
      id: 'course-1',
      code: 'MATH101',
      name: 'Álgebra',
      description: null,
      credits: 4,
      maxCapacity: 30,
      subjectId: 'subj-1',
      teacherId: 't-1',
      academicPeriodId: 'ap-1',
      classroomId: 'cr-1',
      schedule,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await courseRepo.save(course)

    const enrollment = Enrollment.create({
      id: 'e-1',
      studentId: 's-1',
      courseId: 'course-1',
      enrollmentDate: new Date(),
      status: 'enrolled',
      finalGrade: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await enrollmentRepo.save(enrollment)

    const result = await useCase.execute('s-1')

    expect(result.entries).toHaveLength(1)
    expect(result.entries[0]).toEqual({
      courseId: 'course-1',
      courseCode: 'MATH101',
      courseName: 'Álgebra',
      teacherName: 'Carlos Ruiz',
      classroomName: 'Aula 101',
      days: ['monday', 'wednesday'],
      startTime: '08:00',
      endTime: '10:00',
    })
  })

  it('should return empty entries for student with no enrollments', async () => {
    const student = Student.create({
      id: 's-2',
      firstName: 'Luis',
      lastName: 'García',
      email: new Email('luis@example.com'),
      documentId: new DocumentId('11111111'),
      birthDate: null,
      phone: null,
      address: null,
      enrollmentDate: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await studentRepo.save(student)

    const result = await useCase.execute('s-2')

    expect(result.entries).toHaveLength(0)
  })

  it('should throw NotFoundError for non-existent student', async () => {
    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })
})
