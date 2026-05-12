import { describe, it, expect, beforeEach } from 'vitest'
import { CreateTeacherUseCase } from './create-teacher.use-case.js'
import { GetTeacherUseCase } from './get-teacher.use-case.js'
import { InMemoryTeacherRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-teacher.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('GetTeacherUseCase', () => {
  let repo: InMemoryTeacherRepository
  let getUseCase: GetTeacherUseCase
  let createUseCase: CreateTeacherUseCase

  beforeEach(() => {
    repo = new InMemoryTeacherRepository()
    getUseCase = new GetTeacherUseCase(repo)
    createUseCase = new CreateTeacherUseCase(repo)
  })

  it('should return teacher when found', async () => {
    const created = await createUseCase.execute({ firstName: 'Carlos', lastName: 'López', email: 'carlos@test.com', documentId: 'DOC-10001' })
    const result = await getUseCase.execute(created.id)
    expect(result.firstName).toBe('Carlos')
    expect(result.email).toBe('carlos@test.com')
  })

  it('should throw NotFoundError for non-existent id', async () => {
    await expect(getUseCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })
})
