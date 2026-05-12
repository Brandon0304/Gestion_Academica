import { Classroom } from '../../../domain/entities/classroom.js'
import type { ClassroomRepository } from '../../../domain/repositories/classroom-repository.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { v4 as uuid } from 'uuid'
import type { CreateClassroomInput, ClassroomOutput } from '../../dtos/classroom.js'

export class CreateClassroomUseCase {
  constructor(private readonly repository: ClassroomRepository) {}
  async execute(input: CreateClassroomInput): Promise<ClassroomOutput> {
    const existing = await this.repository.findByCode(input.code)
    if (existing) throw new ConflictError('Ya existe un aula con ese código')

    const classroom = Classroom.create({
      id: uuid(), code: input.code, name: input.name ?? null, capacity: input.capacity,
      type: (input.type as Classroom['type']) ?? 'classroom', location: input.location ?? null,
      createdAt: new Date(), updatedAt: new Date(),
    })
    await this.repository.save(classroom)
    return this.toOutput(classroom)
  }

  private toOutput(c: Classroom): ClassroomOutput {
    return { id: c.id, code: c.code, name: c.name, capacity: c.capacity, type: c.type, location: c.location }
  }
}
