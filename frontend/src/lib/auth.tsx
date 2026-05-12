"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api, setToken, clearToken, setUser, getUser } from "@/lib/api"
import type { User, LoginResponse } from "@/lib/types"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = getUser() as User | null
    if (stored) setUserState(stored)
    setLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<LoginResponse>("/auth/login", { email, password })
      setToken(res.token)
      setUser(res.user)
      setUserState(res.user)
      router.push("/dashboard")
    },
    [router]
  )

  const logout = useCallback(() => {
    clearToken()
    setUserState(null)
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
