import { BusinessRule } from '@root/shared/business-rule';
import { AccountStatus } from '../../account-status/account-status.value-object';

export class AccountMustBeConfirmedRule extends BusinessRule {
  message = 'Your account is not confirmed. Please check your email.';

  constructor(private readonly status: AccountStatus) {
    super();
  }

  public isBroken() {
    return !this.status.equals(AccountStatus.Confirmed);
  }
}
