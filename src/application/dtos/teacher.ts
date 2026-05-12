export interface CreateTeacherInput {
  firstName: string
  lastName: string
  email: string
  documentId: string
  specialty?: string
  degree?: string
  password?: string
}

export interface UpdateTeacherInput {
  firstName?: string
  lastName?: string
  specialty?: string
  degree?: string
}

export interface TeacherOutput {
  id: string
  firstName: string
  lastName: string
  email: string
  documentId: string
  specialty: string | null
  degree: string | null
  hireDate: string
  status: string
}
