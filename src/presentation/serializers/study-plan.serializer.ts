import type { StudyPlanOutput } from '../../application/dtos/study-plan.js'
import type { PaginatedOutput } from '../../application/dtos/student.js'

export function serializeStudyPlan(plan: StudyPlanOutput) {
  return plan
}

export function serializePaginatedStudyPlans(result: PaginatedOutput<StudyPlanOutput>) {
  return result
}
