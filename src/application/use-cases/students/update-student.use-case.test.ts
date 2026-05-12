import { describe, it, expect, beforeEach } from 'vitest'
import { CreateStudentUseCase } from './create-student.use-case.js'
import { UpdateStudentUseCase } from './update-student.use-case.js'
import { InMemoryStudentRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-student.repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

describe('UpdateStudentUseCase', () => {
  let repo: InMemoryStudentRepository
  let createUseCase: CreateStudentUseCase
  let updateUseCase: UpdateStudentUseCase

  beforeEach(() => {
    repo = new InMemoryStudentRepository()
    createUseCase = new CreateStudentUseCase(repo)
    updateUseCase = new UpdateStudentUseCase(repo)
  })

  it('should update student fields', async () => {
    const created = await createUseCase.execute({ firstName: 'Ana', lastName: 'López', email: 'ana@example.com', documentId: 'DNI99999' })
    const updated = await updateUseCase.execute(created.id, { firstName: 'María', lastName: 'García', phone: '123456789', address: 'Calle 123' })
    expect(updated.firstName).toBe('María')
    expect(updated.lastName).toBe('García')
    expect(updated.phone).toBe('123456789')
    expect(updated.address).toBe('Calle 123')
  })

  it('should throw NotFoundError for non-existent id', async () => {
    await expect(updateUseCase.execute('nonexistent', { firstName: 'X' })).rejects.toThrow(NotFoundError)
  })
})
