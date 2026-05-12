import type { DomainEvent } from './domain-event.js'

export type DomainEventHandler = (event: DomainEvent) => Promise<void>

export interface EventBus {
  publish(event: DomainEvent): Promise<void>
  subscribe(eventName: string, handler: DomainEventHandler): void
  unsubscribe(eventName: string, handler: DomainEventHandler): void
}
