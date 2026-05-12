"use client"

import { Sidebar } from "@/components/Sidebar"
import { Navbar } from "@/components/Navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

export function DashboardLayout({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/dashboard")
    }
  }, [user, allowedRoles, router])

  if (user && allowedRoles && !allowedRoles.includes(user.role)) return null

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">{children}</main>
      </div>
    </div>
  )
}
