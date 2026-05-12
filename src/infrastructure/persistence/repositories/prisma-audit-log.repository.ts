import { PrismaClient, Prisma } from '@prisma/client'
import { AuditLog } from '../../../domain/entities/audit-log.js'
import type { AuditLogRepository } from '../../../domain/repositories/audit-log-repository.js'

export class PrismaAuditLogRepository implements AuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(log: AuditLog): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        id: log.id, userId: log.userId, action: log.action,
        entityType: log.entityType, entityId: log.entityId,
        metadata: log.metadata !== null ? log.metadata as Prisma.InputJsonValue : Prisma.DbNull,
      },
    })
  }

  async findAll(page: number, pageSize: number): Promise<{ logs: AuditLog[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count(),
    ])
    return {
      logs: rows.map((r) => AuditLog.create({
        id: r.id, userId: r.userId, action: r.action,
        entityType: r.entityType, entityId: r.entityId,
        metadata: r.metadata as Record<string, unknown> | null,
        createdAt: r.createdAt,
      })),
      total,
    }
  }
}
