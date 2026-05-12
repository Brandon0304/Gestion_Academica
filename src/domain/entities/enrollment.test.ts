import { describe, it, expect } from 'vitest'
import { Enrollment } from './enrollment.js'

const makeEnrollment = () =>
  Enrollment.create({
    id: '1',
    studentId: 'stu-1',
    courseId: 'crs-1',
    enrollmentDate: new Date('2025-02-15'),
    status: 'enrolled',
    finalGrade: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('Enrollment', () => {
  it('should create an enrollment', () => {
    const e = makeEnrollment()
    expect(e.studentId).toBe('stu-1')
    expect(e.courseId).toBe('crs-1')
    expect(e.status).toBe('enrolled')
    expect(e.finalGrade).toBeNull()
  })

  it('should approve with grade', () => {
    const e = makeEnrollment()
    const approved = e.approve(18)
    expect(approved.status).toBe('approved')
    expect(approved.finalGrade).toBe(18)
  })

  it('should fail with grade', () => {
    const e = makeEnrollment()
    const failed = e.fail(8)
    expect(failed.status).toBe('failed')
    expect(failed.finalGrade).toBe(8)
  })

  it('should withdraw', () => {
    const e = makeEnrollment()
    const withdrawn = e.withdraw()
    expect(withdrawn.status).toBe('withdrawn')
    expect(withdrawn.finalGrade).toBeNull()
  })

  it('isApproved returns true for approved', () => {
    const e = makeEnrollment().approve(18)
    expect(e.isApproved()).toBe(true)
  })

  it('isApproved returns false for enrolled', () => {
    const e = makeEnrollment()
    expect(e.isApproved()).toBe(false)
  })

  it('isApproved returns false for failed', () => {
    const e = makeEnrollment().fail(5)
    expect(e.isApproved()).toBe(false)
  })

  it('isApproved returns false for withdrawn', () => {
    const e = makeEnrollment().withdraw()
    expect(e.isApproved()).toBe(false)
  })
})
