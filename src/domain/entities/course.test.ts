import { describe, it, expect } from 'vitest'
import { Course } from './course.js'
import { Schedule } from '../value-objects/schedule.js'

const makeCourse = () =>
  Course.create({
    id: '1',
    code: 'CS101',
    name: 'Programación I',
    description: 'Introducción a la programación',
    credits: 4,
    maxCapacity: 30,
    subjectId: 'sub-1',
    teacherId: 'tch-1',
    academicPeriodId: 'per-1',
    classroomId: 'room-1',
    schedule: new Schedule(['monday'], '08:00', '10:00'),
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('Course', () => {
  it('should create a course', () => {
    const c = makeCourse()
    expect(c.name).toBe('Programación I')
    expect(c.code).toBe('CS101')
    expect(c.status).toBe('open')
  })

  it('hasAvailableCapacity returns true when under capacity', () => {
    const c = makeCourse()
    expect(c.hasAvailableCapacity(25)).toBe(true)
  })

  it('hasAvailableCapacity returns false at capacity', () => {
    const c = makeCourse()
    expect(c.hasAvailableCapacity(30)).toBe(false)
  })

  it('hasAvailableCapacity returns false over capacity', () => {
    const c = makeCourse()
    expect(c.hasAvailableCapacity(35)).toBe(false)
  })

  it('should transition status: open -> close', () => {
    const c = makeCourse()
    expect(c.close().status).toBe('closed')
  })

  it('should transition status: open -> start -> finish', () => {
    const c = makeCourse()
    expect(c.start().status).toBe('in_progress')
    expect(c.start().finish().status).toBe('finished')
  })

  it('should update info', () => {
    const c = makeCourse()
    const updated = c.updateInfo({ name: 'Programación II', credits: 5 })
    expect(updated.name).toBe('Programación II')
    expect(updated.credits).toBe(5)
    expect(updated.code).toBe('CS101')
  })
})
