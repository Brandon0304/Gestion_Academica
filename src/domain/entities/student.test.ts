import { describe, it, expect } from 'vitest'
import { Student } from './student.js'
import { Email } from '../value-objects/email.js'
import { DocumentId } from '../value-objects/document-id.js'

const makeStudent = () =>
  Student.create({
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: new Email('juan@example.com'),
    documentId: new DocumentId('DNI12345'),
    birthDate: new Date('2000-01-01'),
    phone: '555-0100',
    address: 'Calle 123',
    enrollmentDate: new Date('2026-01-15'),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('Student', () => {
  it('should create student', () => {
    const s = makeStudent()
    expect(s.fullName).toBe('Juan Pérez')
    expect(s.status).toBe('active')
  })

  it('should update personal info', () => {
    const s = makeStudent()
    const updated = s.updatePersonalInfo({ firstName: 'Carlos', phone: '555-0200' })
    expect(updated.firstName).toBe('Carlos')
    expect(updated.phone).toBe('555-0200')
    expect(updated.lastName).toBe('Pérez')
  })

  it('should suspend active student', () => {
    const s = makeStudent()
    const suspended = s.suspend()
    expect(suspended.status).toBe('suspended')
  })

  it('should not suspend graduated student', () => {
    const s = makeStudent().graduate()
    expect(() => s.suspend()).toThrow('Cannot suspend a graduated student')
  })

  it('should graduate student', () => {
    const s = makeStudent()
    expect(s.graduate().status).toBe('graduated')
  })

  it('should reactivate student', () => {
    const s = makeStudent().suspend()
    expect(s.reactivate().status).toBe('active')
  })
})
