import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/auth', () => ({
  useAuth: () => ({
    user: (globalThis as Record<string, unknown>).__mockAuthUser as {
      id: string; email: string; role: string
    } | null ?? { id: 'u-1', email: 'admin@test.com', role: 'admin' },
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
