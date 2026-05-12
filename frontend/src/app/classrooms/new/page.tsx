"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/DashboardLayout"
import { api, ApiRequestError } from "@/lib/api"
import type { CreateClassroomDTO } from "@/lib/types"

export default function NewClassroomPage() {
  const router = useRouter()
  const [data, setData] = useState<CreateClassroomDTO>({
    code: "",
    name: "",
    capacity: 0,
    building: "",
    floor: undefined,
  })
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange =
    (field: keyof CreateClassroomDTO) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "capacity" || field === "floor"
          ? e.target.value === ""
            ? field === "floor"
              ? undefined
              : 0
            : Number(e.target.value)
          : e.target.value
      setData((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrors({})
    setLoading(true)
    try {
      await api.post("/classrooms", data)
      router.push("/classrooms")
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
            href="/classrooms"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Volver a aulas
          </a>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-slate-800">
            Nueva aula
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
                Capacidad
              </label>
              <input
                type="number"
                min={1}
                value={data.capacity || ""}
                onChange={handleChange("capacity")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.capacity && (
                <p className="mt-1 text-xs text-red-500">{errors.capacity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Edificio <span className="text-slate-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={data.building ?? ""}
                onChange={handleChange("building")}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.building && (
                <p className="mt-1 text-xs text-red-500">{errors.building}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Piso <span className="text-slate-400">(opcional)</span>
              </label>
              <input
                type="number"
                min={0}
                value={data.floor ?? ""}
                onChange={handleChange("floor")}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.floor && (
                <p className="mt-1 text-xs text-red-500">{errors.floor}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href="/classrooms"
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
