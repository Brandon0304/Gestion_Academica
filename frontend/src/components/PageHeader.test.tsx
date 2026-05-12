import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('should render title', () => {
    render(<PageHeader title="Estudiantes" />)
    expect(screen.getByText('Estudiantes')).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    render(<PageHeader title="Cursos" description="Listado de cursos activos" />)
    expect(screen.getByText('Listado de cursos activos')).toBeInTheDocument()
  })

  it('should render action button when action props provided', () => {
    render(<PageHeader title="Aulas" actionLabel="Nueva aula" actionHref="/classrooms/new" />)
    const link = screen.getByText('Nueva aula')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/classrooms/new')
  })

  it('should not render action button when no action props', () => {
    render(<PageHeader title="Perfil" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
