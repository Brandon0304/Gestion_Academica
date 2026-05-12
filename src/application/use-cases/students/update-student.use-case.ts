import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateStudentInput, StudentOutput } from '../../dtos/student.js'

export class UpdateStudentUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(id: string, input: UpdateStudentInput): Promise<StudentOutput> {
    const student = await this.studentRepository.findById(id)
    if (!student) {
      throw new NotFoundError('Estudiante')
    }

    const updated = student.updatePersonalInfo({
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      address: input.address,
    })

    await this.studentRepository.update(updated)

    return {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email.toString(),
      documentId: updated.documentId.toString(),
      birthDate: updated.birthDate?.toISOString() ?? null,
      phone: updated.phone,
      address: updated.address,
      enrollmentDate: updated.enrollmentDate.toISOString(),
      status: updated.status,
    }
  }
}
