interface MockUser {
  id: string
  email: string
  role: string
}

export function setMockUser(user: MockUser | null) {
  ;(globalThis as Record<string, unknown>).__mockAuthUser = user
}

export function resetMockUser() {
  ;(globalThis as Record<string, unknown>).__mockAuthUser = null
}
