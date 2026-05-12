import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import type { GetStudentTimetableUseCase, GetTeacherTimetableUseCase } from '../../application/use-cases/timetable/index.js'
import { studentRepository, teacherRepository } from '../../infrastructure/config/di.js'
import { ForbiddenError } from '../../shared/errors/index.js'

export class TimetableController {
  constructor(
    private readonly getStudentTimetableUseCase: GetStudentTimetableUseCase,
    private readonly getTeacherTimetableUseCase: GetTeacherTimetableUseCase,
  ) {}

  async studentTimetable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let studentId = req.params['studentId'] as string
      if (req.user?.role === 'student') {
        const student = await studentRepository.findByUserId(req.user.userId)
        if (!student) throw new ForbiddenError('Estudiante no encontrado')
        studentId = student.id
      }
      const result = await this.getStudentTimetableUseCase.execute(studentId)
      res.status(200).json(result)
    } catch (err) { next(err) }
  }

  async teacherTimetable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let teacherId = req.params['teacherId'] as string
      if (req.user?.role === 'teacher') {
        const teacher = await teacherRepository.findByUserId(req.user.userId)
        if (!teacher) throw new ForbiddenError('Docente no encontrado')
        teacherId = teacher.id
      }
      const result = await this.getTeacherTimetableUseCase.execute(teacherId)
      res.status(200).json(result)
    } catch (err) { next(err) }
  }
}
