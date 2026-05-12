export function toISOStringOrNull(date: Date | null | undefined): string | null {
  if (!date) return null
  return date.toISOString()
}

export function safeToISOString(date: Date | undefined | null, fallback = ''): string {
  if (!date) return fallback
  return date.toISOString()
}
