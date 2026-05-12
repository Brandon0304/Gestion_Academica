import { Grade } from '../entities/grade.js'

export interface GradeRepository {
  findById(id: string): Promise<Grade | null>
  findByEnrollment(enrollmentId: string): Promise<Grade[]>
  findByCourse(courseId: string): Promise<Grade[]>
  save(grade: Grade): Promise<void>
  update(grade: Grade): Promise<void>
  delete(id: string): Promise<void>
  sumPercentagesByEnrollment(enrollmentId: string): Promise<number>
  countByEnrollment(enrollmentId: string): Promise<number>
}
