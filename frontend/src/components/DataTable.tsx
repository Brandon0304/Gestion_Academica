import Link from "next/link"

interface Column<T> {
  header: string
  accessor: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  basePath?: string
  getId: (row: T) => string
}

export function DataTable<T>({ columns, data, basePath, getId }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
              >
                {col.header}
              </th>
            ))}
            {basePath && (
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((row) => (
            <tr key={getId(row)} className="transition-colors hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col.header} className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                  {col.accessor(row)}
                </td>
              ))}
              {basePath && (
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  <Link
                    href={`${basePath}/${getId(row)}/edit`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </Link>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (basePath ? 1 : 0)}
                className="px-4 py-8 text-center text-sm text-slate-400"
              >
                No hay registros
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
