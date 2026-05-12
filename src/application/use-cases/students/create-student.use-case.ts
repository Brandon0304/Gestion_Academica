import { Student } from '../../../domain/entities/student.js'
import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { v4 as uuid } from 'uuid'
import type { CreateStudentInput, StudentOutput } from '../../dtos/student.js'
import type { AuditServicePort } from '../../ports/audit-service.js'

export class CreateStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly auditService?: AuditServicePort,
  ) {}

  async execute(input: CreateStudentInput): Promise<StudentOutput> {
    const email = new Email(input.email)
    const documentId = new DocumentId(input.documentId)

    const existingEmail = await this.studentRepository.findByEmail(email)
    if (existingEmail) {
      throw new ConflictError('Ya existe un estudiante con ese email')
    }

    const existingDoc = await this.studentRepository.findByDocumentId(documentId)
    if (existingDoc) {
      throw new ConflictError('Ya existe un estudiante con ese documento de identidad')
    }

    const student = Student.create({
      id: uuid(),
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      documentId,
      birthDate: input.birthDate ? new Date(input.birthDate) : null,
      phone: input.phone ?? null,
      address: input.address ?? null,
      enrollmentDate: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.studentRepository.save(student)

    await this.auditService?.record({ action: 'CREATE', entityType: 'student', entityId: student.id })

    return this.toOutput(student)
  }

  private toOutput(student: Student): StudentOutput {
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email.toString(),
      documentId: student.documentId.toString(),
      birthDate: student.birthDate?.toISOString() ?? null,
      phone: student.phone,
      address: student.address,
      enrollmentDate: student.enrollmentDate.toISOString(),
      status: student.status,
    }
  }
}
