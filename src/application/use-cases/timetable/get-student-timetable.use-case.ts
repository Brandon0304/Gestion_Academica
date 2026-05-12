import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import type { ClassroomRepository } from '../../../domain/repositories/classroom-repository.js'
import type { TimetableOutput, TimetableEntry } from '../../dtos/timetable.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class GetStudentTimetableUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly courseRepository: CourseRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly classroomRepository: ClassroomRepository,
  ) {}

  async execute(studentId: string): Promise<TimetableOutput> {
    const student = await this.studentRepository.findById(studentId)
    if (!student) throw new NotFoundError('Estudiante')

    const enrollments = await this.enrollmentRepository.findByStudent(studentId)

    const entries: TimetableEntry[] = []
    for (const enrollment of enrollments) {
      if (enrollment.status === 'withdrawn') continue

      const course = await this.courseRepository.findById(enrollment.courseId)
      if (!course || !course.schedule) continue

      const schedule = course.schedule.toJSON()

      let teacherName = '-'
      if (course.teacherId) {
        const teacher = await this.teacherRepository.findById(course.teacherId)
        if (teacher) teacherName = `${teacher.firstName} ${teacher.lastName}`
      }

      let classroomName = '-'
      if (course.classroomId) {
        const classroom = await this.classroomRepository.findById(course.classroomId)
        if (classroom) classroomName = classroom.name ?? '-'
      }

      entries.push({
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        teacherName,
        classroomName,
        days: schedule.days,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      })
    }

    return { entries }
  }
}
