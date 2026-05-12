import { Enrollment } from '../../../domain/entities/enrollment.js'
import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import { EnrollmentValidator } from '../../../domain/services/enrollment-validator.js'
import { v4 as uuid } from 'uuid'
import type { CreateEnrollmentInput, EnrollmentOutput } from '../../dtos/enrollment.js'
import type { AuditServicePort } from '../../ports/audit-service.js'
import type { NotificationServicePort } from '../../ports/notification-service.js'

export class CreateEnrollmentUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly enrollmentValidator: EnrollmentValidator,
    private readonly auditService?: AuditServicePort,
    private readonly notificationService?: NotificationServicePort,
  ) {}

  async execute(input: CreateEnrollmentInput): Promise<EnrollmentOutput> {
    await this.enrollmentValidator.validate(input.courseId, input.studentId)

    const enrollment = Enrollment.create({
      id: uuid(), studentId: input.studentId, courseId: input.courseId,
      enrollmentDate: new Date(), status: 'enrolled', finalGrade: null,
      createdAt: new Date(), updatedAt: new Date(),
    })
    await this.enrollmentRepository.save(enrollment)

    await this.auditService?.record({ action: 'CREATE', entityType: 'enrollment', entityId: enrollment.id })

    return {
      id: enrollment.id, studentId: enrollment.studentId, courseId: enrollment.courseId,
      enrollmentDate: enrollment.enrollmentDate.toISOString(),
      status: enrollment.status, finalGrade: enrollment.finalGrade,
    }
  }
}
