import type { ClassroomRepository } from '../../../domain/repositories/classroom-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class DeleteClassroomUseCase {
  constructor(private readonly repository: ClassroomRepository) {}
  async execute(id: string): Promise<void> {
    const c = await this.repository.findById(id)
    if (!c) throw new NotFoundError('Aula')
    await this.repository.delete(id)
  }
}
