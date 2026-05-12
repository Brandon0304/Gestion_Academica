import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCourseUseCase } from './create-course.use-case.js'
import { UpdateCourseUseCase } from './update-course.use-case.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('UpdateCourseUseCase', () => {
  let courseRepo: InMemoryCourseRepository
  let enrollmentRepo: InMemoryEnrollmentRepository
  let createUseCase: CreateCourseUseCase
  let updateUseCase: UpdateCourseUseCase

  beforeEach(() => {
    courseRepo = new InMemoryCourseRepository()
    enrollmentRepo = new InMemoryEnrollmentRepository()
    createUseCase = new CreateCourseUseCase(courseRepo)
    updateUseCase = new UpdateCourseUseCase(courseRepo, enrollmentRepo, createUseCase)
  })

  it('should update course name', async () => {
    const created = await createUseCase.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    const result = await updateUseCase.execute(created.id, { name: 'Matemáticas II' })
    expect(result.name).toBe('Matemáticas II')
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(updateUseCase.execute('non-existent', { name: 'Test' })).rejects.toThrow(NotFoundError)
  })
})
