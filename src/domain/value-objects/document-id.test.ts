import { describe, it, expect } from 'vitest'
import { DocumentId } from './document-id.js'

describe('DocumentId', () => {
  it('should create a valid document ID', () => {
    const doc = new DocumentId('DNI12345')
    expect(doc.toString()).toBe('DNI12345')
  })

  it('should trim whitespace', () => {
    const doc = new DocumentId('   DNI12345   ')
    expect(doc.toString()).toBe('DNI12345')
  })

  it('should reject too short', () => {
    expect(() => new DocumentId('AB')).toThrow('Document ID must be between 5 and 20 characters')
  })

  it('should reject too long', () => {
    expect(() => new DocumentId('A'.repeat(21))).toThrow('Document ID must be between 5 and 20 characters')
  })

  it('should accept exactly 5 characters', () => {
    const doc = new DocumentId('12345')
    expect(doc.toString()).toBe('12345')
  })

  it('should accept exactly 20 characters', () => {
    const val = 'A'.repeat(20)
    const doc = new DocumentId(val)
    expect(doc.toString()).toBe(val)
  })

  it('should check equality', () => {
    const a = new DocumentId('DNI12345')
    const b = new DocumentId('DNI12345')
    const c = new DocumentId('OTHER99')
    expect(a.equals(b)).toBe(true)
    expect(a.equals(c)).toBe(false)
  })
})
