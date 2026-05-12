export class DocumentId {
  private readonly value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Document ID cannot be empty')
    }
    const cleaned = value.replace(/\s/g, '')
    if (cleaned.length < 5 || cleaned.length > 20) {
      throw new Error('Document ID must be between 5 and 20 characters')
    }
    this.value = cleaned
  }

  toString(): string {
    return this.value
  }

  equals(other: DocumentId): boolean {
    return this.value === other.value
  }
}
