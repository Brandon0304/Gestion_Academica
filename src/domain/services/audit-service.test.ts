import { describe, it, expect, vi } from 'vitest'
import { AuditService } from './audit-service.js'
import type { AuditLogRepository } from '../repositories/audit-log-repository.js'

describe('AuditService', () => {
  const createMockRepo = () => ({
    save: vi.fn().mockResolvedValue(undefined),
    findAll: vi.fn(),
  } as AuditLogRepository)

  it('should record an audit log', async () => {
    const repo = createMockRepo()
    const service = new AuditService(repo)

    await service.record({
      userId: 'user-1',
      action: 'CREATE',
      entityType: 'Student',
      entityId: 'stu-1',
      metadata: { name: 'Juan' },
    })

    expect(repo.save).toHaveBeenCalledTimes(1)
    const savedLog = vi.mocked(repo.save).mock.calls[0]![0]
    expect(savedLog.action).toBe('CREATE')
    expect(savedLog.entityType).toBe('Student')
    expect(savedLog.userId).toBe('user-1')
    expect(savedLog.entityId).toBe('stu-1')
    expect(savedLog.metadata).toEqual({ name: 'Juan' })
  })

  it('should work without optional fields', async () => {
    const repo = createMockRepo()
    const service = new AuditService(repo)

    await service.record({
      action: 'LOGIN',
      entityType: 'User',
    })

    expect(repo.save).toHaveBeenCalledTimes(1)
    const savedLog = vi.mocked(repo.save).mock.calls[0]![0]
    expect(savedLog.userId).toBeNull()
    expect(savedLog.entityId).toBeNull()
    expect(savedLog.metadata).toBeNull()
  })
})
