import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import type { PaginatedOutput } from '../../dtos/student.js'
import type { CourseOutput } from '../../dtos/course.js'

export class ListCoursesUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(page: number, pageSize: number, filters?: { academicPeriodId?: string; subjectId?: string; teacherId?: string; status?: string }): Promise<PaginatedOutput<CourseOutput>> {
    const { courses, total } = await this.courseRepository.findAll(page, pageSize, filters)
    return {
      data: courses.map((c) => ({
        id: c.id, code: c.code, name: c.name, description: c.description,
        credits: c.credits, maxCapacity: c.maxCapacity, enrolledCount: c.enrolledCount,
        subjectId: c.subjectId, teacherId: c.teacherId, academicPeriodId: c.academicPeriodId,
        classroomId: c.classroomId, schedule: c.schedule?.toJSON() ?? null,
        status: c.status,
      })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }
}
