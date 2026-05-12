export interface CreateEnrollmentInput {
  studentId: string
  courseId: string
}

export interface EnrollmentOutput {
  id: string
  studentId: string
  courseId: string
  enrollmentDate: string
  status: string
  finalGrade: number | null
}
