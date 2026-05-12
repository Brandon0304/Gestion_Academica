"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { Pagination } from "@/components/Pagination"
import { SearchInput } from "@/components/SearchInput"
import { api } from "@/lib/api"
import { useEffect, useState, useCallback } from "react"
import type { Paginated, Student } from "@/lib/types"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchStudents = useCallback(() => {
    setLoading(true)
    setError("")
    api
      .get<Paginated<Student>>("/students", { page, pageSize: 10 })
      .then((res) => {
        setStudents(res.data)
        setTotalPages(res.pagination.totalPages)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los estudiantes")
        setLoading(false)
      })
  }, [page])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const filteredStudents = debouncedSearch
    ? students.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          s.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          s.dni.includes(debouncedSearch),
      )
    : students

  const columns = [
    {
      header: "Nombre",
      accessor: (s: Student) => `${s.firstName} ${s.lastName}`,
    },
    {
      header: "Email",
      accessor: (s: Student) => s.email,
    },
    {
      header: "DNI",
      accessor: (s: Student) => s.dni,
    },
    {
      header: "Estado",
      accessor: (s: Student) => (
        <StatusBadge status={s.isActive ? "active" : "inactive"} />
      ),
    },
    {
      header: "Fecha de inscripción",
      accessor: (s: Student) =>
        new Date(s.enrollmentDate).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin", "secretary", "directive", "teacher"]}>
      <PageHeader
        title="Estudiantes"
        actionLabel="Nuevo Estudiante"
        actionHref="/students/new"
      />
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="mb-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-slate-200"
            />
          ))}
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredStudents}
            getId={(s) => s.id}
            basePath="/students"
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </DashboardLayout>
  )
}
