import type { CourseGradeReportOutput, StudentAcademicHistoryOutput } from '../../application/dtos/report.js'

export function serializeCourseGradeReport(report: CourseGradeReportOutput) {
  return report
}

export function serializeStudentAcademicHistory(history: StudentAcademicHistoryOutput) {
  return history
}
