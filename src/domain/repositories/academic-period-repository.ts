import { AcademicPeriod } from '../entities/academic-period.js'

export interface AcademicPeriodRepository {
  findById(id: string): Promise<AcademicPeriod | null>
  findAll(page: number, pageSize: number): Promise<{ periods: AcademicPeriod[]; total: number }>
  save(period: AcademicPeriod): Promise<void>
  update(period: AcademicPeriod): Promise<void>
  delete(id: string): Promise<void>
}
