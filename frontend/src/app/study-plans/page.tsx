"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, StudyPlan } from "@/lib/types"

export default function StudyPlansPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<Paginated<StudyPlan>>("/study-plans")
      .then((res) => {
        setPlans(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los planes de estudio")
        setLoading(false)
      })
  }, [])

  const columns = [
    { header: "Código", accessor: (p: StudyPlan) => p.code },
    { header: "Nombre", accessor: (p: StudyPlan) => p.name },
    {
      header: "Créditos Totales",
      accessor: (p: StudyPlan) => p.totalCredits,
    },
    {
      header: "Descripción",
      accessor: (p: StudyPlan) => p.description ?? "-",
    },
    {
      header: "Estado",
      accessor: (p: StudyPlan) => (
        <StatusBadge status={p.isActive ? "active" : "inactive"} />
      ),
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher", "student"]}>
      <PageHeader
        title="Planes de Estudio"
        actionLabel="Nuevo Plan"
        actionHref="/study-plans/new"
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
          data={plans}
          getId={(p) => p.id}
          basePath="/study-plans"
        />
      )}
    </DashboardLayout>
  )
}
