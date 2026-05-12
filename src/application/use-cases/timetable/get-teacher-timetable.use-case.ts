import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import type { ClassroomRepository } from '../../../domain/repositories/classroom-repository.js'
import type { TimetableOutput, TimetableEntry } from '../../dtos/timetable.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class GetTeacherTimetableUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly classroomRepository: ClassroomRepository,
  ) {}

  async execute(teacherId: string): Promise<TimetableOutput> {
    const teacher = await this.teacherRepository.findById(teacherId)
    if (!teacher) throw new NotFoundError('Docente')

    const { courses } = await this.courseRepository.findAll(1, 500, { teacherId })
    const teacherName = `${teacher.firstName} ${teacher.lastName}`

    const entries: TimetableEntry[] = []
    for (const course of courses) {
      if (!course.schedule) continue

      const schedule = course.schedule.toJSON()

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
