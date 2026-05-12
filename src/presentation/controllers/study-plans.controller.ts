import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js'
import type { CreateStudyPlanUseCase, GetStudyPlanUseCase, ListStudyPlansUseCase, UpdateStudyPlanUseCase, DeleteStudyPlanUseCase } from '../../application/use-cases/study-plans/index.js'

export class StudyPlansController {
  constructor(
    private createUseCase: CreateStudyPlanUseCase,
    private getUseCase: GetStudyPlanUseCase,
    private listUseCase: ListStudyPlansUseCase,
    private updateUseCase: UpdateStudyPlanUseCase,
    private deleteUseCase: DeleteStudyPlanUseCase,
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
