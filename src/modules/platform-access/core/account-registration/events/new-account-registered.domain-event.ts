import { DomainEvent } from '@root/shared/domain-event';
import { AccountEmail } from '../../account-email/account-email.value-object';

export const NEW_ACCOUNT_REGISTERED_EVENT = 'platform-access/new-account-registered';

export class NewAccountRegisteredEvent extends DomainEvent {
  constructor(public readonly accountEmail: AccountEmail) {
    super(NEW_ACCOUNT_REGISTERED_EVENT);
  }
}
