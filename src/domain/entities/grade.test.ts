import { describe, it, expect } from 'vitest'
import { Grade } from './grade.js'

const makeGrade = () =>
  Grade.create({
    id: '1',
    enrollmentId: 'enr-1',
    evaluationType: 'Parcial',
    value: 15,
    percentage: 40,
    maxValue: 20,
    observation: null,
    registeredAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('Grade', () => {
  it('should create a grade', () => {
    const g = makeGrade()
    expect(g.evaluationType).toBe('Parcial')
    expect(g.value).toBe(15)
    expect(g.percentage).toBe(40)
  })

  it('should reject negative value', () => {
    expect(() =>
      Grade.create({
        id: '2',
        enrollmentId: 'enr-1',
        evaluationType: 'Final',
        value: -1,
        percentage: 60,
        maxValue: 20,
        observation: null,
        registeredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).toThrow('La calificación no puede ser negativa')
  })

  it('should reject value exceeding maxValue', () => {
    expect(() =>
      Grade.create({
        id: '2',
        enrollmentId: 'enr-1',
        evaluationType: 'Final',
        value: 25,
        percentage: 60,
        maxValue: 20,
        observation: null,
        registeredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).toThrow('La calificación no puede exceder 20')
  })

  it('should reject percentage <= 0', () => {
    expect(() =>
      Grade.create({
        id: '2',
        enrollmentId: 'enr-1',
        evaluationType: 'Final',
        value: 10,
        percentage: 0,
        maxValue: 20,
        observation: null,
        registeredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).toThrow('El porcentaje debe estar entre 1 y 100')
  })

  it('should reject percentage > 100', () => {
    expect(() =>
      Grade.create({
        id: '2',
        enrollmentId: 'enr-1',
        evaluationType: 'Final',
        value: 10,
        percentage: 150,
        maxValue: 20,
        observation: null,
        registeredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).toThrow('El porcentaje debe estar entre 1 y 100')
  })

  it('should calculate weightedValue', () => {
    const g = makeGrade()
    expect(g.weightedValue).toBe(30)
  })

  it('weightedValue with maxValue 10 and percentage 50', () => {
    const g = Grade.create({
      id: '2',
      enrollmentId: 'enr-1',
      evaluationType: 'Final',
      value: 8,
      percentage: 50,
      maxValue: 10,
      observation: null,
      registeredAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    expect(g.weightedValue).toBe(40)
  })

  it('should update fields', () => {
    const g = makeGrade()
    const updated = g.update({ value: 18, observation: 'Mejoró' })
    expect(updated.value).toBe(18)
    expect(updated.observation).toBe('Mejoró')
    expect(updated.evaluationType).toBe('Parcial')
  })

  it('should reject negative value on update', () => {
    const g = makeGrade()
    expect(() => g.update({ value: -5 })).toThrow('La calificación no puede ser negativa')
  })

  it('should reject value exceeding maxValue on update', () => {
    const g = makeGrade()
    expect(() => g.update({ value: 25 })).toThrow('La calificación no puede exceder')
  })
})
