import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import type { CreateGradeUseCase, GetGradesByEnrollmentUseCase, UpdateGradeUseCase, DeleteGradeUseCase, CalculateFinalGradeUseCase } from '../../application/use-cases/grades/index.js'
import { auditService, notificationService, enrollmentRepository, studentRepository, courseRepository } from '../../infrastructure/config/di.js'
import { ForbiddenError } from '../../shared/errors/index.js'

export class GradesController {
  constructor(
    private createUseCase: CreateGradeUseCase,
    private getByEnrollmentUseCase: GetGradesByEnrollmentUseCase,
    private updateUseCase: UpdateGradeUseCase,
    private deleteUseCase: DeleteGradeUseCase,
    private calculateFinalUseCase: CalculateFinalGradeUseCase,
  ) {}

  create(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.createUseCase.execute(req.body).then(async (r) => {
      auditService.record({ userId: req.user?.userId, action: 'CREATE', entityType: 'Grade', entityId: r.id })
      const enrollment = await enrollmentRepository.findById(r.enrollmentId).catch(() => null)
      if (enrollment) {
        const [student, course] = await Promise.all([
          studentRepository.findById(enrollment.studentId).catch(() => null),
          courseRepository.findById(enrollment.courseId).catch(() => null),
        ])
        if (student && course) {
          notificationService.notifyGrade(student.email.toString(), student.fullName, course.name, r.value, r.evaluationType).catch(() => {})
        }
      }
      res.status(201).json(r)
    }).catch(next)
  }
  async listByEnrollment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.role === 'student') {
        const enrollment = await enrollmentRepository.findById(req.params['enrollmentId'] as string)
        if (enrollment) {
          const student = await studentRepository.findByUserId(req.user.userId)
          if (!student || enrollment.studentId !== student.id) {
            throw new ForbiddenError('No tiene acceso a estas calificaciones')
          }
        }
      }
      const grades = await this.getByEnrollmentUseCase.execute(req.params['enrollmentId'] as string)
      res.status(200).json(grades)
    } catch (err) { next(err) }
  }
  update(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.updateUseCase.execute(req.params['id'] as string, req.body).then((r) => res.status(200).json(r)).catch(next)
  }
  delete(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.deleteUseCase.execute(req.params['id'] as string).then(() => res.status(204).send()).catch(next)
  }
  calculateFinal(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.calculateFinalUseCase.execute(req.params['enrollmentId'] as string).then((r) => res.status(200).json(r)).catch(next)
  }
}
