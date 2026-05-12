import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sidebar } from './Sidebar'
import { setMockUser, resetMockUser } from '../test-utils'

beforeEach(() => {
  resetMockUser()
})

describe('Sidebar', () => {
  it('should render app name', () => {
    render(<Sidebar />)
    expect(screen.getByText('G_Académica')).toBeInTheDocument()
  })

  it('should render admin email and role', () => {
    render(<Sidebar />)
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('should show all nav items for admin', () => {
    render(<Sidebar />)
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Estudiantes')).toBeInTheDocument()
    expect(screen.getByText('Docentes')).toBeInTheDocument()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
    expect(screen.getByText('Perfil')).toBeInTheDocument()
  })

  it('should hide Users link for non-admin roles', () => {
    setMockUser({ id: 'u-2', email: 'teacher@test.com', role: 'teacher' })
    render(<Sidebar />)
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument()
    expect(screen.getByText('Cursos')).toBeInTheDocument()
  })

  it('should hide Docentes for student role', () => {
    setMockUser({ id: 'u-3', email: 'student@test.com', role: 'student' })
    render(<Sidebar />)
    expect(screen.queryByText('Docentes')).not.toBeInTheDocument()
    expect(screen.getByText('Perfil')).toBeInTheDocument()
  })
})
