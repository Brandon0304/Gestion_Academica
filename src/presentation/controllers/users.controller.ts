import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import { ListUsersUseCase, UpdateUserUseCase, CreateUserUseCase } from '../../application/use-cases/users/index.js'
import type { CreateUserInput } from '../../application/dtos/user.js'
import { auditService } from '../../infrastructure/config/di.js'

export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query['page']) || 1
      const pageSize = Number(req.query['pageSize']) || 20
      const result = await this.listUsersUseCase.execute(page, pageSize)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreateUserInput = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      }
      const result = await this.createUserUseCase.execute(input)
      await auditService.record({ userId: req.user?.userId, action: 'CREATE', entityType: 'User', entityId: result.id })
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string
      const result = await this.updateUserUseCase.execute(id, req.body)
      await auditService.record({ userId: req.user?.userId, action: 'UPDATE', entityType: 'User', entityId: id, metadata: req.body })
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}
