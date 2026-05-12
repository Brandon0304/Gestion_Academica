"use client"

import { useAuth } from "@/lib/auth"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold text-slate-800">
        {user?.role === "admin"
          ? "Administración"
          : user?.role === "secretary"
            ? "Secretaría"
            : user?.role === "directive"
              ? "Dirección"
              : user?.role === "teacher"
                ? "Docencia"
                : "Portal Estudiantil"}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {user?.email}
        </span>
        <button
          onClick={logout}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-100"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
