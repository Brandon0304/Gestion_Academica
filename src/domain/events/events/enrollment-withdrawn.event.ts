import { DomainEvent } from '../domain-event.js'

export class EnrollmentWithdrawnEvent extends DomainEvent {
  constructor(
    public readonly enrollmentId: string,
    public readonly studentId: string,
    public readonly courseId: string,
  ) {
    super('enrollment.withdrawn')
  }
}
