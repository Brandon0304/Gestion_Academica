import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCourseUseCase } from './create-course.use-case.js'
import { InMemoryCourseRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-course.repository.js'
import { ConflictError } from '../../../shared/errors/index.js'

describe('CreateCourseUseCase', () => {
  let repo: InMemoryCourseRepository
  let useCase: CreateCourseUseCase
  beforeEach(() => { repo = new InMemoryCourseRepository(); useCase = new CreateCourseUseCase(repo) })

  it('should create course', async () => {
    const r = await useCase.execute({ code: 'MAT101-2026-1', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    expect(r.code).toBe('MAT101-2026-1'); expect(r.status).toBe('open'); expect(r.enrolledCount).toBe(0)
  })

  it('should throw for duplicate code', async () => {
    await useCase.execute({ code: 'MAT101-2026-1', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: 'subj-1', teacherId: 'tch-1', academicPeriodId: 'per-1' })
    await expect(useCase.execute({ code: 'MAT101-2026-1', name: 'Matemáticas II', credits: 4, maxCapacity: 30, subjectId: 'subj-2', teacherId: 'tch-2', academicPeriodId: 'per-1' })).rejects.toThrow(ConflictError)
  })
})
