export interface CreateAcademicPeriodInput {
  name: string
  startDate: string
  endDate: string
  enrollmentStart: string
  enrollmentEnd: string
}

export interface UpdateAcademicPeriodInput {
  name?: string
  startDate?: string
  endDate?: string
  enrollmentStart?: string
  enrollmentEnd?: string
  status?: string
}

export interface AcademicPeriodOutput {
  id: string
  name: string
  startDate: string
  endDate: string
  enrollmentStart: string
  enrollmentEnd: string
  status: string
}
