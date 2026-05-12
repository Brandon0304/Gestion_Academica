import { describe, it, expect } from 'vitest'
import { Subject } from './subject.js'

const makeSubject = () =>
  Subject.create({
    id: '1',
    code: 'MAT101',
    name: 'Matemáticas I',
    description: 'Cálculo diferencial',
    credits: 5,
    theoryHours: 4,
    practiceHours: 2,
    studyPlanId: 'plan-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('Subject', () => {
  it('should create a subject', () => {
    const s = makeSubject()
    expect(s.name).toBe('Matemáticas I')
    expect(s.code).toBe('MAT101')
    expect(s.credits).toBe(5)
  })

  it('should create with null studyPlanId', () => {
    const s = Subject.create({
      id: '2',
      code: 'TALL101',
      name: 'Taller',
      description: null,
      credits: 2,
      theoryHours: 0,
      practiceHours: 4,
      studyPlanId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    expect(s.studyPlanId).toBeNull()
    expect(s.description).toBeNull()
  })

  it('should update info', () => {
    const s = makeSubject()
    const updated = s.updateInfo({ name: 'Matemáticas II', credits: 6, theoryHours: 5 })
    expect(updated.name).toBe('Matemáticas II')
    expect(updated.credits).toBe(6)
    expect(updated.theoryHours).toBe(5)
    expect(updated.code).toBe('MAT101')
  })
})
