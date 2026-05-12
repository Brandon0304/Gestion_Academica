import type { GradeRepository } from '../../../domain/repositories/grade-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class DeleteGradeUseCase {
  constructor(private readonly gradeRepository: GradeRepository) {}
  async execute(id: string): Promise<void> {
    const grade = await this.gradeRepository.findById(id)
    if (!grade) throw new NotFoundError('Calificación')
    await this.gradeRepository.delete(id)
  }
}
