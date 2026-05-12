import { Email } from '../value-objects/email.js'
import { DocumentId } from '../value-objects/document-id.js'

export type TeacherStatus = 'active' | 'inactive'

export interface TeacherData {
  id: string
  firstName: string
  lastName: string
  email: Email
  documentId: DocumentId
  specialty: string | null
  degree: string | null
  hireDate: Date
  status: TeacherStatus
  createdAt: Date
  updatedAt: Date
}

export class Teacher {
  private constructor(private data: TeacherData) {}

  static create(data: TeacherData): Teacher {
    return new Teacher(data)
  }

  get id(): string { return this.data.id }
  get firstName(): string { return this.data.firstName }
  get lastName(): string { return this.data.lastName }
  get fullName(): string { return `${this.data.firstName} ${this.data.lastName}` }
  get email(): Email { return this.data.email }
  get documentId(): DocumentId { return this.data.documentId }
  get specialty(): string | null { return this.data.specialty }
  get degree(): string | null { return this.data.degree }
  get hireDate(): Date { return this.data.hireDate }
  get status(): TeacherStatus { return this.data.status }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  updateInfo(data: { firstName?: string; lastName?: string; specialty?: string; degree?: string }): Teacher {
    return new Teacher({ ...this.data, ...data })
  }

  deactivate(): Teacher {
    return new Teacher({ ...this.data, status: 'inactive' })
  }

  activate(): Teacher {
    return new Teacher({ ...this.data, status: 'active' })
  }
}
