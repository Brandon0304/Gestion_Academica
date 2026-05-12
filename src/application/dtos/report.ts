export interface GradeEntry {
  evaluationType: string
  value: number
  percentage: number
  maxValue: number
  weightedValue: number
  observation: string | null
  registeredAt: string
}

export interface EnrollmentRecord {
  courseId: string
  courseCode: string
  courseName: string
  academicPeriod: string
  status: string
  finalGrade: number | null
  grades: GradeEntry[]
}

export interface StudentAcademicHistoryOutput {
  studentId: string
  studentName: string
  email: string
  documentId: string
  enrollments: EnrollmentRecord[]
  overallAverage: number | null
}

export interface CourseGradeReportOutput {
  courseId: string
  courseCode: string
  courseName: string
  academicPeriod: string
  teacherName: string
  totalEnrolled: number
  approvedCount: number
  failedCount: number
  withdrawnCount: number
  averageGrade: number | null
  students: {
    studentId: string
    studentName: string
    finalGrade: number | null
    status: string
  }[]
}
