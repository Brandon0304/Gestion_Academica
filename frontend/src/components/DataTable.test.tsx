import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataTable } from './DataTable'

interface Item {
  id: string
  name: string
  email: string
}

const columns = [
  { header: 'Nombre', accessor: (row: Item) => row.name },
  { header: 'Email', accessor: (row: Item) => row.email },
]

const data: Item[] = [
  { id: '1', name: 'Ana', email: 'ana@test.com' },
  { id: '2', name: 'Luis', email: 'luis@test.com' },
]

describe('DataTable', () => {
  it('should render headers and data rows', () => {
    render(<DataTable columns={columns} data={data} getId={(r) => r.id} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('luis@test.com')).toBeInTheDocument()
  })

  it('should render edit links when basePath is provided', () => {
    render(<DataTable columns={columns} data={data} basePath="/students" getId={(r) => r.id} />)
    const editLinks = screen.getAllByText('Editar')
    expect(editLinks).toHaveLength(2)
    expect(editLinks[0]?.closest('a')).toHaveAttribute('href', '/students/1/edit')
    expect(editLinks[1]?.closest('a')).toHaveAttribute('href', '/students/2/edit')
  })

  it('should not render edit links without basePath', () => {
    render(<DataTable columns={columns} data={data} getId={(r) => r.id} />)
    expect(screen.queryByText('Editar')).not.toBeInTheDocument()
  })

  it('should render empty state message', () => {
    render(<DataTable columns={columns} data={[]} getId={(r) => r.id} />)
    expect(screen.getByText('No hay registros')).toBeInTheDocument()
  })
})
