export interface GradeData {
  id: string
  enrollmentId: string
  evaluationType: string
  value: number
  percentage: number
  maxValue: number
  observation: string | null
  registeredAt: Date
  createdAt: Date
  updatedAt: Date
}

export class Grade {
  private constructor(private data: GradeData) {}

  static create(data: GradeData): Grade {
    if (data.value < 0) throw new Error('La calificación no puede ser negativa')
    if (data.value > data.maxValue) throw new Error(`La calificación no puede exceder ${data.maxValue}`)
    if (data.percentage <= 0 || data.percentage > 100) throw new Error('El porcentaje debe estar entre 1 y 100')
    return new Grade(data)
  }

  get id(): string { return this.data.id }
  get enrollmentId(): string { return this.data.enrollmentId }
  get evaluationType(): string { return this.data.evaluationType }
  get value(): number { return this.data.value }
  get percentage(): number { return this.data.percentage }
  get maxValue(): number { return this.data.maxValue }
  get observation(): string | null { return this.data.observation }
  get registeredAt(): Date { return this.data.registeredAt }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  get weightedValue(): number {
    return (this.data.value / this.data.maxValue) * this.data.percentage
  }

  update(data: { value?: number; percentage?: number; maxValue?: number; observation?: string | null; evaluationType?: string }): Grade {
    const updated = { ...this.data, ...data }
    if (data.value !== undefined && data.value < 0) throw new Error('La calificación no puede ser negativa')
    if ((data.value ?? this.data.value) > (data.maxValue ?? this.data.maxValue)) throw new Error(`La calificación no puede exceder ${data.maxValue ?? this.data.maxValue}`)
    return new Grade(updated)
  }
}
