import { DomainEvent } from '@root/framework/domain-event';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountEmail } from '../../account-email/account-email.value-object';

export const NEW_ACCOUNT_REGISTERED_EVENT = 'platform-access/new-account-registered';

export class NewAccountRegisteredEvent extends DomainEvent {
  constructor(
    public readonly accountEmail: AccountEmail,
    public readonly accountId: UniqueEntityID,
  ) {
    super(NEW_ACCOUNT_REGISTERED_EVENT);
  }
}
