"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, AcademicPeriod } from "@/lib/types"

export default function AcademicPeriodsPage() {
  const [periods, setPeriods] = useState<AcademicPeriod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<Paginated<AcademicPeriod>>("/academic-periods")
      .then((res) => {
        setPeriods(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los períodos académicos")
        setLoading(false)
      })
  }, [])

  const columns = [
    {
      header: "Nombre",
      accessor: (p: AcademicPeriod) => p.name,
    },
    {
      header: "Inicio",
      accessor: (p: AcademicPeriod) =>
        new Date(p.startDate).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "Fin",
      accessor: (p: AcademicPeriod) =>
        new Date(p.endDate).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "Inscripciones Desde",
      accessor: (p: AcademicPeriod) =>
        new Date(p.enrollmentStartDate).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "Inscripciones Hasta",
      accessor: (p: AcademicPeriod) =>
        new Date(p.enrollmentEndDate).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "Estado",
      accessor: (p: AcademicPeriod) => (
        <StatusBadge status={p.isActive ? "active" : "inactive"} />
      ),
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher", "student"]}>
      <PageHeader
        title="Períodos Académicos"
        actionLabel="Nuevo Período"
        actionHref="/academic-periods/new"
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
          data={periods}
          getId={(p) => p.id}
          basePath="/academic-periods"
        />
      )}
    </DashboardLayout>
  )
}
