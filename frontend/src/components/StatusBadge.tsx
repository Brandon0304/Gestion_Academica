interface StatusBadgeProps {
  status: string
}

const COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
  open: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  enrolled: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  withdrawn: "bg-slate-100 text-slate-700",
}

const LABELS: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  open: "Abierto",
  closed: "Cerrado",
  in_progress: "En curso",
  enrolled: "Inscrito",
  approved: "Aprobado",
  failed: "Reprobado",
  withdrawn: "Retirado",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = COLORS[status] || "bg-slate-100 text-slate-700"
  const label = LABELS[status] || status
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}
