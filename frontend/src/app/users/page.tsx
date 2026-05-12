"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/StatusBadge"
import { Pagination } from "@/components/Pagination"
import { SearchInput } from "@/components/SearchInput"
import { api } from "@/lib/api"
import { useEffect, useState, useCallback } from "react"
import type { Paginated, User } from "@/lib/types"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
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

  const fetchUsers = useCallback(() => {
    setLoading(true)
    setError("")
    api
      .get<Paginated<User>>("/users", { page, pageSize: 10 })
      .then((res) => {
        setUsers(res.data)
        setTotalPages(res.pagination.totalPages)
        setLoading(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los usuarios")
        setLoading(false)
      })
  }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = debouncedSearch
    ? users.filter(
        (u) =>
          u.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          u.role.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : users

  const handleToggleActive = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, { isActive: !user.isActive })
      fetchUsers()
    } catch {
      setError("No se pudo actualizar el usuario")
    }
  }

  const columns = [
    {
      header: "Email",
      accessor: (u: User) => u.email,
    },
    {
      header: "Rol",
      accessor: (u: User) => u.role.charAt(0).toUpperCase() + u.role.slice(1),
    },
    {
      header: "Estado",
      accessor: (u: User) => (
        <StatusBadge status={u.isActive ? "active" : "inactive"} />
      ),
    },
    {
      header: "Último Acceso",
      accessor: (u: User) =>
        u.lastLogin
          ? new Date(u.lastLogin).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
    },
    {
      header: "Acciones",
      accessor: (u: User) => (
        <button
          onClick={() => handleToggleActive(u)}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
            u.isActive
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {u.isActive ? "Desactivar" : "Activar"}
        </button>
      ),
    },
  ]

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <PageHeader title="Usuarios" />
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
            data={filteredUsers}
            getId={(u) => u.id}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </DashboardLayout>
  )
}
