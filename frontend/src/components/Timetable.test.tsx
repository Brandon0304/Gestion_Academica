import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Timetable } from './Timetable'

const entries = [
  {
    courseId: 'c-1',
    courseCode: 'MAT101',
    courseName: 'Matemáticas I',
    teacherName: 'Juan Pérez',
    classroomName: 'A-101',
    days: ['monday', 'wednesday'],
    startTime: '08:00',
    endTime: '10:00',
  },
  {
    courseId: 'c-2',
    courseCode: 'FIS101',
    courseName: 'Física I',
    teacherName: 'María López',
    classroomName: 'B-201',
    days: ['tuesday', 'thursday'],
    startTime: '10:00',
    endTime: '12:00',
  },
]

describe('Timetable', () => {
  it('should render empty state', () => {
    render(<Timetable entries={[]} />)
    expect(screen.getByText('No hay cursos asignados en este horario')).toBeInTheDocument()
  })

  it('should render day headers', () => {
    render(<Timetable entries={entries} />)
    expect(screen.getByText('Lun')).toBeInTheDocument()
    expect(screen.getByText('Mar')).toBeInTheDocument()
    expect(screen.getByText('Mié')).toBeInTheDocument()
    expect(screen.getByText('Jue')).toBeInTheDocument()
    expect(screen.getByText('Vie')).toBeInTheDocument()
    expect(screen.getByText('Sáb')).toBeInTheDocument()
  })

  it('should render time labels', () => {
    render(<Timetable entries={entries} />)
    expect(screen.getByText('07:00')).toBeInTheDocument()
    expect(screen.getByText('12:00')).toBeInTheDocument()
  })

  it('should render course entries', () => {
    render(<Timetable entries={entries} />)
    const mat101 = screen.getAllByText('MAT101')
    expect(mat101.length).toBeGreaterThanOrEqual(1)
    const fis101 = screen.getAllByText('FIS101')
    expect(fis101.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Juan Pérez').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('María López').length).toBeGreaterThanOrEqual(1)
  })

  it('should render classroom names', () => {
    render(<Timetable entries={entries} />)
    const a101 = screen.getAllByText('A-101')
    expect(a101.length).toBeGreaterThanOrEqual(1)
    const b201 = screen.getAllByText('B-201')
    expect(b201.length).toBeGreaterThanOrEqual(1)
  })
})
