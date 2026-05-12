"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"

const ALL_ITEMS = [
  { label: "Dashboard", href: "/dashboard", roles: ["admin", "secretary", "directive", "teacher", "student"] },
  { label: "Horario", href: "/timetable", roles: ["admin", "secretary", "directive", "teacher", "student"] },
  { label: "Usuarios", href: "/users", roles: ["admin"] },
  { label: "Estudiantes", href: "/students", roles: ["admin", "secretary", "directive", "teacher"] },
  { label: "Docentes", href: "/teachers", roles: ["admin", "secretary", "directive"] },
  { label: "Cursos", href: "/courses", roles: ["admin", "secretary", "directive", "teacher", "student"] },
  { label: "Asignaturas", href: "/subjects", roles: ["admin", "secretary", "directive", "teacher", "student"] },
  { label: "Inscripciones", href: "/enrollments", roles: ["admin", "secretary", "directive"] },
  { label: "Calificaciones", href: "/grades", roles: ["admin", "secretary", "directive", "teacher"] },
  { label: "Períodos", href: "/academic-periods", roles: ["admin", "secretary", "directive", "teacher", "student"] },
  { label: "Aulas", href: "/classrooms", roles: ["admin", "secretary", "directive", "teacher", "student"] },
  { label: "Planes de Estudio", href: "/study-plans", roles: ["admin", "secretary", "directive", "teacher", "student"] },
  { label: "Reportes", href: "/reports", roles: ["admin", "secretary", "directive", "teacher"] },
  { label: "Perfil", href: "/profile", roles: ["admin", "secretary", "directive", "teacher", "student"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = ALL_ITEMS.filter(item => item.roles.includes(user?.role ?? ""))

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">
          G
        </div>
        <span className="text-lg font-semibold">G_Académica</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t border-slate-700 px-4 py-3">
        <p className="text-sm text-slate-400">{user?.email}</p>
        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
      </div>
    </aside>
  )
}
