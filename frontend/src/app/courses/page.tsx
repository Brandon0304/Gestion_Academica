"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, Course } from "@/lib/types"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<Paginated<Course>>("/courses")
      .then((res) => {
        setCourses(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los cursos")
        setLoading(false)
      })
  }, [])

  const columns = [
    {
      header: "Código",
      accessor: (c: Course) => c.code,
    },
    {
      header: "Nombre",
      accessor: (c: Course) => c.name,
    },
    {
      header: "Créditos",
      accessor: (c: Course) => c.credits,
    },
    {
      header: "Docente",
      accessor: (c: Course) =>
        c.teacher ? `${c.teacher.firstName} ${c.teacher.lastName}` : "-",
    },
    {
      header: "Estado",
      accessor: (c: Course) => <StatusBadge status={c.status} />,
    },
    {
      header: "Periodo",
      accessor: (c: Course) => c.academicPeriod?.name ?? "-",
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher", "student"]}>
      <PageHeader
        title="Cursos"
        actionLabel="Nuevo Curso"
        actionHref="/courses/new"
      />
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-slate-200"
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={courses}
          getId={(c) => c.id}
          basePath="/courses"
        />
      )}
    </DashboardLayout>
  )
}
