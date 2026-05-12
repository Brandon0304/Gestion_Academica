import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateTeacherInput, TeacherOutput } from '../../dtos/teacher.js'

export class UpdateTeacherUseCase {
  constructor(private readonly teacherRepository: TeacherRepository) {}
  async execute(id: string, input: UpdateTeacherInput): Promise<TeacherOutput> {
    const t = await this.teacherRepository.findById(id)
    if (!t) throw new NotFoundError('Docente')
    const updated = t.updateInfo(input)
    await this.teacherRepository.update(updated)
    return { id: updated.id, firstName: updated.firstName, lastName: updated.lastName, email: updated.email.toString(), documentId: updated.documentId.toString(), specialty: updated.specialty, degree: updated.degree, hireDate: updated.hireDate.toISOString(), status: updated.status }
  }
}
