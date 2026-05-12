import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class DeleteTeacherUseCase {
  constructor(private readonly teacherRepository: TeacherRepository) {}
  async execute(id: string): Promise<void> {
    const t = await this.teacherRepository.findById(id)
    if (!t) throw new NotFoundError('Docente')
    await this.teacherRepository.delete(id)
  }
}
