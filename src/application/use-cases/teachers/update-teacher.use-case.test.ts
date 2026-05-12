import { describe, it, expect, beforeEach } from 'vitest'
import { CreateTeacherUseCase } from './create-teacher.use-case.js'
import { UpdateTeacherUseCase } from './update-teacher.use-case.js'
import { InMemoryTeacherRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-teacher.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('UpdateTeacherUseCase', () => {
  let repo: InMemoryTeacherRepository
  let createUseCase: CreateTeacherUseCase
  let updateUseCase: UpdateTeacherUseCase

  beforeEach(() => {
    repo = new InMemoryTeacherRepository()
    createUseCase = new CreateTeacherUseCase(repo)
    updateUseCase = new UpdateTeacherUseCase(repo)
  })

  it('should update teacher fields', async () => {
    const created = await createUseCase.execute({ firstName: 'Carlos', lastName: 'López', email: 'carlos@test.com', documentId: 'DOC-10001' })
    const updated = await updateUseCase.execute(created.id, { firstName: 'Juan', lastName: 'Pérez', specialty: 'Matemáticas', degree: 'Licenciatura' })
    expect(updated.firstName).toBe('Juan')
    expect(updated.lastName).toBe('Pérez')
    expect(updated.specialty).toBe('Matemáticas')
    expect(updated.degree).toBe('Licenciatura')
  })

  it('should throw NotFoundError for non-existent id', async () => {
    await expect(updateUseCase.execute('nonexistent', { firstName: 'X' })).rejects.toThrow(NotFoundError)
  })
})
