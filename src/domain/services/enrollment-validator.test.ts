import { describe, it, expect, vi } from 'vitest'
import { EnrollmentValidator } from './enrollment-validator.js'
import type { AcademicPeriodRepository } from '../repositories/academic-period-repository.js'
import type { CourseRepository } from '../repositories/course-repository.js'
import type { EnrollmentRepository } from '../repositories/enrollment-repository.js'
import type { SubjectRepository } from '../repositories/subject-repository.js'
import { Course } from '../entities/course.js'
import { AcademicPeriod } from '../entities/academic-period.js'
import { Schedule } from '../value-objects/schedule.js'
import type { Subject } from '../entities/subject.js'
import type { Enrollment } from '../entities/enrollment.js'

const makeCourse = (overrides: Partial<Parameters<typeof Course.create>[0]> = {}) =>
  Course.create({
    id: 'crs-1',
    code: 'CS101',
    name: 'Programación I',
    description: null,
    credits: 4,
    maxCapacity: 30,
    subjectId: 'sub-1',
    teacherId: 'tch-1',
    academicPeriodId: 'per-1',
    classroomId: null,
    schedule: null,
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })

const makePeriod = (overrides: Partial<Parameters<typeof AcademicPeriod.create>[0]> = {}) =>
  AcademicPeriod.create({
    id: 'per-1',
    name: '2025-1',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2030-07-01'),
    enrollmentStart: new Date('2025-01-01'),
    enrollmentEnd: new Date('2030-12-31'),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })

function createMocks() {
  return {
    repoAcademicPeriod: {
      findById: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as AcademicPeriodRepository,
    repoCourse: {
      findById: vi.fn(),
      findByCode: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findConflictingSchedules: vi.fn(),
    } as CourseRepository,
    repoEnrollment: {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByStudent: vi.fn(),
      findByCourse: vi.fn(),
      findByStudentAndCourse: vi.fn(),
      findApprovedByStudent: vi.fn(),
      findApprovedByStudentAndSubject: vi.fn(),
      countByCourse: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as EnrollmentRepository,
    repoSubject: {
      findById: vi.fn(),
      findByCode: vi.fn(),
      findAll: vi.fn(),
      findPrerequisites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as SubjectRepository,
  }
}

type Mocks = ReturnType<typeof createMocks>

const makeValidator = (mocks?: Partial<Mocks>) => {
  const defaultMocks = createMocks()
  const all = { ...defaultMocks, ...(mocks ?? {}) }
  return {
    validator: new EnrollmentValidator(all.repoAcademicPeriod, all.repoCourse, all.repoEnrollment, all.repoSubject),
    mocks: all,
  }
}

describe('EnrollmentValidator', () => {
  it('should pass validation when all conditions are met', async () => {
    const { mocks, validator } = makeValidator()
    vi.mocked(mocks.repoCourse.findById).mockResolvedValue(makeCourse())
    vi.mocked(mocks.repoAcademicPeriod.findById).mockResolvedValue(makePeriod())
    vi.mocked(mocks.repoEnrollment.countByCourse).mockResolvedValue(10)
    vi.mocked(mocks.repoEnrollment.findByStudentAndCourse).mockResolvedValue(null)
    vi.mocked(mocks.repoSubject.findPrerequisites).mockResolvedValue([])

    await expect(validator.validate('crs-1', 'stu-1')).resolves.toBeUndefined()
  })

  it('should throw if course not found', async () => {
    const { mocks, validator } = makeValidator()
    vi.mocked(mocks.repoCourse.findById).mockResolvedValue(null)

    await expect(validator.validate('invalid', 'stu-1')).rejects.toThrow('Curso no encontrado')
  })

  it('should throw if course is not open', async () => {
    const { mocks, validator } = makeValidator()
    vi.mocked(mocks.repoCourse.findById).mockResolvedValue(makeCourse({ status: 'closed' }))

    await expect(validator.validate('crs-1', 'stu-1')).rejects.toThrow('no está abierto')
  })

  it('should throw if enrollment period is closed', async () => {
    const { mocks, validator } = makeValidator()
    vi.mocked(mocks.repoCourse.findById).mockResolvedValue(makeCourse())
    vi.mocked(mocks.repoAcademicPeriod.findById).mockResolvedValue(makePeriod({ enrollmentEnd: new Date('2025-01-15') }))

    await expect(validator.validate('crs-1', 'stu-1')).rejects.toThrow('período de inscripciones está cerrado')
  })

  it('should throw if course is full', async () => {
    const { mocks, validator } = makeValidator()
    vi.mocked(mocks.repoCourse.findById).mockResolvedValue(makeCourse({ maxCapacity: 30 }))
    vi.mocked(mocks.repoAcademicPeriod.findById).mockResolvedValue(makePeriod())
    vi.mocked(mocks.repoEnrollment.countByCourse).mockResolvedValue(30)

    await expect(validator.validate('crs-1', 'stu-1')).rejects.toThrow('capacidad máxima')
  })

  it('should throw if already enrolled', async () => {
    const { mocks, validator } = makeValidator()
    vi.mocked(mocks.repoCourse.findById).mockResolvedValue(makeCourse())
    vi.mocked(mocks.repoAcademicPeriod.findById).mockResolvedValue(makePeriod())
    vi.mocked(mocks.repoEnrollment.countByCourse).mockResolvedValue(10)
    vi.mocked(mocks.repoEnrollment.findByStudentAndCourse).mockResolvedValue({ id: 'enr-1' } as unknown as Enrollment)

    await expect(validator.validate('crs-1', 'stu-1')).rejects.toThrow('ya está inscrito')
  })

  it('should throw on schedule conflict', async () => {
    const conflictingCourse = makeCourse({ id: 'crs-2', name: 'Álgebra', schedule: new Schedule(['monday'], '09:00', '11:00') })
    const { mocks, validator } = makeValidator()
    vi.mocked(mocks.repoCourse.findById).mockResolvedValue(makeCourse({ schedule: new Schedule(['monday'], '08:00', '10:00') }))
    vi.mocked(mocks.repoAcademicPeriod.findById).mockResolvedValue(makePeriod())
    vi.mocked(mocks.repoEnrollment.countByCourse).mockResolvedValue(10)
    vi.mocked(mocks.repoEnrollment.findByStudentAndCourse).mockResolvedValue(null)
    vi.mocked(mocks.repoSubject.findPrerequisites).mockResolvedValue([])
    vi.mocked(mocks.repoCourse.findConflictingSchedules).mockResolvedValue([conflictingCourse])

    await expect(validator.validate('crs-1', 'stu-1')).rejects.toThrow('El horario del curso coincide con otro curso')
  })

  it('should throw on missing prerequisites', async () => {
    const { mocks, validator } = makeValidator()
    vi.mocked(mocks.repoCourse.findById).mockResolvedValue(makeCourse({ schedule: new Schedule(['tuesday'], '08:00', '10:00') }))
    vi.mocked(mocks.repoAcademicPeriod.findById).mockResolvedValue(makePeriod())
    vi.mocked(mocks.repoEnrollment.countByCourse).mockResolvedValue(10)
    vi.mocked(mocks.repoEnrollment.findByStudentAndCourse).mockResolvedValue(null)
    vi.mocked(mocks.repoSubject.findPrerequisites).mockResolvedValue([{ id: 'pre-1', name: 'Matemáticas Básica' } as unknown as Subject])
    vi.mocked(mocks.repoEnrollment.findApprovedByStudentAndSubject).mockResolvedValue(null)
    vi.mocked(mocks.repoCourse.findConflictingSchedules).mockResolvedValue([])

    await expect(validator.validate('crs-1', 'stu-1')).rejects.toThrow('Prerrequisitos no cumplidos')
  })
})
