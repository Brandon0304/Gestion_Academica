export interface CreateStudentInput {
  firstName: string
  lastName: string
  email: string
  documentId: string
  birthDate?: string
  phone?: string
  address?: string
  password?: string
}

export interface UpdateStudentInput {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
}

export interface StudentOutput {
  id: string
  firstName: string
  lastName: string
  email: string
  documentId: string
  birthDate: string | null
  phone: string | null
  address: string | null
  enrollmentDate: string
  status: string
}

export interface PaginatedOutput<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
