import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { TeacherOutput } from '../../dtos/teacher.js'

export class GetTeacherUseCase {
  constructor(private readonly teacherRepository: TeacherRepository) {}
  async execute(id: string): Promise<TeacherOutput> {
    const t = await this.teacherRepository.findById(id)
    if (!t) throw new NotFoundError('Docente')
    return { id: t.id, firstName: t.firstName, lastName: t.lastName, email: t.email.toString(), documentId: t.documentId.toString(), specialty: t.specialty, degree: t.degree, hireDate: t.hireDate.toISOString(), status: t.status }
  }
}
