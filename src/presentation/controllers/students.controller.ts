import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import {
  CreateStudentUseCase,
  GetStudentUseCase,
  ListStudentsUseCase,
  UpdateStudentUseCase,
  DeleteStudentUseCase,
} from '../../application/use-cases/students/index.js'
import { auditService, studentRepository } from '../../infrastructure/config/di.js'
import { ForbiddenError } from '../../shared/errors/index.js'

export class StudentsController {
  constructor(
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly getStudentUseCase: GetStudentUseCase,
    private readonly listStudentsUseCase: ListStudentsUseCase,
    private readonly updateStudentUseCase: UpdateStudentUseCase,
    private readonly deleteStudentUseCase: DeleteStudentUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createStudentUseCase.execute(req.body)
      await auditService.record({ userId: req.user?.userId, action: 'CREATE', entityType: 'Student', entityId: result.id })
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  async get(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string
      if (req.user?.role === 'student') {
        const student = await studentRepository.findByUserId(req.user.userId)
        if (!student || student.id !== id) {
          throw new ForbiddenError('No tiene acceso a este perfil')
        }
      }
      const result = await this.getStudentUseCase.execute(id)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.role === 'student') {
        const student = await studentRepository.findByUserId(req.user.userId)
        if (!student) { res.status(200).json({ data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } }); return }
        const result = await this.getStudentUseCase.execute(student.id)
        res.status(200).json({ data: [result], pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 } })
        return
      }
      const page = Number(req.query['page']) || 1
      const pageSize = Number(req.query['pageSize']) || 20
      const result = await this.listStudentsUseCase.execute(page, pageSize)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string
      const result = await this.updateStudentUseCase.execute(id, req.body)
      await auditService.record({ userId: req.user?.userId, action: 'UPDATE', entityType: 'Student', entityId: id })
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string
      await this.deleteStudentUseCase.execute(id)
      await auditService.record({ userId: req.user?.userId, action: 'DELETE', entityType: 'Student', entityId: id })
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
}
