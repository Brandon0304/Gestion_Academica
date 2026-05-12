"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Paginated, Enrollment } from "@/lib/types"

export default function GradesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<Paginated<Enrollment>>("/enrollments?pageSize=500")
      .then((res) => {
        setEnrollments(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar las inscripciones")
        setLoading(false)
      })
  }, [])

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher"]}>
      <PageHeader title="Calificaciones" />
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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Estudiante
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Curso
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {enrollments.map((e) => (
                <tr
                  key={e.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                    {e.student
                      ? `${e.student.firstName} ${e.student.lastName}`
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                    {e.course ? e.course.name : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/grades/enrollment/${e.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ver notas
                      </Link>
                      <Link
                        href={`/grades/new?enrollmentId=${e.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Registrar nota
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {enrollments.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    No hay inscripciones registradas
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
