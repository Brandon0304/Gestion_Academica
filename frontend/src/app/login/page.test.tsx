import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'
import { resetMockUser } from '../../test-utils'

beforeEach(() => {
  resetMockUser()
})

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />)
    expect(screen.getByText('G_Académica')).toBeInTheDocument()
    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('admin@academia.edu')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument()
  })

  it('should show test credentials', () => {
    render(<LoginPage />)
    expect(screen.getByText(/Credenciales de prueba/)).toBeInTheDocument()
    expect(screen.getByText(/admin@academia.edu/)).toBeInTheDocument()
  })

  it('should have submit button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })
})
