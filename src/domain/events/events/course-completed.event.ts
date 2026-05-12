import { DomainEvent } from '../domain-event.js'

export class CourseCompletedEvent extends DomainEvent {
  constructor(
    public readonly courseId: string,
    public readonly courseName: string,
  ) {
    super('course.completed')
  }
}
