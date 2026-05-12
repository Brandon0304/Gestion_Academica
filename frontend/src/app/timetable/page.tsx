"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { Timetable } from "@/components/Timetable"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Paginated, Student, Teacher } from "@/lib/types"

interface TimetableEntry {
  courseId: string
  courseCode: string
  courseName: string
  teacherName: string
  classroomName: string
  days: string[]
  startTime: string
  endTime: string
}

export default function TimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [viewType, setViewType] = useState<"student" | "teacher">("student")
  const [selectedId, setSelectedId] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    api.get<Paginated<Student>>("/students?pageSize=500").then(r => setStudents(r.data)).catch(() => {})
    api.get<Paginated<Teacher>>("/teachers?pageSize=500").then(r => setTeachers(r.data)).catch(() => {})
  }, [])

  const loadTimetable = () => {
    if (!selectedId) return
    setLoading(true)
    setError("")
    const endpoint = viewType === "student"
      ? `/timetable/students/${selectedId}`
      : `/timetable/teachers/${selectedId}`
    api.get<{ entries: TimetableEntry[] }>(endpoint)
      .then((r) => { setEntries(r.entries); setLoading(false) })
      .catch(() => { setError("No se pudo cargar el horario"); setLoading(false) })
  }

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher", "student"]}>
      <PageHeader title="Horario" description="Vista de horario semanal" />

      <div className="mb-6 flex items-end gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Tipo</label>
          <select value={viewType} onChange={e => { setViewType(e.target.value as "student" | "teacher"); setSelectedId(""); setEntries([]) }}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="student">Estudiante</option>
            <option value="teacher">Docente</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{viewType === "student" ? "Estudiante" : "Docente"}</label>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Seleccionar...</option>
            {(viewType === "student" ? students : teachers).map((p) => (
              <option key={p.id} value={p.id}>
                {"firstName" in p ? `${(p as Student).firstName} ${(p as Student).lastName}` : `${(p as Teacher).firstName} ${(p as Teacher).lastName}`}
              </option>
            ))}
          </select>
        </div>
        <button onClick={loadTimetable} disabled={!selectedId || loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Ver Horario"}
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      <Timetable entries={entries} />
    </DashboardLayout>
  )
}
