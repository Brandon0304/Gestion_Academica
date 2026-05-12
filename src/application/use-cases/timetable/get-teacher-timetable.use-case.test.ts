import { describe, it, expect, beforeEach } from 'vitest'
import { GetTeacherTimetableUseCase } from './get-teacher-timetable.use-case.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { InMemoryTeacherRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-teacher.repository.js'
import { InMemoryClassroomRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-classroom.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import { Course } from '../../../domain/entities/course.js'
import { Teacher } from '../../../domain/entities/teacher.js'
import { Classroom } from '../../../domain/entities/classroom.js'
import { Schedule } from '../../../domain/value-objects/schedule.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'

describe('GetTeacherTimetableUseCase', () => {
  let courseRepo: InMemoryCourseRepository
  let teacherRepo: InMemoryTeacherRepository
  let classroomRepo: InMemoryClassroomRepository
  let useCase: GetTeacherTimetableUseCase

  beforeEach(() => {
    courseRepo = new InMemoryCourseRepository()
    teacherRepo = new InMemoryTeacherRepository()
    classroomRepo = new InMemoryClassroomRepository()
    useCase = new GetTeacherTimetableUseCase(courseRepo, teacherRepo, classroomRepo)
  })

  it('should return timetable entries for teacher courses with schedule', async () => {
    const teacher = Teacher.create({
      id: 't-1',
      firstName: 'María',
      lastName: 'Gómez',
      email: new Email('maria@example.com'),
      documentId: new DocumentId('87654321'),
      specialty: 'Physics',
      degree: null,
      hireDate: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await teacherRepo.save(teacher)

    const classroom = Classroom.create({
      id: 'cr-1',
      code: 'B202',
      name: 'Lab Física',
      capacity: 25,
      type: 'laboratory',
      location: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await classroomRepo.save(classroom)

    const schedule = new Schedule(['tuesday', 'thursday'], '14:00', '16:00')

    const course = Course.create({
      id: 'course-1',
      code: 'PHYS101',
      name: 'Física I',
      description: null,
      credits: 4,
      maxCapacity: 25,
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

    const result = await useCase.execute('t-1')

    expect(result.entries).toHaveLength(1)
    expect(result.entries[0]).toEqual({
      courseId: 'course-1',
      courseCode: 'PHYS101',
      courseName: 'Física I',
      teacherName: 'María Gómez',
      classroomName: 'Lab Física',
      days: ['tuesday', 'thursday'],
      startTime: '14:00',
      endTime: '16:00',
    })
  })

  it('should throw NotFoundError for non-existent teacher', async () => {
    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })
})
