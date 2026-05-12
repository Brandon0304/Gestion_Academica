"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/DashboardLayout"
import { api, ApiRequestError } from "@/lib/api"
import type {
  Course,
  CreateCourseDTO,
  Subject,
  Teacher,
  Classroom,
  AcademicPeriod,
  Paginated,
} from "@/lib/types"

interface SelectOption {
  id: string
  label: string
}

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<CreateCourseDTO | null>(null)
  const [daysInput, setDaysInput] = useState("")
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [subjects, setSubjects] = useState<SelectOption[]>([])
  const [teachers, setTeachers] = useState<SelectOption[]>([])
  const [classrooms, setClassrooms] = useState<SelectOption[]>([])
  const [periods, setPeriods] = useState<SelectOption[]>([])
  const [optionsLoading, setOptionsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    Promise.all([
      api.get<Course>(`/courses/${id}`),
      api.get<Paginated<Subject>>("/subjects?pageSize=100"),
      api.get<Paginated<Teacher>>("/teachers?pageSize=100"),
      api.get<Paginated<Classroom>>("/classrooms?pageSize=100"),
      api.get<Paginated<AcademicPeriod>>("/academic-periods?pageSize=100"),
    ])
      .then(([course, subjRes, teacherRes, classroomRes, periodRes]) => {
        if (cancelled) return
        setSubjects(subjRes.data.map((s) => ({ id: s.id, label: `${s.code} - ${s.name}` })))
        setTeachers(teacherRes.data.map((t) => ({ id: t.id, label: `${t.firstName} ${t.lastName}` })))
        setClassrooms(classroomRes.data.map((c) => ({ id: c.id, label: `${c.code} - ${c.name}` })))
        setPeriods(periodRes.data.map((p) => ({ id: p.id, label: p.name })))
        setOptionsLoading(false)

        setData({
          code: course.code,
          name: course.name,
          credits: course.credits,
          maxCapacity: course.maxCapacity,
          subjectId: course.subjectId,
          teacherId: course.teacherId,
          classroomId: course.classroomId,
          academicPeriodId: course.academicPeriodId,
          schedule: course.schedule,
        })
        setDaysInput(course.schedule.days.join(", "))
        setPageLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setError("No se pudieron cargar los datos del curso")
          setPageLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleChange = (field: keyof Omit<CreateCourseDTO, "schedule">) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = field === "credits" || field === "maxCapacity" ? Number(e.target.value) : e.target.value
    setData((prev) => (prev ? { ...prev, [field]: value } : prev))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSelect = (field: keyof Omit<CreateCourseDTO, "schedule" | "code" | "name" | "credits" | "maxCapacity">) => (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setData((prev) => (prev ? { ...prev, [field]: e.target.value } : prev))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDaysInput(val)
    setData((prev) =>
      prev
        ? {
            ...prev,
            schedule: {
              ...prev.schedule,
              days: val.split(",").map((d) => d.trim()).filter(Boolean),
            },
          }
        : prev,
    )
  }

  const handleScheduleChange = (field: "startTime" | "endTime") => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            schedule: { ...prev.schedule, [field]: e.target.value },
          }
        : prev,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setError("")
    setErrors({})
    setLoading(true)
    try {
      await api.put(`/courses/${id}`, data)
      router.push("/courses")
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.error.details) {
          const fieldErrors: Record<string, string> = {}
          for (const d of err.error.details) {
            fieldErrors[d.field] = d.message
          }
          setErrors(fieldErrors)
        }
        setError(err.error.message)
      } else {
        setError("Error de conexión")
      }
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <DashboardLayout allowedRoles={["admin", "secretary"]}>
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-slate-500">Cargando...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout allowedRoles={["admin", "secretary"]}>
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-red-500">No se encontró el curso</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["admin", "secretary"]}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <a
            href="/courses"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Volver a cursos
          </a>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-slate-800">
            Editar curso
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Código
                </label>
                <input
                  type="text"
                  value={data.code}
                  onChange={handleChange("code")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.code && (
                  <p className="mt-1 text-xs text-red-500">{errors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={handleChange("name")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Créditos
                </label>
                <input
                  type="number"
                  value={data.credits || ""}
                  onChange={handleChange("credits")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.credits && (
                  <p className="mt-1 text-xs text-red-500">{errors.credits}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Capacidad máxima
                </label>
                <input
                  type="number"
                  value={data.maxCapacity || ""}
                  onChange={handleChange("maxCapacity")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.maxCapacity && (
                  <p className="mt-1 text-xs text-red-500">{errors.maxCapacity}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Asignatura
              </label>
              <select
                value={data.subjectId}
                onChange={handleSelect("subjectId")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar asignatura</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <p className="mt-1 text-xs text-red-500">{errors.subjectId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Docente
              </label>
              <select
                value={data.teacherId}
                onChange={handleSelect("teacherId")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar docente</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <p className="mt-1 text-xs text-red-500">{errors.teacherId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Aula
              </label>
              <select
                value={data.classroomId}
                onChange={handleSelect("classroomId")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar aula</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.classroomId && (
                <p className="mt-1 text-xs text-red-500">{errors.classroomId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Periodo académico
              </label>
              <select
                value={data.academicPeriodId}
                onChange={handleSelect("academicPeriodId")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar periodo</option>
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              {errors.academicPeriodId && (
                <p className="mt-1 text-xs text-red-500">{errors.academicPeriodId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Horario
              </label>
              <div className="mt-1 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500">
                    Días (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={daysInput}
                    onChange={handleDaysChange}
                    placeholder="Lunes,Miércoles"
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">
                    Hora inicio (HH:mm)
                  </label>
                  <input
                    type="text"
                    value={data.schedule.startTime}
                    onChange={handleScheduleChange("startTime")}
                    placeholder="08:00"
                    required
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">
                    Hora fin (HH:mm)
                  </label>
                  <input
                    type="text"
                    value={data.schedule.endTime}
                    onChange={handleScheduleChange("endTime")}
                    placeholder="10:00"
                    required
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href="/courses"
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                Cancelar
              </a>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
