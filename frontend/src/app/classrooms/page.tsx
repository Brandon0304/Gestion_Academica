"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, Classroom } from "@/lib/types"

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<Paginated<Classroom>>("/classrooms")
      .then((res) => {
        setClassrooms(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar las aulas")
        setLoading(false)
      })
  }, [])

  const columns = [
    { header: "Código", accessor: (c: Classroom) => c.code },
    { header: "Nombre", accessor: (c: Classroom) => c.name },
    { header: "Capacidad", accessor: (c: Classroom) => c.capacity },
    {
      header: "Edificio",
      accessor: (c: Classroom) => c.building ?? "-",
    },
    {
      header: "Piso",
      accessor: (c: Classroom) => (c.floor != null ? c.floor : "-"),
    },
    {
      header: "Estado",
      accessor: (c: Classroom) => (
        <StatusBadge status={c.isActive ? "active" : "inactive"} />
      ),
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher", "student"]}>
      <PageHeader
        title="Aulas"
        actionLabel="Nueva Aula"
        actionHref="/classrooms/new"
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
          data={classrooms}
          getId={(c) => c.id}
          basePath="/classrooms"
        />
      )}
    </DashboardLayout>
  )
}
