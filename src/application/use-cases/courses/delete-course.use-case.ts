import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class DeleteCourseUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}
  async execute(id: string): Promise<void> {
    const c = await this.courseRepository.findById(id)
    if (!c) throw new NotFoundError('Curso')
    await this.courseRepository.delete(id)
  }
}
