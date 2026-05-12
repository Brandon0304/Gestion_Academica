export type AcademicPeriodStatus = 'planned' | 'active' | 'closed'

export interface AcademicPeriodData {
  id: string
  name: string
  startDate: Date
  endDate: Date
  enrollmentStart: Date
  enrollmentEnd: Date
  status: AcademicPeriodStatus
  createdAt: Date
  updatedAt: Date
}

export class AcademicPeriod {
  private constructor(private data: AcademicPeriodData) {}

  static create(data: AcademicPeriodData): AcademicPeriod {
    return new AcademicPeriod(data)
  }

  get id(): string { return this.data.id }
  get name(): string { return this.data.name }
  get startDate(): Date { return this.data.startDate }
  get endDate(): Date { return this.data.endDate }
  get enrollmentStart(): Date { return this.data.enrollmentStart }
  get enrollmentEnd(): Date { return this.data.enrollmentEnd }
  get status(): AcademicPeriodStatus { return this.data.status }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  isEnrollmentOpen(): boolean {
    const now = new Date()
    return now >= this.data.enrollmentStart && now <= this.data.enrollmentEnd
  }

  isActive(): boolean {
    const now = new Date()
    return now >= this.data.startDate && now <= this.data.endDate
  }

  open(): AcademicPeriod {
    return new AcademicPeriod({ ...this.data, status: 'active' })
  }

  close(): AcademicPeriod {
    return new AcademicPeriod({ ...this.data, status: 'closed' })
  }
}
