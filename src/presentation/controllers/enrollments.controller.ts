import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import type { CreateEnrollmentUseCase, GetEnrollmentUseCase, ListEnrollmentsUseCase, ChangeEnrollmentStatusUseCase } from '../../application/use-cases/enrollments/index.js'
import { auditService, notificationService, studentRepository, courseRepository } from '../../infrastructure/config/di.js'
import { ForbiddenError } from '../../shared/errors/index.js'

export class EnrollmentsController {
  constructor(
    private createUseCase: CreateEnrollmentUseCase,
    private getUseCase: GetEnrollmentUseCase,
    private listUseCase: ListEnrollmentsUseCase,
    private changeStatusUseCase: ChangeEnrollmentStatusUseCase,
  ) {}

  create(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.createUseCase.execute(req.body).then(async (r) => {
      auditService.record({ userId: req.user?.userId, action: 'CREATE', entityType: 'Enrollment', entityId: r.id })
      const student = await studentRepository.findById(r.studentId).catch(() => null)
      const course = await courseRepository.findById(r.courseId).catch(() => null)
      if (student && course) {
        notificationService.notifyEnrollment(student.email.toString(), student.fullName, course.name).catch(() => {})
      }
      res.status(201).json(r)
    }).catch(next)
  }
  async get(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const enrollment = await this.getUseCase.execute(req.params['id'] as string)
      if (req.user?.role === 'student') {
        const student = await studentRepository.findByUserId(req.user.userId)
        if (!student || enrollment.studentId !== student.id) {
          throw new ForbiddenError('No tiene acceso a esta inscripción')
        }
      }
      res.status(200).json(enrollment)
    } catch (err) { next(err) }
  }
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query['page']) || 1; const ps = Number(req.query['pageSize']) || 20
      let studentId: string | undefined
      if (req.user?.role === 'student') {
        const student = await studentRepository.findByUserId(req.user.userId)
        studentId = student?.id
      }
      const result = await this.listUseCase.execute(page, ps, studentId)
      res.status(200).json(result)
    } catch (err) { next(err) }
  }
  changeStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const { status, grade } = req.body
    this.changeStatusUseCase.execute(req.params['id'] as string, status, grade).then((r) => res.status(200).json(r)).catch(next)
  }
}
