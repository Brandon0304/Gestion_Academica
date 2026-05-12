import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { StudentOutput } from '../../dtos/student.js'

export class GetStudentUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(id: string): Promise<StudentOutput> {
    const student = await this.studentRepository.findById(id)
    if (!student) {
      throw new NotFoundError('Estudiante')
    }
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email.toString(),
      documentId: student.documentId.toString(),
      birthDate: student.birthDate?.toISOString() ?? null,
      phone: student.phone,
      address: student.address,
      enrollmentDate: student.enrollmentDate.toISOString(),
      status: student.status,
    }
  }
}
