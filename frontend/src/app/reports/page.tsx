"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { api } from "@/lib/api"
import { downloadCSV } from "@/lib/csv"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Student, Course, StudentAcademicHistory, CourseGradeReport } from "@/lib/types"

export default function ReportsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<{ data: Student[] }>("/students?pageSize=1000"),
      api.get<{ data: Course[] }>("/courses?pageSize=1000"),
    ])
      .then(([studentsRes, coursesRes]) => {
        setStudents(studentsRes.data)
        setCourses(coursesRes.data)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los datos")
        setLoading(false)
      })
  }, [])

  const handleDownloadStudentHistory = async () => {
    if (!selectedStudent) return
    setDownloadLoading("student")
    try {
      const res = await api.get<StudentAcademicHistory>(
        `/reports/students/${selectedStudent}`,
      )
      const rows = res.enrollments.map((e) => ({
        Curso: e.courseName,
        Periodo: e.academicPeriod,
        Estado: e.status,
        "Nota Final": e.finalGrade ?? "-",
      }))
      downloadCSV(rows, `historial-${res.studentName}`)
    } catch {
      setError("No se pudo descargar el reporte")
    } finally {
      setDownloadLoading(null)
    }
  }

  const handleDownloadCourseReport = async () => {
    if (!selectedCourse) return
    setDownloadLoading("course")
    try {
      const res = await api.get<CourseGradeReport>(
        `/reports/courses/${selectedCourse}`,
      )
      const rows = res.students.map((s) => ({
        Estudiante: s.studentName,
        "Nota Final": s.finalGrade ?? "-",
        Estado: s.status,
      }))
      downloadCSV(rows, `calificaciones-${res.courseName}`)
    } catch {
      setError("No se pudo descargar el reporte")
    } finally {
      setDownloadLoading(null)
    }
  }

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher"]}>
      <PageHeader title="Reportes" description="Genera reportes académicos" />
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="mt-4 h-10 rounded bg-slate-200" />
              <div className="mt-3 h-10 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-1 text-lg font-semibold text-slate-800">
              Historial del Estudiante
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              Consulta el historial académico completo de un estudiante
            </p>
            <div className="space-y-3">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar estudiante...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} - {s.dni}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (selectedStudent)
                      router.push(`/reports/students/${selectedStudent}`)
                  }}
                  disabled={!selectedStudent}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  Ver Historial
                </button>
                <button
                  onClick={handleDownloadStudentHistory}
                  disabled={!selectedStudent || downloadLoading === "student"}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  {downloadLoading === "student" ? "..." : "Descargar CSV"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-1 text-lg font-semibold text-slate-800">
              Calificaciones por Curso
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              Reporte de calificaciones de un curso
            </p>
            <div className="space-y-3">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar curso...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.code}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (selectedCourse)
                      router.push(`/reports/courses/${selectedCourse}`)
                  }}
                  disabled={!selectedCourse}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  Ver Reporte
                </button>
                <button
                  onClick={handleDownloadCourseReport}
                  disabled={!selectedCourse || downloadLoading === "course"}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  {downloadLoading === "course" ? "..." : "Descargar CSV"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
