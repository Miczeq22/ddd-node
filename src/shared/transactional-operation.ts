import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { AggregateRoot } from './aggregate-root';
import { DomainEvents } from './domain-events';

export const performTransactionalOperation = async (
  operation: (aggregate: AggregateRoot<unknown>) => Promise<DatabaseTransaction> | null,
  aggregate: AggregateRoot<unknown>,
  queryBuilder: QueryBuilder,
) => {
  let trx: DatabaseTransaction;

  if (operation === null) {
    trx = await queryBuilder.transaction();
  } else {
    trx = await operation(aggregate);
  }

  try {
    await DomainEvents.dispatchDomainEventsForAggregate(aggregate, trx);

    await trx.commit();
  } catch (error) {
    await trx.rollback();

    throw error;
  }
};
