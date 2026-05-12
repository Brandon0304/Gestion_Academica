"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/DashboardLayout"
import { api, ApiRequestError } from "@/lib/api"
import type { CreateStudyPlanDTO, Paginated, Subject } from "@/lib/types"

export default function NewStudyPlanPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [data, setData] = useState<CreateStudyPlanDTO>({
    code: "",
    name: "",
    description: "",
    subjectIds: [],
  })
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api
      .get<Paginated<Subject>>("/subjects?pageSize=500")
      .then((res) => {
        setSubjects(res.data)
      })
      .catch(() => {})
  }, [])

  const handleChange =
    (field: keyof CreateStudyPlanDTO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

  const toggleSubject = (id: string) => {
    setData((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds?.includes(id)
        ? prev.subjectIds.filter((s) => s !== id)
        : [...(prev.subjectIds ?? []), id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrors({})
    setLoading(true)
    try {
      await api.post("/study-plans", data)
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
            Nuevo plan de estudio
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
                value={data.description ?? ""}
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
                      checked={data.subjectIds?.includes(s.id) ?? false}
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
