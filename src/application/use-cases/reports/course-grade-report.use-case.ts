import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import type { TeacherRepository } from '../../../domain/repositories/teacher-repository.js'
import type { AcademicPeriodRepository } from '../../../domain/repositories/academic-period-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { CourseGradeReportOutput } from '../../dtos/report.js'

export class CourseGradeReportUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly studentRepository: StudentRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async execute(courseId: string): Promise<CourseGradeReportOutput> {
    const course = await this.courseRepository.findById(courseId)
    if (!course) throw new NotFoundError('Curso')

    const [enrollments, teacher, period] = await Promise.all([
      this.enrollmentRepository.findByCourse(courseId),
      this.teacherRepository.findById(course.teacherId),
      this.academicPeriodRepository.findById(course.academicPeriodId),
    ])

    const approved = enrollments.filter((e) => e.status === 'approved')
    const failed = enrollments.filter((e) => e.status === 'failed')
    const withdrawn = enrollments.filter((e) => e.status === 'withdrawn')

    const grades = enrollments
      .map((e) => e.finalGrade)
      .filter((g): g is number => g !== null)

    const averageGrade = grades.length > 0
      ? grades.reduce((a, b) => a + b, 0) / grades.length
      : null

    const studentIds = [...new Set(enrollments.map((e) => e.studentId))]
    const studentMap = new Map<string, string>()
    await Promise.all(
      studentIds.map(async (sid) => {
        const s = await this.studentRepository.findById(sid)
        if (s) studentMap.set(sid, s.fullName)
      }),
    )

    return {
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      academicPeriod: period?.name ?? '',
      teacherName: teacher?.fullName ?? '',
      totalEnrolled: enrollments.length,
      approvedCount: approved.length,
      failedCount: failed.length,
      withdrawnCount: withdrawn.length,
      averageGrade,
      students: enrollments.map((e) => ({
        studentId: e.studentId,
        studentName: studentMap.get(e.studentId) ?? '',
        finalGrade: e.finalGrade,
        status: e.status,
      })),
    }
  }
}
