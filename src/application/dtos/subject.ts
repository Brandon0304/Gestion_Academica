export interface CreateSubjectInput {
  code: string
  name: string
  description?: string
  credits: number
  theoryHours?: number
  practiceHours?: number
  studyPlanId?: string
}

export interface UpdateSubjectInput {
  name?: string
  description?: string
  credits?: number
  theoryHours?: number
  practiceHours?: number
  studyPlanId?: string | null
}

export interface SubjectOutput {
  id: string
  code: string
  name: string
  description: string | null
  credits: number
  theoryHours: number
  practiceHours: number
  studyPlanId: string | null
}
