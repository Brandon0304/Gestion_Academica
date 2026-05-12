import { describe, it, expect } from 'vitest'
import { Schedule } from './schedule.js'

describe('Schedule', () => {
  it('should create a schedule', () => {
    const s = new Schedule(['monday', 'wednesday'], '08:00', '10:00')
    expect(s.days).toEqual(['monday', 'wednesday'])
    expect(s.startTime).toBe('08:00')
    expect(s.endTime).toBe('10:00')
  })

  it('should reject empty days', () => {
    expect(() => new Schedule([], '08:00', '10:00')).toThrow('Schedule must have at least one day')
  })

  it('should reject invalid time format', () => {
    expect(() => new Schedule(['monday'], '8:00', '10:00')).toThrow('Schedule times must be in HH:mm format')
    expect(() => new Schedule(['monday'], '08:00', '10:0')).toThrow()

  })

  it('toJSON returns data', () => {
    const s = new Schedule(['friday'], '14:00', '16:00')
    expect(s.toJSON()).toEqual({ days: ['friday'], startTime: '14:00', endTime: '16:00' })
  })

  it('fromJSON restores schedule', () => {
    const s = Schedule.fromJSON({ days: ['tuesday', 'thursday'], startTime: '10:00', endTime: '12:00' })
    expect(s.days).toEqual(['tuesday', 'thursday'])
    expect(s.startTime).toBe('10:00')
  })

  describe('conflictsWith', () => {
    it('detects overlapping schedules on same day', () => {
      const a = new Schedule(['monday'], '08:00', '10:00')
      const b = new Schedule(['monday'], '09:00', '11:00')
      expect(a.conflictsWith(b)).toBe(true)
      expect(b.conflictsWith(a)).toBe(true)
    })

    it('detects non-overlapping on same day', () => {
      const a = new Schedule(['monday'], '08:00', '10:00')
      const b = new Schedule(['monday'], '10:00', '12:00')
      expect(a.conflictsWith(b)).toBe(false)
    })

    it('no conflict on different days', () => {
      const a = new Schedule(['monday'], '08:00', '10:00')
      const b = new Schedule(['tuesday'], '08:00', '10:00')
      expect(a.conflictsWith(b)).toBe(false)
    })

    it('detects overlap with shared day among many', () => {
      const a = new Schedule(['monday', 'wednesday'], '08:00', '10:00')
      const b = new Schedule(['wednesday', 'friday'], '09:00', '11:00')
      expect(a.conflictsWith(b)).toBe(true)
    })
  })
})
