import type { AcademicPeriodRepository } from '../../../domain/repositories/academic-period-repository.js'
import { NotFoundError } from '../../../shared/errors/index.js'

export class DeleteAcademicPeriodUseCase {
  constructor(private readonly repository: AcademicPeriodRepository) {}
  async execute(id: string): Promise<void> {
    const p = await this.repository.findById(id)
    if (!p) throw new NotFoundError('Período académico')
    await this.repository.delete(id)
  }
}
