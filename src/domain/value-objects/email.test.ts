import { describe, it, expect } from 'vitest'
import { Email } from './email.js'

describe('Email', () => {
  it('should create valid email', () => {
    const email = new Email('Test@Example.com')
    expect(email.toString()).toBe('test@example.com')
  })

  it('should throw for invalid email', () => {
    expect(() => new Email('not-an-email')).toThrow()
    expect(() => new Email('')).toThrow()
    expect(() => new Email('@domain.com')).toThrow()
  })

  it('should compare equality', () => {
    const a = new Email('user@example.com')
    const b = new Email('user@example.com')
    const c = new Email('other@example.com')
    expect(a.equals(b)).toBe(true)
    expect(a.equals(c)).toBe(false)
  })
})
