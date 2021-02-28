/* eslint-disable no-await-in-loop */
import { AggregateRoot } from './aggregate-root';
import { DomainEvent } from './domain-event';

export class DomainEvents {
  private static handlersMap = new Map<string, Function[]>();

  private static markedAggregatesMap = new Map<string, AggregateRoot<unknown>>();

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const key = this.getAggregateKey(aggregate);

    if (!this.markedAggregatesMap.has(key)) {
      this.markedAggregatesMap.set(key, aggregate);
    }
  }

  public static async dispatchDomainEventsForAggregate(aggregate: AggregateRoot<unknown>) {
    const key = this.getAggregateKey(aggregate);

    if (this.markedAggregatesMap.has(key)) {
      const promises = this.markedAggregatesMap
        .get(key)
        .getDomainEvents()
        .map((event) => this.dispatch(event));
      aggregate.clearDomainEvents();

      await Promise.all(promises);

      this.markedAggregatesMap.delete(key);
    }
  }

  public static register(callback: (event: DomainEvent) => void, eventName: string) {
    if (!this.handlersMap.has(eventName)) {
      this.handlersMap.set(eventName, []);
    }

    this.handlersMap.set(eventName, [...this.handlersMap.get(eventName), callback]);
  }

  public static clearHandlers() {
    this.handlersMap.clear();
  }

  public static clearMarkedAggregates() {
    this.markedAggregatesMap.clear();
  }

  private static async dispatch(event: DomainEvent) {
    if (this.handlersMap.has(event.name)) {
      const handlers = this.handlersMap.get(event.name);

      for (const handler of handlers) {
        await handler(event);
      }
    }
  }

  private static getAggregateKey(aggregate: AggregateRoot<unknown>) {
    return `${aggregate.getId().getValue()}_${aggregate.constructor.name}`;
  }
}
