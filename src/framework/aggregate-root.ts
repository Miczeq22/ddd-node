import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';
import { Entity } from './entity';

export abstract class AggregateRoot<AggregateProps> extends Entity<AggregateProps> {
  private domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);

    DomainEvents.markAggregateForDispatch(this);
  }

  public getDomainEvents() {
    return [...this.domainEvents];
  }

  public clearDomainEvents() {
    this.domainEvents = [];
  }

  public getAggregateName() {
    return AggregateRoot.name;
  }
}
