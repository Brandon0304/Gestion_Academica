import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import type { StudentOutput, PaginatedOutput } from '../../dtos/student.js'

export class ListStudentsUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(page: number, pageSize: number): Promise<PaginatedOutput<StudentOutput>> {
    const { students, total } = await this.studentRepository.findAll(page, pageSize)

    return {
      data: students.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email.toString(),
        documentId: s.documentId.toString(),
        birthDate: s.birthDate?.toISOString() ?? null,
        phone: s.phone,
        address: s.address,
        enrollmentDate: s.enrollmentDate.toISOString(),
        status: s.status,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }
}
