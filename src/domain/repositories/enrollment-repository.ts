import { Enrollment } from '../entities/enrollment.js'

export interface EnrollmentRepository {
  findById(id: string): Promise<Enrollment | null>
  findByStudentAndCourse(studentId: string, courseId: string): Promise<Enrollment | null>
  findByStudent(studentId: string): Promise<Enrollment[]>
  findByCourse(courseId: string): Promise<Enrollment[]>
  findAll(page: number, pageSize: number): Promise<{ enrollments: Enrollment[]; total: number }>
  save(enrollment: Enrollment): Promise<void>
  update(enrollment: Enrollment): Promise<void>
  delete(id: string): Promise<void>
  countByCourse(courseId: string): Promise<number>
  findApprovedByStudent(studentId: string): Promise<Enrollment[]>
  findApprovedByStudentAndSubject(studentId: string, subjectId: string): Promise<Enrollment | null>
}
