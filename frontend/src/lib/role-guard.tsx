"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function RoleGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (user && !allowedRoles.includes(user.role)) {
      router.push("/dashboard")
    }
  }, [user, loading, allowedRoles, router])

  if (loading) return null
  if (!user || !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
