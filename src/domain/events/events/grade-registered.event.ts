import { DomainEvent } from '../domain-event.js'

export class GradeRegisteredEvent extends DomainEvent {
  constructor(
    public readonly gradeId: string,
    public readonly studentId: string,
    public readonly courseId: string,
    public readonly grade: number,
    public readonly enrollmentId: string,
  ) {
    super('grade.registered')
  }
}
