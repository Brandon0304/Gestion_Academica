"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/DashboardLayout"
import { api, ApiRequestError } from "@/lib/api"
import type { AcademicPeriod, CreateAcademicPeriodDTO } from "@/lib/types"

export default function EditAcademicPeriodPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<CreateAcademicPeriodDTO>({
    name: "",
    startDate: "",
    endDate: "",
    enrollmentStartDate: "",
    enrollmentEndDate: "",
  })
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api
      .get<AcademicPeriod>(`/academic-periods/${id}`)
      .then((period) => {
        setData({
          name: period.name,
          startDate: period.startDate.split("T")[0],
          endDate: period.endDate.split("T")[0],
          enrollmentStartDate: period.enrollmentStartDate.split("T")[0],
          enrollmentEndDate: period.enrollmentEndDate.split("T")[0],
        })
        setFetching(false)
      })
      .catch(() => {
        setError("No se pudo cargar el período académico")
        setFetching(false)
      })
  }, [id])

  const handleChange = (field: keyof CreateAcademicPeriodDTO) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrors({})
    setLoading(true)
    try {
      await api.put(`/academic-periods/${id}`, data)
      router.push("/academic-periods")
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
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-lg bg-slate-200"
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <a
            href="/academic-periods"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Volver a períodos académicos
          </a>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-slate-800">
            Editar período académico
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={data.startDate}
                  onChange={handleChange("startDate")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={data.endDate}
                  onChange={handleChange("endDate")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.endDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Inscripciones desde
                </label>
                <input
                  type="date"
                  value={data.enrollmentStartDate}
                  onChange={handleChange("enrollmentStartDate")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.enrollmentStartDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.enrollmentStartDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Inscripciones hasta
                </label>
                <input
                  type="date"
                  value={data.enrollmentEndDate}
                  onChange={handleChange("enrollmentEndDate")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.enrollmentEndDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.enrollmentEndDate}
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
                href="/academic-periods"
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
