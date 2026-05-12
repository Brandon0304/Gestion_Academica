import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { EnrollmentOutput } from '../../dtos/enrollment.js'

export class GetEnrollmentUseCase {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}
  async execute(id: string): Promise<EnrollmentOutput> {
    const e = await this.enrollmentRepository.findById(id)
    if (!e) throw new NotFoundError('Inscripción')
    return { id: e.id, studentId: e.studentId, courseId: e.courseId, enrollmentDate: e.enrollmentDate.toISOString(), status: e.status, finalGrade: e.finalGrade }
  }
}
