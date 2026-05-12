"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, Subject } from "@/lib/types"

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<Paginated<Subject>>("/subjects")
      .then((res) => {
        setSubjects(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar las asignaturas")
        setLoading(false)
      })
  }, [])

  const columns = [
    {
      header: "Código",
      accessor: (s: Subject) => s.code,
    },
    {
      header: "Nombre",
      accessor: (s: Subject) => s.name,
    },
    {
      header: "Créditos",
      accessor: (s: Subject) => s.credits,
    },
    {
      header: "Horas",
      accessor: (s: Subject) => s.hours,
    },
    {
      header: "Estado",
      accessor: (s: Subject) => (
        <StatusBadge status={s.isActive ? "active" : "inactive"} />
      ),
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher", "student"]}>
      <PageHeader
        title="Asignaturas"
        actionLabel="Nueva Asignatura"
        actionHref="/subjects/new"
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
          data={subjects}
          getId={(s) => s.id}
          basePath="/subjects"
        />
      )}
    </DashboardLayout>
  )
}
