export interface AuditLogData {
  id: string
  userId: string | null
  action: string
  entityType: string
  entityId: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
}

export class AuditLog {
  private constructor(private data: AuditLogData) {}

  static create(data: AuditLogData): AuditLog {
    return new AuditLog(data)
  }

  get id(): string { return this.data.id }
  get userId(): string | null { return this.data.userId }
  get action(): string { return this.data.action }
  get entityType(): string { return this.data.entityType }
  get entityId(): string | null { return this.data.entityId }
  get metadata(): Record<string, unknown> | null { return this.data.metadata }
  get createdAt(): Date { return this.data.createdAt }
}
