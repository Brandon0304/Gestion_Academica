import { describe, it, expect, vi } from 'vitest'
import { downloadCSV } from './csv'

describe('downloadCSV', () => {
  it('should create a CSV blob and trigger download', () => {
    const createObjectURL = vi.fn(() => 'blob:url')
    const revokeObjectURL = vi.fn()
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL

    const click = vi.fn()
    const anchor = { href: '', download: '', click } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)

    downloadCSV([{ name: 'Ana', grade: 95 }, { name: 'Luis', grade: 80 }], 'grades')

    expect(createObjectURL).toHaveBeenCalled()
    expect(anchor.download).toBe('grades.csv')
    expect(click).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:url')
  })

  it('should not download if data is empty', () => {
    const click = vi.fn()
    const anchor = { href: '', download: '', click } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)

    downloadCSV([], 'empty')
    expect(click).not.toHaveBeenCalled()
  })

  it('should escape commas and quotes in values', () => {
    const createObjectURL = vi.fn(() => 'blob:url')
    const revokeObjectURL = vi.fn()
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL

    const click = vi.fn()
    const anchor = { href: '', download: '', click } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)

    downloadCSV([{ name: 'Pérez, Juan', note: '"Excelente"' }], 'test')
    const blobArg = createObjectURL.mock.calls[0]?.[0] as Blob
    expect(blobArg).toBeDefined()
  })
})
