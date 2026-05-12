export interface LoginInput {
  email: string
  password: string
}

export interface LoginOutput {
  token: string
  refreshToken: string
  user: {
    id: string
    email: string
    role: string
  }
}

export interface RegisterUserInput {
  email: string
  password: string
  role: 'admin' | 'directive' | 'teacher' | 'student' | 'secretary'
}

export interface RegisterStudentInput {
  firstName: string
  lastName: string
  email: string
  dni: string
  password: string
  phone?: string
  birthDate?: string
}

export interface RefreshTokenOutput {
  token: string
  user: {
    id: string
    email: string
    role: string
  }
}
