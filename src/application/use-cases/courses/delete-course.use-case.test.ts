import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCourseUseCase } from './create-course.use-case.js'
import { DeleteCourseUseCase } from './delete-course.use-case.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('DeleteCourseUseCase', () => {
  let repo: InMemoryCourseRepository
  let createUseCase: CreateCourseUseCase
  let deleteUseCase: DeleteCourseUseCase

  beforeEach(() => {
    repo = new InMemoryCourseRepository()
    createUseCase = new CreateCourseUseCase(repo)
    deleteUseCase = new DeleteCourseUseCase(repo)
  })

  it('should delete existing course', async () => {
    const created = await createUseCase.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    await deleteUseCase.execute(created.id)
    const found = await repo.findById(created.id)
    expect(found).toBeNull()
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(deleteUseCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
