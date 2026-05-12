import { Schedule } from '../value-objects/schedule.js'

export type CourseStatus = 'open' | 'closed' | 'in_progress' | 'finished'

export interface CourseData {
  id: string
  code: string
  name: string
  description: string | null
  credits: number
  maxCapacity: number
  subjectId: string
  teacherId: string
  academicPeriodId: string
  classroomId: string | null
  schedule: Schedule | null
  status: CourseStatus
  createdAt: Date
  updatedAt: Date
}

export class Course {
  private constructor(private data: CourseData) {}

  static create(data: CourseData): Course {
    return new Course(data)
  }

  get id(): string { return this.data.id }
  get code(): string { return this.data.code }
  get name(): string { return this.data.name }
  get description(): string | null { return this.data.description }
  get credits(): number { return this.data.credits }
  get maxCapacity(): number { return this.data.maxCapacity }
  get subjectId(): string { return this.data.subjectId }
  get teacherId(): string { return this.data.teacherId }
  get academicPeriodId(): string { return this.data.academicPeriodId }
  get classroomId(): string | null { return this.data.classroomId }
  get schedule(): Schedule | null { return this.data.schedule }
  get status(): CourseStatus { return this.data.status }
  get createdAt(): Date { return this.data.createdAt }
  get updatedAt(): Date { return this.data.updatedAt }

  hasAvailableCapacity(enrolledCount: number): boolean {
    return enrolledCount < this.data.maxCapacity
  }

  open(): Course {
    return new Course({ ...this.data, status: 'open' })
  }

  close(): Course {
    return new Course({ ...this.data, status: 'closed' })
  }

  start(): Course {
    return new Course({ ...this.data, status: 'in_progress' })
  }

  finish(): Course {
    return new Course({ ...this.data, status: 'finished' })
  }

  updateInfo(data: { name?: string; description?: string; credits?: number; maxCapacity?: number; classroomId?: string | null; schedule?: Schedule | null }): Course {
    return new Course({ ...this.data, ...data })
  }
}
