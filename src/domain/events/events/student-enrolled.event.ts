import { DomainEvent } from '../domain-event.js'

export class StudentEnrolledEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly courseId: string,
    public readonly enrollmentId: string,
    public readonly studentEmail: string,
    public readonly courseName: string,
  ) {
    super('student.enrolled')
  }
}
