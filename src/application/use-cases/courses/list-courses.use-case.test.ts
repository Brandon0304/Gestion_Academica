import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCourseUseCase } from './create-course.use-case.js'
import { ListCoursesUseCase } from './list-courses.use-case.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'

describe('ListCoursesUseCase', () => {
  let repo: InMemoryCourseRepository
  let listUseCase: ListCoursesUseCase

  beforeEach(async () => {
    repo = new InMemoryCourseRepository()
    listUseCase = new ListCoursesUseCase(repo)
    const createUseCase = new CreateCourseUseCase(repo)

    for (let i = 0; i < 3; i++) {
      await createUseCase.execute({ code: `C-${i}`, name: `Course ${i}`, credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    }
  })

  it('should list paginated courses', async () => {
    const result = await listUseCase.execute(1, 2)
    expect(result.data).toHaveLength(2)
    expect(result.pagination.total).toBe(3)
    expect(result.pagination.totalPages).toBe(2)
  })

  it('should return empty for page beyond total', async () => {
    const result = await listUseCase.execute(10, 20)
    expect(result.data).toHaveLength(0)
    expect(result.pagination.total).toBe(3)
  })
})
