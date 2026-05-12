import { describe, it, expect, vi, afterEach } from 'vitest'
import { AcademicPeriod } from './academic-period.js'

afterEach(() => {
  vi.restoreAllMocks()
})

const makePeriod = () =>
  AcademicPeriod.create({
    id: '1',
    name: '2025-1',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-07-15'),
    enrollmentStart: new Date('2025-02-01'),
    enrollmentEnd: new Date('2025-03-15'),
    status: 'planned',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('AcademicPeriod', () => {
  it('should create an academic period', () => {
    const p = makePeriod()
    expect(p.name).toBe('2025-1')
    expect(p.status).toBe('planned')
  })

  it('should open a period', () => {
    const p = makePeriod()
    expect(p.open().status).toBe('active')
  })

  it('should close a period', () => {
    const p = makePeriod()
    expect(p.close().status).toBe('closed')
  })

  it('isEnrollmentOpen returns true within enrollment window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-02-15'))
    const p = makePeriod()
    expect(p.isEnrollmentOpen()).toBe(true)
  })

  it('isEnrollmentOpen returns false before enrollment window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15'))
    const p = makePeriod()
    expect(p.isEnrollmentOpen()).toBe(false)
  })

  it('isEnrollmentOpen returns false after enrollment window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-04-01'))
    const p = makePeriod()
    expect(p.isEnrollmentOpen()).toBe(false)
  })

  it('isActive returns true within period dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-04-15'))
    const p = makePeriod()
    expect(p.isActive()).toBe(true)
  })

  it('isActive returns false before period starts', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-02-15'))
    const p = makePeriod()
    expect(p.isActive()).toBe(false)
  })

  it('isActive returns false after period ends', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-08-01'))
    const p = makePeriod()
    expect(p.isActive()).toBe(false)
  })
})
