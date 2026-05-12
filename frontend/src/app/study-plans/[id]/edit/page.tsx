"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/DashboardLayout"
import { api, ApiRequestError } from "@/lib/api"
import type { Paginated, StudyPlan, Subject } from "@/lib/types"

export default function EditStudyPlanPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [data, setData] = useState({
    code: "",
    name: "",
    description: "",
    subjectIds: [] as string[],
  })
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    void Promise.all([
      api.get<StudyPlan>(`/study-plans/${id}`),
      api.get<Paginated<Subject>>("/subjects?pageSize=500"),
    ])
      .then(([plan, subjectsRes]) => {
        setData({
          code: plan.code,
          name: plan.name,
          description: plan.description ?? "",
          subjectIds: plan.subjects?.map((s) => s.id) ?? [],
        })
        setSubjects(subjectsRes.data)
        setFetching(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los datos")
        setFetching(false)
      })
  }, [id])

  const handleChange =
    (field: keyof typeof data) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

  const toggleSubject = (subjectId: string) => {
    setData((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(subjectId)
        ? prev.subjectIds.filter((s) => s !== subjectId)
        : [...prev.subjectIds, subjectId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrors({})
    setLoading(true)
    try {
      await api.put(`/study-plans/${id}`, data)
      router.push("/study-plans")
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

  if (fetching) {
    return (
      <DashboardLayout allowedRoles={["admin"]}>
        <div className="mx-auto max-w-2xl">
          <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <a
            href="/study-plans"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Volver a planes de estudio
          </a>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-slate-800">
            Editar plan de estudio
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Descripción{" "}
                <span className="text-slate-400">(opcional)</span>
              </label>
              <textarea
                value={data.description}
                onChange={handleChange("description")}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Materias
              </label>
              <div className="mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-300">
                {subjects.map((s) => (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={data.subjectIds.includes(s.id)}
                      onChange={() => toggleSubject(s.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      {s.code} — {s.name} ({s.credits} créditos)
                    </span>
                  </label>
                ))}
                {subjects.length === 0 && (
                  <p className="px-3 py-4 text-center text-sm text-slate-400">
                    No se pudieron cargar las materias
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href="/study-plans"
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
