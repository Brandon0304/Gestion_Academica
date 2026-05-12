import { describe, it, expect, beforeEach } from 'vitest'
import { CreateClassroomUseCase } from './create-classroom.use-case.js'
import { InMemoryClassroomRepository } from '../../../infrastructure/persistence/repositories/in-memory/in-memory-classroom.repository.js'
import { ConflictError } from '../../../shared/errors/index.js'

describe('CreateClassroomUseCase', () => {
  let repo: InMemoryClassroomRepository
  let useCase: CreateClassroomUseCase

  beforeEach(() => { repo = new InMemoryClassroomRepository(); useCase = new CreateClassroomUseCase(repo) })

  it('should create classroom', async () => {
    const r = await useCase.execute({ code: 'A-101', name: 'Aula Magna', capacity: 80 })
    expect(r.code).toBe('A-101'); expect(r.capacity).toBe(80); expect(r.type).toBe('classroom')
  })

  it('should throw for duplicate code', async () => {
    await useCase.execute({ code: 'A-101', name: 'Aula Magna', capacity: 80 })
    await expect(useCase.execute({ code: 'A-101', name: 'Aula 101', capacity: 30 })).rejects.toThrow(ConflictError)
  })
})
