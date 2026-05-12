export type EnrollmentStatus = 'enrolled' | 'approved' | 'failed' | 'withdrawn'

export interface EnrollmentData {
  id: string
  studentId: string
  courseId: string
  enrollmentDate: Date
  status: EnrollmentStatus
  finalGrade: number | null
  createdAt: Date
  updatedAt: Date
}

export class Enrollment {
  private constructor(private data: EnrollmentData) {}

  static create(data: EnrollmentData): Enrollment {
    return new Enrollment(data)
  }

  get id(): string { return this.data.id }
  get studentId(): string { return this.data.studentId }
  get courseId(): string { return this.data.courseId }
  get enrollmentDate(): Date { return this.data.enrollmentDate }
  get status(): EnrollmentStatus { return this.data.status }
  get finalGrade(): number | null { return this.data.finalGrade }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  approve(grade: number): Enrollment {
    return new Enrollment({ ...this.data, status: 'approved', finalGrade: grade })
  }

  fail(grade: number): Enrollment {
    return new Enrollment({ ...this.data, status: 'failed', finalGrade: grade })
  }

  withdraw(): Enrollment {
    return new Enrollment({ ...this.data, status: 'withdrawn' })
  }

  isApproved(): boolean {
    return this.data.status === 'approved'
  }
}
