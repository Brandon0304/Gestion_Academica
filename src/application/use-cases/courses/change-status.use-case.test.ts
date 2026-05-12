import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCourseUseCase } from './create-course.use-case.js'
import { ChangeCourseStatusUseCase } from './change-status.use-case.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { InMemoryEnrollmentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-enrollment.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('ChangeCourseStatusUseCase', () => {
  let courseRepo: InMemoryCourseRepository
  let enrollmentRepo: InMemoryEnrollmentRepository
  let createUseCase: CreateCourseUseCase
  let changeStatusUseCase: ChangeCourseStatusUseCase

  beforeEach(() => {
    courseRepo = new InMemoryCourseRepository()
    enrollmentRepo = new InMemoryEnrollmentRepository()
    createUseCase = new CreateCourseUseCase(courseRepo)
    changeStatusUseCase = new ChangeCourseStatusUseCase(courseRepo, enrollmentRepo, createUseCase)
  })

  it('should change status to closed', async () => {
    const created = await createUseCase.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    const result = await changeStatusUseCase.execute(created.id, 'closed')
    expect(result.status).toBe('closed')
  })

  it('should change status to in_progress', async () => {
    const created = await createUseCase.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    const result = await changeStatusUseCase.execute(created.id, 'in_progress')
    expect(result.status).toBe('in_progress')
  })

  it('should change status to finished', async () => {
    const created = await createUseCase.execute({ code: 'MAT101', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    const result = await changeStatusUseCase.execute(created.id, 'finished')
    expect(result.status).toBe('finished')
  })

  it('should throw NotFoundError for non-existent', async () => {
    await expect(changeStatusUseCase.execute('non-existent', 'closed')).rejects.toThrow(NotFoundError)
  })
})
