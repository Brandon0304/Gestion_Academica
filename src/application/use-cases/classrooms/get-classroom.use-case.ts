import type { ClassroomRepository } from '../../../domain/repositories/classroom-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { ClassroomOutput } from '../../dtos/classroom.js'

export class GetClassroomUseCase {
  constructor(private readonly repository: ClassroomRepository) {}
  async execute(id: string): Promise<ClassroomOutput> {
    const c = await this.repository.findById(id)
    if (!c) throw new NotFoundError('Aula')
    return { id: c.id, code: c.code, name: c.name, capacity: c.capacity, type: c.type, location: c.location }
  }
}
