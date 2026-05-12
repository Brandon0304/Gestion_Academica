export interface AuditServicePort {
  record(params: { userId?: string; action: string; entityType: string; entityId?: string; metadata?: Record<string, unknown> }): Promise<void>
}
