export interface CreateStudyPlanInput {
  name: string
  code: string
  description?: string
  year: number
  totalCredits: number
}

export interface UpdateStudyPlanInput {
  name?: string
  description?: string | null
  year?: number
  totalCredits?: number
}

export interface StudyPlanOutput {
  id: string
  name: string
  code: string
  description: string | null
  year: number
  totalCredits: number
  status: string
}
