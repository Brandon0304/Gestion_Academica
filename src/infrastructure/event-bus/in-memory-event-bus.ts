import type { EventBus, DomainEventHandler } from '../../domain/events/event-bus.js'
import type { DomainEvent } from '../../domain/events/domain-event.js'

export class InMemoryEventBus implements EventBus {
  private handlers = new Map<string, DomainEventHandler[]>()

  subscribe(eventName: string, handler: DomainEventHandler): void {
    const handlers = this.handlers.get(eventName) ?? []
    handlers.push(handler)
    this.handlers.set(eventName, handlers)
  }

  unsubscribe(eventName: string, handler: DomainEventHandler): void {
    const handlers = this.handlers.get(eventName) ?? []
    this.handlers.set(eventName, handlers.filter((h) => h !== handler))
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? []
    await Promise.all(handlers.map((h) => h(event)))
  }
}
