import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { CourseOutput } from '../../dtos/course.js'
import { CreateCourseUseCase } from './create-course.use-case.js'
import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import type { AuditServicePort } from '../../ports/audit-service.js'

export class ChangeCourseStatusUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly mapper: CreateCourseUseCase,
    private readonly auditService?: AuditServicePort,
  ) {}

  async execute(id: string, status: string): Promise<CourseOutput> {
    const c = await this.courseRepository.findById(id)
    if (!c) throw new NotFoundError('Curso')

    const updated = status === 'closed' ? c.close()
      : status === 'in_progress' ? c.start()
      : status === 'finished' ? c.finish()
      : status === 'open' ? c.open()
      : c

    await this.courseRepository.update(updated)
    await this.auditService?.record({ action: `CHANGE_STATUS_TO_${status.toUpperCase()}`, entityType: 'course', entityId: id })
    const enrolledCount = await this.enrollmentRepository.countByCourse(id)
    return this.mapper.toOutput(updated, enrolledCount)
  }
}
