export interface CreateClassroomInput {
  code: string
  name?: string
  capacity: number
  type?: string
  location?: string
}

export interface UpdateClassroomInput {
  name?: string
  capacity?: number
  type?: string
  location?: string | null
}

export interface ClassroomOutput {
  id: string
  code: string
  name: string | null
  capacity: number
  type: string
  location: string | null
}
