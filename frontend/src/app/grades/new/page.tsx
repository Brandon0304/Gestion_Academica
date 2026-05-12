"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/DashboardLayout"
import { api, ApiRequestError } from "@/lib/api"
import type { Grade, CreateGradeDTO } from "@/lib/types"

export default function NewGradePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const enrollmentId = searchParams.get("enrollmentId") ?? ""

  const [existingGrades, setExistingGrades] = useState<Grade[]>([])
  const [loadingGrades, setLoadingGrades] = useState(true)
  const [data, setData] = useState<CreateGradeDTO>({
    enrollmentId,
    evaluationType: "exam",
    value: 0,
    percentage: 100,
    maxValue: 20,
    observation: "",
  })
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!enrollmentId) {
      setLoadingGrades(false)
      return
    }
    api
      .get<Grade[]>(`/grades/enrollment/${enrollmentId}`)
      .then((grades) => {
        setExistingGrades(grades)
        setLoadingGrades(false)
      })
      .catch(() => {
        setLoadingGrades(false)
      })
  }, [enrollmentId])

  useEffect(() => {
    setData((prev) => ({ ...prev, enrollmentId }))
  }, [enrollmentId])

  const handleChange = (
    field: keyof CreateGradeDTO,
  ) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const value =
      field === "value" || field === "percentage" || field === "maxValue"
        ? parseFloat(e.target.value) || 0
        : e.target.value
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrors({})
    setSaving(true)
    try {
      await api.post("/grades", data)
      router.push("/grades")
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
      setSaving(false)
    }
  }

  return (
    <DashboardLayout allowedRoles={["teacher", "admin"]}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <a
            href="/grades"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Volver a calificaciones
          </a>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-slate-800">
            Registrar nueva nota
          </h1>

          {enrollmentId && (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-slate-600">
                Notas existentes
              </h2>
              {loadingGrades ? (
                <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
              ) : existingGrades.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-slate-500">
                          Tipo
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-slate-500">
                          Valor
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-slate-500">
                          %
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-slate-500">
                          Máx
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {existingGrades.map((g) => (
                        <tr key={g.id}>
                          <td className="px-3 py-2 text-sm text-slate-700">
                            {g.evaluationType}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-700">
                            {g.value}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-700">
                            {g.percentage}%
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-700">
                            {g.maxValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No hay notas registradas aún
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="enrollmentId" value={data.enrollmentId} />

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Tipo de evaluación
              </label>
              <select
                value={data.evaluationType}
                onChange={handleChange("evaluationType")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="exam">Examen</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Tarea</option>
                <option value="project">Proyecto</option>
                <option value="other">Otro</option>
              </select>
              {errors.evaluationType && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.evaluationType}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Valor
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={data.value}
                  onChange={handleChange("value")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.value && (
                  <p className="mt-1 text-xs text-red-500">{errors.value}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Porcentaje (%)
                </label>
                <input
                  type="number"
                  step={1}
                  value={data.percentage}
                  onChange={handleChange("percentage")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.percentage && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.percentage}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Valor máximo
                </label>
                <input
                  type="number"
                  step={1}
                  value={data.maxValue}
                  onChange={handleChange("maxValue")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.maxValue && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.maxValue}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Observación{" "}
                <span className="text-slate-400">(opcional)</span>
              </label>
              <textarea
                value={data.observation ?? ""}
                onChange={handleChange("observation")}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.observation && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.observation}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href="/grades"
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                Cancelar
              </a>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
