import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { CourseOutput } from '../../dtos/course.js'
import { CreateCourseUseCase } from './create-course.use-case.js'

export class GetCourseUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly mapper: CreateCourseUseCase,
  ) {}

  async execute(id: string): Promise<CourseOutput> {
    const c = await this.courseRepository.findById(id)
    if (!c) throw new NotFoundError('Curso')
    const enrolledCount = await this.enrollmentRepository.countByCourse(id)
    return this.mapper.toOutput(c, enrolledCount)
  }
}
