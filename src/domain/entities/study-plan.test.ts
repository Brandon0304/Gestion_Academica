import { describe, it, expect } from 'vitest'
import { StudyPlan } from './study-plan.js'

const makeStudyPlan = () =>
  StudyPlan.create({
    id: '1',
    name: 'Ingeniería de Sistemas',
    code: 'IS-2024',
    description: 'Plan 2024',
    year: 2024,
    totalCredits: 200,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('StudyPlan', () => {
  it('should create a study plan', () => {
    const s = makeStudyPlan()
    expect(s.name).toBe('Ingeniería de Sistemas')
    expect(s.code).toBe('IS-2024')
    expect(s.status).toBe('draft')
  })

  it('should activate a study plan', () => {
    const s = makeStudyPlan()
    expect(s.activate().status).toBe('active')
  })

  it('should replace a study plan', () => {
    const s = makeStudyPlan().activate()
    expect(s.replace().status).toBe('replaced')
  })

  it('should update info', () => {
    const s = makeStudyPlan()
    const updated = s.updateInfo({ name: 'Nuevo Plan', year: 2025 })
    expect(updated.name).toBe('Nuevo Plan')
    expect(updated.year).toBe(2025)
    expect(updated.code).toBe('IS-2024')
  })
})
