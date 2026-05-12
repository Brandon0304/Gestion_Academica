import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('should render with default placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
  })

  it('should render custom placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Filtrar..." />)
    expect(screen.getByPlaceholderText('Filtrar...')).toBeInTheDocument()
  })

  it('should call onChange when typing', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledWith('test')
  })

  it('should display current value', () => {
    render(<SearchInput value="current" onChange={() => {}} />)
    expect(screen.getByDisplayValue('current')).toBeInTheDocument()
  })
})
