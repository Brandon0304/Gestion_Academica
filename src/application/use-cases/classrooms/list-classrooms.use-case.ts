import type { ClassroomRepository } from '../../../domain/repositories/classroom-repository.js'
import type { ClassroomOutput } from '../../dtos/classroom.js'
import type { PaginatedOutput } from '../../dtos/student.js'

export class ListClassroomsUseCase {
  constructor(private readonly repository: ClassroomRepository) {}
  async execute(page: number, pageSize: number): Promise<PaginatedOutput<ClassroomOutput>> {
    const { classrooms, total } = await this.repository.findAll(page, pageSize)
    return {
      data: classrooms.map((c) => ({ id: c.id, code: c.code, name: c.name, capacity: c.capacity, type: c.type, location: c.location })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }
}
