"use client"

import { useAuth } from "@/lib/auth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const PUBLIC_PATHS = ["/login", "/register"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user && !PUBLIC_PATHS.includes(pathname)) {
      router.push("/login")
    }
    if (user && pathname === "/login") {
      router.push("/dashboard")
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!user && !PUBLIC_PATHS.includes(pathname)) return null

  return <>{children}</>
}
