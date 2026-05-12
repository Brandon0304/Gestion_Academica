import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import type { Enrollment } from '../../../domain/entities/enrollment.js'
import type { PaginatedOutput } from '../../dtos/student.js'
import type { EnrollmentOutput } from '../../dtos/enrollment.js'

export class ListEnrollmentsUseCase {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}
  async execute(page: number, pageSize: number, studentId?: string): Promise<PaginatedOutput<EnrollmentOutput>> {
    let enrollments: Enrollment[]
    let total: number
    if (studentId) {
      enrollments = await this.enrollmentRepository.findByStudent(studentId)
      total = enrollments.length
    } else {
      const result = await this.enrollmentRepository.findAll(page, pageSize)
      enrollments = result.enrollments
      total = result.total
    }
    return {
      data: enrollments.map((e) => ({ id: e.id, studentId: e.studentId, courseId: e.courseId, enrollmentDate: e.enrollmentDate.toISOString(), status: e.status, finalGrade: e.finalGrade })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }
}
