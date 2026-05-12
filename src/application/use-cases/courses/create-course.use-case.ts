import { Course } from '../../../domain/entities/course.js'
import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import { Schedule } from '../../../domain/value-objects/schedule.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { v4 as uuid } from 'uuid'
import type { CreateCourseInput, CourseOutput } from '../../dtos/course.js'
import type { DayOfWeek } from '../../../domain/value-objects/schedule.js'

export class CreateCourseUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(input: CreateCourseInput): Promise<CourseOutput> {
    const existing = await this.courseRepository.findByCode(input.code)
    if (existing) throw new ConflictError('Ya existe un curso con ese código')

    const schedule = input.schedule
      ? new Schedule(input.schedule.days as DayOfWeek[], input.schedule.startTime, input.schedule.endTime)
      : null

    const course = Course.create({
      id: uuid(), code: input.code, name: input.name, description: input.description ?? null,
      credits: input.credits, maxCapacity: input.maxCapacity,
      subjectId: input.subjectId, teacherId: input.teacherId, academicPeriodId: input.academicPeriodId,
      classroomId: input.classroomId ?? null, schedule, status: 'open',
      createdAt: new Date(), updatedAt: new Date(),
    })
    await this.courseRepository.save(course)
    return { ...this.toOutput(course), enrolledCount: 0 }
  }

  toOutput(c: Course, enrolledCount = 0): CourseOutput {
    return {
      id: c.id, code: c.code, name: c.name, description: c.description,
      credits: c.credits, maxCapacity: c.maxCapacity, enrolledCount,
      subjectId: c.subjectId, teacherId: c.teacherId, academicPeriodId: c.academicPeriodId,
      classroomId: c.classroomId,
      schedule: c.schedule?.toJSON() ?? null,
      status: c.status,
    }
  }
}
