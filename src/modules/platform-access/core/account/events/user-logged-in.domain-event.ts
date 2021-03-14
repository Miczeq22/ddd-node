import { DomainEvent } from '@root/shared/domain-event';
import { AccountEmail } from '../../account-email/account-email.value-object';

export const USER_LOGGED_IN_EVENT = 'platform-access/user-logged-in';

export class UserLoggedInEvent extends DomainEvent {
  constructor(public readonly userEmail: AccountEmail) {
    super(USER_LOGGED_IN_EVENT);
  }
}
