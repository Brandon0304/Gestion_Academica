export interface CreateCourseInput {
  code: string
  name: string
  description?: string
  credits: number
  maxCapacity: number
  subjectId: string
  teacherId: string
  academicPeriodId: string
  classroomId?: string
  schedule?: { days: string[]; startTime: string; endTime: string }
}

export interface UpdateCourseInput {
  name?: string
  description?: string
  credits?: number
  maxCapacity?: number
  classroomId?: string | null
  schedule?: { days: string[]; startTime: string; endTime: string } | null
}

export interface CourseOutput {
  id: string
  code: string
  name: string
  description: string | null
  credits: number
  maxCapacity: number
  enrolledCount: number
  subjectId: string
  teacherId: string
  academicPeriodId: string
  classroomId: string | null
  schedule: { days: string[]; startTime: string; endTime: string } | null
  status: string
}
