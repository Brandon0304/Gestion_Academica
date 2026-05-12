import { Email } from '../value-objects/email.js'
import { DocumentId } from '../value-objects/document-id.js'

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended'

export interface StudentData {
  id: string
  firstName: string
  lastName: string
  email: Email
  documentId: DocumentId
  birthDate: Date | null
  phone: string | null
  address: string | null
  enrollmentDate: Date
  status: StudentStatus
  createdAt: Date
  updatedAt: Date
}

export class Student {
  private constructor(private data: StudentData) {}

  static create(data: StudentData): Student {
    return new Student(data)
  }

  get id(): string { return this.data.id }
  get firstName(): string { return this.data.firstName }
  get lastName(): string { return this.data.lastName }
  get fullName(): string { return `${this.data.firstName} ${this.data.lastName}` }
  get email(): Email { return this.data.email }
  get documentId(): DocumentId { return this.data.documentId }
  get birthDate(): Date | null { return this.data.birthDate }
  get phone(): string | null { return this.data.phone }
  get address(): string | null { return this.data.address }
  get enrollmentDate(): Date { return this.data.enrollmentDate }
  get status(): StudentStatus { return this.data.status }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  updatePersonalInfo(data: { firstName?: string; lastName?: string; phone?: string; address?: string }): Student {
    return new Student({
      ...this.data,
      ...data,
    })
  }

  suspend(): Student {
    if (this.data.status === 'graduated') {
      throw new Error('Cannot suspend a graduated student')
    }
    return new Student({ ...this.data, status: 'suspended' })
  }

  graduate(): Student {
    return new Student({ ...this.data, status: 'graduated' })
  }

  reactivate(): Student {
    return new Student({ ...this.data, status: 'active' })
  }
}
