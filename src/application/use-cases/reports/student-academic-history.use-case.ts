import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import type { EnrollmentRepository } from '../../../domain/repositories/enrollment-repository.js'
import type { GradeRepository } from '../../../domain/repositories/grade-repository.js'
import type { CourseRepository } from '../../../domain/repositories/course-repository.js'
import type { AcademicPeriodRepository } from '../../../domain/repositories/academic-period-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { StudentAcademicHistoryOutput } from '../../dtos/report.js'

export class StudentAcademicHistoryUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly gradeRepository: GradeRepository,
    private readonly courseRepository: CourseRepository,
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async execute(studentId: string): Promise<StudentAcademicHistoryOutput> {
    const student = await this.studentRepository.findById(studentId)
    if (!student) throw new NotFoundError('Estudiante')

    const enrollments = await this.enrollmentRepository.findByStudent(studentId)
    const records = await Promise.all(
      enrollments.map(async (e) => {
        const [grades, course] = await Promise.all([
          this.gradeRepository.findByEnrollment(e.id),
          this.courseRepository.findById(e.courseId),
        ])
        const period = course?.academicPeriodId
          ? await this.academicPeriodRepository.findById(course.academicPeriodId)
          : null
        return {
          courseId: e.courseId,
          courseCode: course?.code ?? '',
          courseName: course?.name ?? '',
          academicPeriod: period?.name ?? '',
          status: e.status,
          finalGrade: e.finalGrade,
          grades: grades.map((g) => ({
            evaluationType: g.evaluationType,
            value: g.value,
            percentage: g.percentage,
            maxValue: g.maxValue,
            weightedValue: g.weightedValue,
            observation: g.observation,
            registeredAt: g.registeredAt.toISOString(),
          })),
        }
      }),
    )

    const approvedGrades = records
      .filter((r) => r.finalGrade !== null && r.status === 'approved')
      .map((r) => r.finalGrade as number)

    const overallAverage = approvedGrades.length > 0
      ? approvedGrades.reduce((a, b) => a + b, 0) / approvedGrades.length
      : null

    return {
      studentId: student.id,
      studentName: student.fullName,
      email: student.email.toString(),
      documentId: student.documentId.toString(),
      enrollments: records,
      overallAverage,
    }
  }
}
