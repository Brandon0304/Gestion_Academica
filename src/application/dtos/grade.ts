export interface CreateGradeInput {
  enrollmentId: string
  evaluationType: string
  value: number
  percentage: number
  maxValue?: number
  observation?: string
}

export interface UpdateGradeInput {
  value?: number
  percentage?: number
  maxValue?: number
  observation?: string | null
  evaluationType?: string
}

export interface GradeOutput {
  id: string
  enrollmentId: string
  evaluationType: string
  value: number
  percentage: number
  maxValue: number
  observation: string | null
  registeredAt: string
}
