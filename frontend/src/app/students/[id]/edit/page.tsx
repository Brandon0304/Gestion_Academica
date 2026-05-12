"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/DashboardLayout"
import { api, ApiRequestError } from "@/lib/api"
import type { Student } from "@/lib/types"

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dni: "",
    phone: "",
    birthDate: "",
  })
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api
      .get<Student>(`/students/${params.id}`)
      .then((student) => {
        setData({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          dni: student.dni,
          phone: student.phone ?? "",
          birthDate: student.birthDate,
        })
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudo cargar el estudiante")
        setLoading(false)
      })
  }, [params.id])

  const handleChange = (field: keyof typeof data) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrors({})
    setSaving(true)
    try {
      await api.put(`/students/${params.id}`, data)
      router.push("/students")
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

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["admin", "secretary"]}>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6 h-7 w-48 animate-pulse rounded bg-slate-200" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <div className="mb-1 h-4 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["admin", "secretary"]}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <a
            href="/students"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Volver a estudiantes
          </a>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-slate-800">
            Editar estudiante
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={handleChange("firstName")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Apellido
                </label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={handleChange("lastName")}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={handleChange("email")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                DNI
              </label>
              <input
                type="text"
                value={data.dni}
                onChange={handleChange("dni")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.dni && (
                <p className="mt-1 text-xs text-red-500">{errors.dni}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Teléfono <span className="text-slate-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={data.phone}
                onChange={handleChange("phone")}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                value={data.birthDate}
                onChange={handleChange("birthDate")}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.birthDate && (
                <p className="mt-1 text-xs text-red-500">{errors.birthDate}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href="/students"
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
