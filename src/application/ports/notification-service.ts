export interface NotificationServicePort {
  notifyEnrollment(studentEmail: string, studentName: string, courseName: string): Promise<void>
  notifyGrade(studentEmail: string, studentName: string, courseName: string, grade: number, evaluationType: string): Promise<void>
}
