import { describe, it, expect } from 'vitest'
import { Teacher } from './teacher.js'
import { Email } from '../value-objects/email.js'
import { DocumentId } from '../value-objects/document-id.js'

const makeTeacher = () =>
  Teacher.create({
    id: '1',
    firstName: 'María',
    lastName: 'García',
    email: new Email('maria@academia.edu'),
    documentId: new DocumentId('DNI98765'),
    specialty: 'Matemáticas',
    degree: 'Doctorado',
    hireDate: new Date('2020-03-01'),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

describe('Teacher', () => {
  it('should create a teacher', () => {
    const t = makeTeacher()
    expect(t.fullName).toBe('María García')
    expect(t.specialty).toBe('Matemáticas')
    expect(t.status).toBe('active')
  })

  it('should deactivate', () => {
    const t = makeTeacher()
    expect(t.deactivate().status).toBe('inactive')
  })

  it('should activate', () => {
    const t = makeTeacher().deactivate()
    expect(t.activate().status).toBe('active')
  })

  it('should update info', () => {
    const t = makeTeacher()
    const updated = t.updateInfo({ firstName: 'Ana', degree: 'Maestría' })
    expect(updated.firstName).toBe('Ana')
    expect(updated.degree).toBe('Maestría')
    expect(updated.lastName).toBe('García')
  })
})
