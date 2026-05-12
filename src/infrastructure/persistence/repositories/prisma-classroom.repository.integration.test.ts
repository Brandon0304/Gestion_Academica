import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaClassroomRepository } from './prisma-classroom.repository.js'
import { Classroom } from '../../../domain/entities/classroom.js'
import { v4 as uuid } from 'uuid'

describe('PrismaClassroomRepository (integration)', () => {
  const testId = uuid()
  let prisma: PrismaClient
  let repo: PrismaClassroomRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaClassroomRepository(prisma)
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.classroom.delete({ where: { id: testId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save and find a classroom', async () => {
    const classroom = Classroom.create({
      id: testId,
      code: `ROOM-${testId}`.slice(0, 20),
      name: 'Room 101',
      capacity: 30,
      type: 'classroom',
      location: 'Building A',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await repo.save(classroom)

    const found = await repo.findById(testId)
    expect(found).not.toBeNull()
    expect(found!.code).toBe(classroom.code)
    expect(found!.capacity).toBe(30)
  })

  it('should find classroom by code', async () => {
    const code = `ROOM-${testId}`.slice(0, 20)
    const found = await repo.findByCode(code)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(testId)
  })

  it('should return null for unknown id', async () => {
    const found = await repo.findById(uuid())
    expect(found).toBeNull()
  })
})
