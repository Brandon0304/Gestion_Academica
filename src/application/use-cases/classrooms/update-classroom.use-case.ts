import type { ClassroomRepository } from '../../../domain/repositories/classroom-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateClassroomInput, ClassroomOutput } from '../../dtos/classroom.js'
import type { ClassroomType } from '../../../domain/entities/classroom.js'

export class UpdateClassroomUseCase {
  constructor(private readonly repository: ClassroomRepository) {}
  async execute(id: string, input: UpdateClassroomInput): Promise<ClassroomOutput> {
    const c = await this.repository.findById(id)
    if (!c) throw new NotFoundError('Aula')
    const updated = c.updateInfo({ ...input, type: input.type as ClassroomType | undefined })
    await this.repository.update(updated)
    return { id: updated.id, code: updated.code, name: updated.name, capacity: updated.capacity, type: updated.type, location: updated.location }
  }
}
