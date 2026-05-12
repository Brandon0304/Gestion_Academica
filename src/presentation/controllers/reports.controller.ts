import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import type { StudentAcademicHistoryUseCase, CourseGradeReportUseCase } from '../../application/use-cases/reports/index.js'
import { studentRepository, teacherRepository, courseRepository } from '../../infrastructure/config/di.js'
import { ForbiddenError } from '../../shared/errors/index.js'

export class ReportsController {
  constructor(
    private readonly studentAcademicHistoryUseCase: StudentAcademicHistoryUseCase,
    private readonly courseGradeReportUseCase: CourseGradeReportUseCase,
  ) {}

  async studentHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let studentId = req.params['studentId'] as string
      if (req.user?.role === 'student') {
        const student = await studentRepository.findByUserId(req.user.userId)
        if (!student) { res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Estudiante no encontrado' } }); return }
        studentId = student.id
      }
      const result = await this.studentAcademicHistoryUseCase.execute(studentId)
      res.status(200).json(result)
    } catch (err) { next(err) }
  }

  async courseReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseId = req.params['courseId'] as string
      if (req.user?.role === 'teacher') {
        const teacher = await teacherRepository.findByUserId(req.user.userId)
        if (!teacher) throw new ForbiddenError('Docente no encontrado')
        const course = await courseRepository.findById(courseId)
        if (!course || course.teacherId !== teacher.id) {
          throw new ForbiddenError('No tiene acceso a este reporte')
        }
      }
      const result = await this.courseGradeReportUseCase.execute(courseId)
      res.status(200).json(result)
    } catch (err) { next(err) }
  }
}
