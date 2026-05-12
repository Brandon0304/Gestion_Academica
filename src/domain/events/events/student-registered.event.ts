import { DomainEvent } from '../domain-event.js'

export class StudentRegisteredEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly studentEmail: string,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {
    super('student.registered')
  }
}
