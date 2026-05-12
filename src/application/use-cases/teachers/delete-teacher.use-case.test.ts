import { describe, it, expect, beforeEach } from 'vitest'
import { CreateTeacherUseCase } from './create-teacher.use-case.js'
import { DeleteTeacherUseCase } from './delete-teacher.use-case.js'
import { InMemoryTeacherRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-teacher.repository.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

const mockPasswordHasher = {
  hash: async (p: string) => p,
  compare: async (p: string, h: string) => p === h,
}

describe('DeleteTeacherUseCase', () => {
  let repo: InMemoryTeacherRepository
  let createUseCase: CreateTeacherUseCase
  let deleteUseCase: DeleteTeacherUseCase

  beforeEach(() => {
    repo = new InMemoryTeacherRepository()
    createUseCase = new CreateTeacherUseCase(repo, new InMemoryUserRepository(), mockPasswordHasher)
    deleteUseCase = new DeleteTeacherUseCase(repo)
  })

  it('should delete existing teacher', async () => {
    const created = await createUseCase.execute({ firstName: 'Carlos', lastName: 'López', email: 'carlos@test.com', documentId: 'DOC-10001' })
    await deleteUseCase.execute(created.id)
    await expect(deleteUseCase.execute(created.id)).rejects.toThrow(NotFoundError)
  })

  it('should throw NotFoundError for non-existent id', async () => {
    await expect(deleteUseCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })
})
