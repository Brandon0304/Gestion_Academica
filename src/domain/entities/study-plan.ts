export type StudyPlanStatus = 'draft' | 'active' | 'replaced'

export interface StudyPlanData {
  id: string
  name: string
  code: string
  description: string | null
  year: number
  totalCredits: number
  status: StudyPlanStatus
  createdAt: Date
  updatedAt: Date
}

export class StudyPlan {
  private constructor(private data: StudyPlanData) {}

  static create(data: StudyPlanData): StudyPlan {
    return new StudyPlan(data)
  }

  get id(): string { return this.data.id }
  get name(): string { return this.data.name }
  get code(): string { return this.data.code }
  get description(): string | null { return this.data.description }
  get year(): number { return this.data.year }
  get totalCredits(): number { return this.data.totalCredits }
  get status(): StudyPlanStatus { return this.data.status }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  activate(): StudyPlan {
    return new StudyPlan({ ...this.data, status: 'active' })
  }

  replace(): StudyPlan {
    return new StudyPlan({ ...this.data, status: 'replaced' })
  }

  updateInfo(data: { name?: string; description?: string | null; year?: number; totalCredits?: number }): StudyPlan {
    return new StudyPlan({ ...this.data, ...data })
  }
}
