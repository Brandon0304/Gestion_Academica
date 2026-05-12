import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('should render active status', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('should render closed status', () => {
    render(<StatusBadge status="closed" />)
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })

  it('should render unknown status as-is', () => {
    render(<StatusBadge status="unknown_status" />)
    expect(screen.getByText('unknown_status')).toBeInTheDocument()
  })

  it('should render approved status', () => {
    render(<StatusBadge status="approved" />)
    expect(screen.getByText('Aprobado')).toBeInTheDocument()
  })
})
