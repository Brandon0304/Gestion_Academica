import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from './Navbar'
import { setMockUser, resetMockUser } from '../test-utils'

beforeEach(() => {
  resetMockUser()
})

describe('Navbar', () => {
  it('should render user email', () => {
    render(<Navbar />)
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
  })

  it('should render admin title for admin role', () => {
    render(<Navbar />)
    expect(screen.getByText('Administración')).toBeInTheDocument()
  })

  it('should render secretary title for secretary role', () => {
    setMockUser({ id: 'u-2', email: 'sec@test.com', role: 'secretary' })
    render(<Navbar />)
    expect(screen.getByText('Secretaría')).toBeInTheDocument()
  })

  it('should render teacher title for teacher role', () => {
    setMockUser({ id: 'u-3', email: 'teacher@test.com', role: 'teacher' })
    render(<Navbar />)
    expect(screen.getByText('Docencia')).toBeInTheDocument()
  })

  it('should render student title for student role', () => {
    setMockUser({ id: 'u-4', email: 'student@test.com', role: 'student' })
    render(<Navbar />)
    expect(screen.getByText('Portal Estudiantil')).toBeInTheDocument()
  })

  it('should have logout button', () => {
    render(<Navbar />)
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
  })
})
