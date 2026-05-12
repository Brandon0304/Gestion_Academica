import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import type { CreateAcademicPeriodUseCase, GetAcademicPeriodUseCase, ListAcademicPeriodsUseCase, UpdateAcademicPeriodUseCase, DeleteAcademicPeriodUseCase } from '../../application/use-cases/academic-periods/index.js'

export class AcademicPeriodsController {
  constructor(
    private createUseCase: CreateAcademicPeriodUseCase,
    private getUseCase: GetAcademicPeriodUseCase,
    private listUseCase: ListAcademicPeriodsUseCase,
    private updateUseCase: UpdateAcademicPeriodUseCase,
    private deleteUseCase: DeleteAcademicPeriodUseCase,
  ) {}

  create(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.createUseCase.execute(req.body).then((r) => res.status(201).json(r)).catch(next)
  }
  get(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.getUseCase.execute(req.params['id'] as string).then((r) => res.status(200).json(r)).catch(next)
  }
  list(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const page = Number(req.query['page']) || 1; const ps = Number(req.query['pageSize']) || 20
    this.listUseCase.execute(page, ps).then((r) => res.status(200).json(r)).catch(next)
  }
  update(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.updateUseCase.execute(req.params['id'] as string, req.body).then((r) => res.status(200).json(r)).catch(next)
  }
  delete(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.deleteUseCase.execute(req.params['id'] as string).then(() => res.status(204).send()).catch(next)
  }
}
