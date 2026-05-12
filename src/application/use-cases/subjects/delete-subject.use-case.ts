import type { SubjectRepository } from '../../../domain/repositories/subject-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class DeleteSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}
  async execute(id: string): Promise<void> {
    const s = await this.subjectRepository.findById(id)
    if (!s) throw new NotFoundError('Asignatura')
    await this.subjectRepository.delete(id)
  }
}
