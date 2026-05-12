import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class DeleteStudentUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(id: string): Promise<void> {
    const student = await this.studentRepository.findById(id)
    if (!student) {
      throw new NotFoundError('Estudiante')
    }
    await this.studentRepository.delete(id)
  }
}
