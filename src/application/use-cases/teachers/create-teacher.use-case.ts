import { Teacher } from '../../../domain/entities/teacher.js'
import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { v4 as uuid } from 'uuid'
import type { CreateTeacherInput, TeacherOutput } from '../../dtos/teacher.js'
import type { AuditServicePort } from '../../ports/audit-service.js'

export class CreateTeacherUseCase {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly auditService?: AuditServicePort,
  ) {}

  async execute(input: CreateTeacherInput): Promise<TeacherOutput> {
    const email = new Email(input.email)
    const documentId = new DocumentId(input.documentId)

    const existingEmail = await this.teacherRepository.findByEmail(email)
    if (existingEmail) throw new ConflictError('Ya existe un docente con ese email')
    const existingDoc = await this.teacherRepository.findByDocumentId(documentId)
    if (existingDoc) throw new ConflictError('Ya existe un docente con ese documento')

    const teacher = Teacher.create({
      id: uuid(), firstName: input.firstName, lastName: input.lastName,
      email, documentId, specialty: input.specialty ?? null, degree: input.degree ?? null,
      hireDate: new Date(), status: 'active', createdAt: new Date(), updatedAt: new Date(),
    })
    await this.teacherRepository.save(teacher)

    await this.auditService?.record({ action: 'CREATE', entityType: 'teacher', entityId: teacher.id })

    return this.toOutput(teacher)
  }

  private toOutput(t: Teacher): TeacherOutput {
    return { id: t.id, firstName: t.firstName, lastName: t.lastName, email: t.email.toString(), documentId: t.documentId.toString(), specialty: t.specialty, degree: t.degree, hireDate: t.hireDate.toISOString(), status: t.status }
  }
}
