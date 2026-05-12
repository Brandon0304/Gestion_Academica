interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function PageHeader({ title, description, actionLabel, actionHref }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {actionLabel}
        </a>
      )}
    </div>
  )
}
