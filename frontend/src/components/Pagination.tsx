"use client"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm text-slate-600">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  )
}
