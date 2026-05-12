import type { AcademicPeriodRepository } from '../repositories/academic-period-repository.js'
import type { CourseRepository } from '../repositories/course-repository.js'
import type { EnrollmentRepository } from '../repositories/enrollment-repository.js'
import type { SubjectRepository } from '../repositories/subject-repository.js'
import { ConflictError } from '../../shared/errors/index.js'

export class EnrollmentValidator {
  constructor(
    private readonly academicPeriodRepository: AcademicPeriodRepository,
    private readonly courseRepository: CourseRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly subjectRepository: SubjectRepository,
  ) {}

  async validate(courseId: string, studentId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId)
    if (!course) throw new ConflictError('Curso no encontrado')

    if (course.status !== 'open') {
      throw new ConflictError('El curso no está abierto para inscripciones')
    }

    const period = course.academicPeriodId
      ? await this.academicPeriodRepository.findById(course.academicPeriodId)
      : null
    if (period && !period.isEnrollmentOpen()) {
      throw new ConflictError('El período de inscripciones está cerrado')
    }

    const enrolledCount = await this.enrollmentRepository.countByCourse(courseId)
    if (!course.hasAvailableCapacity(enrolledCount)) {
      throw new ConflictError('El curso ha alcanzado su capacidad máxima')
    }

    const existing = await this.enrollmentRepository.findByStudentAndCourse(studentId, courseId)
    if (existing) {
      throw new ConflictError('El estudiante ya está inscrito en este curso')
    }

    if (course.schedule) {
      const conflicting = await this.courseRepository.findConflictingSchedules(
        course.schedule, course.academicPeriodId, studentId, courseId,
      )
      if (conflicting.length > 0) {
        const c = conflicting[0]!
        throw new ConflictError('El horario del curso coincide con otro curso', [
          { field: 'schedule', message: `Choque con ${c.name} (${c.schedule?.toJSON().days.join(', ')} ${c.schedule?.toJSON().startTime}-${c.schedule?.toJSON().endTime})` },
        ])
      }
    }

    const prerequisites = await this.subjectRepository.findPrerequisites(course.subjectId)
    if (prerequisites.length > 0) {
      const missing: string[] = []
      for (const prereq of prerequisites) {
        const approved = await this.enrollmentRepository.findApprovedByStudentAndSubject(studentId, prereq.id)
        if (!approved) {
          missing.push(prereq.name)
        }
      }
      if (missing.length > 0) {
        throw new ConflictError('Prerrequisitos no cumplidos', [
          { field: 'prerequisites', message: `El estudiante no ha aprobado: ${missing.join(', ')}` },
        ])
      }
    }
  }
}
