import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import type { TeacherOutput } from '../../dtos/teacher.js'
import type { PaginatedOutput } from '../../dtos/student.js'

export class ListTeachersUseCase {
  constructor(private readonly teacherRepository: TeacherRepository) {}
  async execute(page: number, pageSize: number): Promise<PaginatedOutput<TeacherOutput>> {
    const { teachers, total } = await this.teacherRepository.findAll(page, pageSize)
    return {
      data: teachers.map((t) => ({ id: t.id, firstName: t.firstName, lastName: t.lastName, email: t.email.toString(), documentId: t.documentId.toString(), specialty: t.specialty, degree: t.degree, hireDate: t.hireDate.toISOString(), status: t.status })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }
}
