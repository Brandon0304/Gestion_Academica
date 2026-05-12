import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('should not render when totalPages <= 1', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={() => {}} />)
    expect(container.innerHTML).toBe('')
  })

  it('should render page info', () => {
    render(<Pagination page={2} totalPages={5} onPageChange={() => {}} />)
    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })

  it('should disable previous on first page', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByText('Anterior')).toBeDisabled()
    expect(screen.getByText('Siguiente')).not.toBeDisabled()
  })

  it('should disable next on last page', () => {
    render(<Pagination page={3} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByText('Anterior')).not.toBeDisabled()
    expect(screen.getByText('Siguiente')).toBeDisabled()
  })

  it('should call onPageChange with previous page', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByText('Anterior'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageChange with next page', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByText('Siguiente'))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })
})
