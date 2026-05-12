import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import type { CreateCourseUseCase, GetCourseUseCase, ListCoursesUseCase, UpdateCourseUseCase, DeleteCourseUseCase, ChangeCourseStatusUseCase } from '../../application/use-cases/courses/index.js'
import { teacherRepository } from '../../infrastructure/config/di.js'
import { ForbiddenError } from '../../shared/errors/index.js'

export class CoursesController {
  constructor(
    private createUseCase: CreateCourseUseCase,
    private getUseCase: GetCourseUseCase,
    private listUseCase: ListCoursesUseCase,
    private updateUseCase: UpdateCourseUseCase,
    private deleteUseCase: DeleteCourseUseCase,
    private changeStatusUseCase: ChangeCourseStatusUseCase,
  ) {}

  create(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.createUseCase.execute(req.body).then((r) => res.status(201).json(r)).catch(next)
  }
  async get(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const course = await this.getUseCase.execute(req.params['id'] as string)
      if (req.user?.role === 'teacher') {
        const teacher = await teacherRepository.findByUserId(req.user.userId)
        if (!teacher || course.teacherId !== teacher.id) {
          throw new ForbiddenError('No tiene acceso a este curso')
        }
      }
      res.status(200).json(course)
    } catch (err) { next(err) }
  }
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query['page']) || 1; const ps = Number(req.query['pageSize']) || 20
      const filters: Record<string, string> = {}
      for (const key of ['academicPeriodId', 'subjectId', 'teacherId', 'status'] as const) {
        const v = req.query[key] as string | undefined
        if (v) filters[key] = v
      }
      if (req.user?.role === 'teacher') {
        const teacher = await teacherRepository.findByUserId(req.user.userId)
        if (teacher) filters['teacherId'] = teacher.id
      }
      const result = await this.listUseCase.execute(page, ps, filters)
      res.status(200).json(result)
    } catch (err) { next(err) }
  }
  update(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.updateUseCase.execute(req.params['id'] as string, req.body).then((r) => res.status(200).json(r)).catch(next)
  }
  delete(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.deleteUseCase.execute(req.params['id'] as string).then(() => res.status(204).send()).catch(next)
  }
  changeStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.changeStatusUseCase.execute(req.params['id'] as string, req.body['status'] as string).then((r) => res.status(200).json(r)).catch(next)
  }
}
