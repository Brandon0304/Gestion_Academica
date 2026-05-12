export interface SubjectData {
  id: string
  code: string
  name: string
  description: string | null
  credits: number
  theoryHours: number
  practiceHours: number
  studyPlanId: string | null
  createdAt: Date
  updatedAt: Date
}

export class Subject {
  private constructor(private data: SubjectData) {}

  static create(data: SubjectData): Subject {
    return new Subject(data)
  }

  get id(): string { return this.data.id }
  get code(): string { return this.data.code }
  get name(): string { return this.data.name }
  get description(): string | null { return this.data.description }
  get credits(): number { return this.data.credits }
  get theoryHours(): number { return this.data.theoryHours }
  get practiceHours(): number { return this.data.practiceHours }
  get studyPlanId(): string | null { return this.data.studyPlanId }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  updateInfo(data: { name?: string; description?: string; credits?: number; theoryHours?: number; practiceHours?: number; studyPlanId?: string | null }): Subject {
    return new Subject({ ...this.data, ...data })
  }
}
