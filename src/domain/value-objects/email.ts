export class Email {
  private readonly value: string

  constructor(email: string) {
    const normalized = email.toLowerCase().trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new Error(`Invalid email: ${email}`)
    }
    this.value = normalized
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
