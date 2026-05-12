import type { AuditLogRepository } from '../repositories/audit-log-repository.js'
import { AuditLog } from '../entities/audit-log.js'
import { v4 as uuid } from 'uuid'

export class AuditService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async record(params: {
    userId?: string
    action: string
    entityType: string
    entityId?: string
    metadata?: Record<string, unknown>
  }): Promise<void> {
    const log = AuditLog.create({
      id: uuid(),
      userId: params.userId ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      metadata: params.metadata ?? null,
      createdAt: new Date(),
    })
    await this.auditLogRepository.save(log)
  }
}
