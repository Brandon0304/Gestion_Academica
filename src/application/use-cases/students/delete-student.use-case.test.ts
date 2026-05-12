import { describe, it, expect, beforeEach } from 'vitest'
import { CreateStudentUseCase } from './create-student.use-case.js'
import { DeleteStudentUseCase } from './delete-student.use-case.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-user.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

const mockPasswordHasher = {
  hash: async (p: string) => p,
  compare: async (p: string, h: string) => p === h,
}

describe('DeleteStudentUseCase', () => {
  let repo: InMemoryStudentRepository
  let createUseCase: CreateStudentUseCase
  let deleteUseCase: DeleteStudentUseCase

  beforeEach(() => {
    repo = new InMemoryStudentRepository()
    createUseCase = new CreateStudentUseCase(repo, new InMemoryUserRepository(), mockPasswordHasher)
    deleteUseCase = new DeleteStudentUseCase(repo)
  })

  it('should delete existing student', async () => {
    const created = await createUseCase.execute({ firstName: 'Ana', lastName: 'López', email: 'ana@example.com', documentId: 'DNI99999' })
    await deleteUseCase.execute(created.id)
    await expect(deleteUseCase.execute(created.id)).rejects.toThrow(NotFoundError)
  })

  it('should throw NotFoundError for non-existent id', async () => {
    await expect(deleteUseCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })
})
