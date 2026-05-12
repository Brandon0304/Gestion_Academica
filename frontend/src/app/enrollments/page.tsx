"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, Enrollment } from "@/lib/types"

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<Paginated<Enrollment>>("/enrollments")
      .then((res) => {
        setEnrollments(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar las inscripciones")
        setLoading(false)
      })
  }, [])

  const columns = [
    {
      header: "Estudiante",
      accessor: (e: Enrollment) =>
        e.student ? `${e.student.firstName} ${e.student.lastName}` : "-",
    },
    {
      header: "Curso",
      accessor: (e: Enrollment) => (e.course ? e.course.name : "-"),
    },
    {
      header: "Estado",
      accessor: (e: Enrollment) => (
        <StatusBadge status={e.status} />
      ),
    },
    {
      header: "Fecha",
      accessor: (e: Enrollment) =>
        new Date(e.enrollmentDate).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive"]}>
      <PageHeader
        title="Inscripciones"
        actionLabel="Nueva Inscripción"
        actionHref="/enrollments/new"
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
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {enrollments.map((e) => (
                <tr
                  key={e.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className="whitespace-nowrap px-4 py-3 text-sm text-slate-700"
                    >
                      {col.accessor(e)}
                    </td>
                  ))}
                </tr>
              ))}
              {enrollments.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    No hay registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
