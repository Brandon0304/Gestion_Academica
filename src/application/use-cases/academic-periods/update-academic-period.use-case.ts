import type { AcademicPeriodRepository } from '../../../domain/repositories/academic-period-repository.js'
import { AcademicPeriod } from '../../../domain/entities/academic-period.js'
import { NotFoundError } from '../../../shared/errors/index.js'
import type { UpdateAcademicPeriodInput, AcademicPeriodOutput } from '../../dtos/academic-period.js'

export class UpdateAcademicPeriodUseCase {
  constructor(private readonly repository: AcademicPeriodRepository) {}
  async execute(id: string, input: UpdateAcademicPeriodInput): Promise<AcademicPeriodOutput> {
    const p = await this.repository.findById(id)
    if (!p) throw new NotFoundError('Período académico')

    let updated = p
    if (input.status === 'active') updated = updated.open()
    else if (input.status === 'closed') updated = updated.close()
    if (input.name) updated = AcademicPeriod.create({ ...updated['data'], name: input.name })

    await this.repository.update(updated)
    return { id: updated.id, name: updated.name, startDate: updated.startDate.toISOString(), endDate: updated.endDate.toISOString(), enrollmentStart: updated.enrollmentStart.toISOString(), enrollmentEnd: updated.enrollmentEnd.toISOString(), status: updated.status }
  }
}
