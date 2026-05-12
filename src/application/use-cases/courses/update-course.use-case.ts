import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import { Schedule } from '../../../domain/value-objects/schedule.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateCourseInput, CourseOutput } from '../../dtos/course.js'
import type { DayOfWeek } from '../../../domain/value-objects/schedule.js'
import { CreateCourseUseCase } from './create-course.use-case.js'
import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'

export class UpdateCourseUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly mapper: CreateCourseUseCase,
  ) {}

  async execute(id: string, input: UpdateCourseInput): Promise<CourseOutput> {
    const c = await this.courseRepository.findById(id)
    if (!c) throw new NotFoundError('Curso')

    const schedule = input.schedule !== undefined
      ? (input.schedule ? new Schedule(input.schedule.days as DayOfWeek[], input.schedule.startTime, input.schedule.endTime) : null)
      : undefined

    const updated = c.updateInfo({ ...input, schedule })
    await this.courseRepository.update(updated)
    const enrolledCount = await this.enrollmentRepository.countByCourse(id)
    return this.mapper.toOutput(updated, enrolledCount)
  }
}
