"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { CourseGradeReport } from "@/lib/types"

export default function CourseGradesReportPage() {
  const params = useParams()
  const courseId = params.id as string

  const [data, setData] = useState<CourseGradeReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<CourseGradeReport>(`/reports/courses/${courseId}/grades`)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudo cargar el reporte del curso")
        setLoading(false)
      })
  }, [courseId])

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher"]}>
      <div className="mb-6">
        <Link href="/reports" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Volver a reportes
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-white p-6 shadow-sm">
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-64 rounded bg-slate-200" />
          </div>
          <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
        </div>
      ) : data ? (
        <>
          <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">{data.courseName}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {data.courseCode} &middot; Docente: {data.teacherName} &middot;{" "}
              {data.academicPeriod}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Nota Final</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.students.map((s, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{s.studentName}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                      {s.finalGrade ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Estudiantes</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{data.totalEnrolled}</p>
            </div>
            <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">Aprobados</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{data.approvedCount}</p>
            </div>
            <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">Reprobados</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{data.failedCount}</p>
            </div>
            <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">Promedio</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                {data.averageGrade !== null ? data.averageGrade.toFixed(2) : "-"}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </DashboardLayout>
  )
}
