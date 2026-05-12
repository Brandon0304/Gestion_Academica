import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCourseUseCase } from './create-course.use-case.js'
import { GetCourseUseCase } from './get-course.use-case.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('GetCourseUseCase', () => {
  let courseRepo: InMemoryCourseRepository
  let enrollmentRepo: InMemoryEnrollmentRepository
  let createUseCase: CreateCourseUseCase
  let getUseCase: GetCourseUseCase

  beforeEach(() => {
    courseRepo = new InMemoryCourseRepository()
    enrollmentRepo = new InMemoryEnrollmentRepository()
    createUseCase = new CreateCourseUseCase(courseRepo)
    getUseCase = new GetCourseUseCase(courseRepo, enrollmentRepo, createUseCase)
  })

  it('should return course when found', async () => {
    const created = await createUseCase.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    const result = await getUseCase.execute(created.id)
    expect(result.id).toBe(created.id)
    expect(result.name).toBe('Matemáticas I')
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(getUseCase.execute('non-existent')).rejects.toThrow(NotFoundError)
  })
})
