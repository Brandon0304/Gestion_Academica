export interface UserOutput {
  id: string
  email: string
  role: string
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

export interface UpdateUserInput {
  role?: string
  isActive?: boolean
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
