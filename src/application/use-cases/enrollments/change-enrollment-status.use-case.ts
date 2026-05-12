import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { EnrollmentOutput } from '../../dtos/enrollment.js'
import type { AuditServicePort } from '../../ports/audit-service.js'

export class ChangeEnrollmentStatusUseCase {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly auditService?: AuditServicePort,
  ) {}
  async execute(id: string, status: string, grade?: number): Promise<EnrollmentOutput> {
    const e = await this.enrollmentRepository.findById(id)
    if (!e) throw new NotFoundError('Inscripción')

    const updated = status === 'withdrawn' ? e.withdraw()
      : status === 'approved' && grade !== undefined ? e.approve(grade)
      : status === 'failed' && grade !== undefined ? e.fail(grade)
      : e

    await this.enrollmentRepository.update(updated)

    if (status === 'withdrawn') {
      await this.auditService?.record({ action: 'WITHDRAW', entityType: 'enrollment', entityId: id })
    }

    return { id: updated.id, studentId: updated.studentId, courseId: updated.courseId, enrollmentDate: updated.enrollmentDate.toISOString(), status: updated.status, finalGrade: updated.finalGrade }
  }
}
