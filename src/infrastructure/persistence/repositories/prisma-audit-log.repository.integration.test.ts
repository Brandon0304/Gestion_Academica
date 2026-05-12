import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaAuditLogRepository } from './prisma-audit-log.repository.js'
import { AuditLog } from '../../../domain/entities/audit-log.js'
import { v4 as uuid } from 'uuid'

describe('PrismaAuditLogRepository (integration)', () => {
  const testId = uuid()
  let prisma: PrismaClient
  let repo: PrismaAuditLogRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    repo = new PrismaAuditLogRepository(prisma)
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.auditLog.delete({ where: { id: testId } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('should save an audit log', async () => {
    const log = AuditLog.create({
      id: testId,
      userId: null,
      action: 'LOGIN',
      entityType: 'User',
      entityId: null,
      metadata: { ip: '127.0.0.1' },
      createdAt: new Date(),
    })
    await repo.save(log)

    const { logs } = await repo.findAll(1, 10)
    const found = logs.find((l) => l.id === testId)
    expect(found).not.toBeUndefined()
    expect(found!.action).toBe('LOGIN')
  })

  it('should return empty result for high page', async () => {
    const { logs, total } = await repo.findAll(9999, 10)
    expect(logs).toHaveLength(0)
    expect(total).toBeGreaterThanOrEqual(0)
  })
})
