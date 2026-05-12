export type ClassroomType = 'classroom' | 'laboratory' | 'workshop'

export interface ClassroomData {
  id: string
  code: string
  name: string | null
  capacity: number
  type: ClassroomType
  location: string | null
  createdAt: Date
  updatedAt: Date
}

export class Classroom {
  private constructor(private data: ClassroomData) {}

  static create(data: ClassroomData): Classroom {
    return new Classroom(data)
  }

  get id(): string { return this.data.id }
  get code(): string { return this.data.code }
  get name(): string | null { return this.data.name }
  get capacity(): number { return this.data.capacity }
  get type(): ClassroomType { return this.data.type }
  get location(): string | null { return this.data.location }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  updateInfo(data: { name?: string; capacity?: number; type?: ClassroomType; location?: string | null }): Classroom {
    return new Classroom({ ...this.data, ...data })
  }
}
