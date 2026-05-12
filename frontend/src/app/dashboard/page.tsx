"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, Student, Teacher, Course, Enrollment } from "@/lib/types"

export default function DashboardPage() {
  const [stats, setStats] = useState<{ label: string; value: number; color: string }[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      api.get<Paginated<Student>>("/students?pageSize=1"),
      api.get<Paginated<Teacher>>("/teachers?pageSize=1"),
      api.get<Paginated<Course>>("/courses?pageSize=1"),
      api.get<Paginated<Enrollment>>("/enrollments?pageSize=1"),
    ])
      .then(([students, teachers, courses, enrollments]) => {
        setStats([
          { label: "Estudiantes", value: students.pagination.total, color: "bg-blue-500" },
          { label: "Docentes", value: teachers.pagination.total, color: "bg-green-500" },
          { label: "Cursos", value: courses.pagination.total, color: "bg-purple-500" },
          { label: "Inscripciones", value: enrollments.pagination.total, color: "bg-orange-500" },
        ])
      })
      .catch(() => setError("No se pudo conectar con el servidor"))
  }, [])

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher", "student"]}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Panel Principal</h2>
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.color} opacity-20`} />
              </div>
            </div>
          ))}
          {stats.length === 0 && !error && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border bg-white p-6 shadow-sm">
                  <div className="h-4 w-20 rounded bg-slate-200" />
                  <div className="mt-2 h-8 w-16 rounded bg-slate-200" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
