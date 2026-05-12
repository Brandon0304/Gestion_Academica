import { AuditLog } from '../entities/audit-log.js'

export interface AuditLogRepository {
  save(log: AuditLog): Promise<void>
  findAll(page: number, pageSize: number): Promise<{ logs: AuditLog[]; total: number }>
}
