export interface User {
  id: string
  email: string
  role: string
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Paginated<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  dni: string
  phone?: string
  birthDate: string
  enrollmentDate: string
  isActive: boolean
}

export interface CreateStudentDTO {
  firstName: string
  lastName: string
  email: string
  dni: string
  password: string
  phone?: string
  birthDate: string
}

export interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  dni: string
  phone?: string
  specialties: string[]
  isActive: boolean
}

export interface CreateTeacherDTO {
  firstName: string
  lastName: string
  email: string
  dni: string
  password: string
  phone?: string
  specialties?: string[]
}

export interface Subject {
  id: string
  code: string
  name: string
  credits: number
  hours: number
  description?: string
  isActive: boolean
}

export interface CreateSubjectDTO {
  code: string
  name: string
  credits: number
  hours: number
  description?: string
}

export interface AcademicPeriod {
  id: string
  name: string
  startDate: string
  endDate: string
  enrollmentStartDate: string
  enrollmentEndDate: string
  isActive: boolean
}

export interface CreateAcademicPeriodDTO {
  name: string
  startDate: string
  endDate: string
  enrollmentStartDate: string
  enrollmentEndDate: string
}

export interface Classroom {
  id: string
  code: string
  name: string
  capacity: number
  building?: string
  floor?: number
  isActive: boolean
}

export interface CreateClassroomDTO {
  code: string
  name: string
  capacity: number
  building?: string
  floor?: number
}

export interface Course {
  id: string
  code: string
  name: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  status: string
  schedule: {
    days: string[]
    startTime: string
    endTime: string
  }
  subjectId: string
  teacherId: string
  classroomId: string
  academicPeriodId: string
  subject?: Subject
  teacher?: Teacher
  classroom?: Classroom
  academicPeriod?: AcademicPeriod
}

export interface CreateCourseDTO {
  code: string
  name: string
  credits: number
  maxCapacity: number
  subjectId: string
  teacherId: string
  classroomId: string
  academicPeriodId: string
  schedule: {
    days: string[]
    startTime: string
    endTime: string
  }
}

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  status: string
  enrollmentDate: string
  student?: Student
  course?: Course
}

export interface Grade {
  id: string
  enrollmentId: string
  evaluationType: string
  value: number
  percentage: number
  maxValue: number
  observation?: string
  registeredAt: string
}

export interface CreateGradeDTO {
  enrollmentId: string
  evaluationType: string
  value: number
  percentage: number
  maxValue: number
  observation?: string
}

export interface StudyPlan {
  id: string
  code: string
  name: string
  description?: string
  totalCredits: number
  isActive: boolean
  subjects?: Subject[]
}

export interface CreateStudyPlanDTO {
  code: string
  name: string
  description?: string
  subjectIds?: string[]
}

export interface StudentAcademicHistory {
  studentId: string
  studentName: string
  email: string
  documentId: string
  enrollments: {
    courseId: string
    courseCode: string
    courseName: string
    academicPeriod: string
    status: string
    finalGrade: number | null
    grades: {
      evaluationType: string
      value: number
      percentage: number
      maxValue: number
      weightedValue: number
      observation: string | null
      registeredAt: string
    }[]
  }[]
  overallAverage: number | null
}

export interface CourseGradeReport {
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
