import { describe, it, expect } from 'vitest'
import { Classroom } from './classroom.js'

const makeClassroom = () =>
  Classroom.create({
    id: '1',
    code: 'A-101',
    name: 'Aula Magna',
    capacity: 40,
    type: 'classroom',
    location: 'Edificio A',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('Classroom', () => {
  it('should create a classroom', () => {
    const c = makeClassroom()
    expect(c.code).toBe('A-101')
    expect(c.capacity).toBe(40)
    expect(c.type).toBe('classroom')
  })

  it('should create with null name and location', () => {
    const c = Classroom.create({
      id: '2',
      code: 'L-201',
      name: null,
      capacity: 20,
      type: 'laboratory',
      location: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    expect(c.name).toBeNull()
    expect(c.location).toBeNull()
  })

  it('should update info', () => {
    const c = makeClassroom()
    const updated = c.updateInfo({ name: 'Lab Nuevo', capacity: 30 })
    expect(updated.name).toBe('Lab Nuevo')
    expect(updated.capacity).toBe(30)
    expect(updated.code).toBe('A-101')
  })
})
