export function isEnumValue<T extends string>(value: string, enumValues: readonly T[]): value is T {
  return enumValues.includes(value as T)
}

export function assertEnumValue<T extends string>(value: string, enumValues: readonly T[], name: string): T {
  if (!isEnumValue(value, enumValues)) {
    throw new Error(`Valor inválido para ${name}: ${value}`)
  }
  return value
}
