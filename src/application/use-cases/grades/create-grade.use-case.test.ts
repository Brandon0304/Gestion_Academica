import { describe, it, expect, beforeEach } from 'vitest'
import { CreateGradeUseCase } from './create-grade.use-case.js'
import { InMemoryGradeRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-grade.repository.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { Grade } from '../../../domain/entities/grade.js'

describe('CreateGradeUseCase', () => {
  let repo: InMemoryGradeRepository
  let useCase: CreateGradeUseCase

  beforeEach(() => { repo = new InMemoryGradeRepository(); useCase = new CreateGradeUseCase(repo) })

  it('should create grade', async () => {
    const r = await useCase.execute({ enrollmentId: 'e-1', evaluationType: 'exam', value: 16, percentage: 30 })
    expect(r.evaluationType).toBe('exam'); expect(r.value).toBe(16); expect(r.maxValue).toBe(20)
  })

  it('should throw when percentage sum exceeds 100', async () => {
    await repo.save(Grade.create({
      id: 'g-1', enrollmentId: 'e-1', evaluationType: 'quiz', value: 10, percentage: 80, maxValue: 20,
      observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    }))
    await expect(useCase.execute({ enrollmentId: 'e-1', evaluationType: 'exam', value: 15, percentage: 30 }))
      .rejects.toThrow(ConflictError)
  })

  it('should allow grade when sum equals 100', async () => {
    await repo.save(Grade.create({
      id: 'g-1', enrollmentId: 'e-1', evaluationType: 'quiz', value: 10, percentage: 70, maxValue: 20,
      observation: null, registeredAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    }))
    const r = await useCase.execute({ enrollmentId: 'e-1', evaluationType: 'exam', value: 15, percentage: 30 })
    expect(r.percentage).toBe(30)
  })
})
