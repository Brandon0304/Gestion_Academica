"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, Teacher } from "@/lib/types"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<Paginated<Teacher>>("/teachers")
      .then((res) => {
        setTeachers(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los docentes")
        setLoading(false)
      })
  }, [])

  const columns = [
    {
      header: "Nombre",
      accessor: (t: Teacher) => `${t.firstName} ${t.lastName}`,
    },
    {
      header: "Email",
      accessor: (t: Teacher) => t.email,
    },
    {
      header: "DNI",
      accessor: (t: Teacher) => t.dni,
    },
    {
      header: "Especialidades",
      accessor: (t: Teacher) => (t.specialties ?? []).join(", "),
    },
    {
      header: "Estado",
      accessor: (t: Teacher) => (
        <StatusBadge status={t.isActive ? "active" : "inactive"} />
      ),
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive"]}>
      <PageHeader
        title="Docentes"
        actionLabel="Nuevo Docente"
        actionHref="/teachers/new"
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
          data={teachers}
          getId={(t) => t.id}
          basePath="/teachers"
        />
      )}
    </DashboardLayout>
  )
}
