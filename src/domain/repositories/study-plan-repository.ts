import { StudyPlan } from '../entities/study-plan.js'

export interface StudyPlanRepository {
  findById(id: string): Promise<StudyPlan | null>
  findByCode(code: string): Promise<StudyPlan | null>
  findAll(page: number, pageSize: number): Promise<{ studyPlans: StudyPlan[]; total: number }>
  save(studyPlan: StudyPlan): Promise<void>
  update(studyPlan: StudyPlan): Promise<void>
  delete(id: string): Promise<void>
}
