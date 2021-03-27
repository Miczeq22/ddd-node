import { BusinessRule } from '@root/framework/business-rule';
import { AccountStatus } from '../../account-status/account-status.value-object';

export class AccountCannotBeAlreadyConfirmedRule extends BusinessRule {
  message = 'Account is already confirmed.';

  constructor(private readonly status: AccountStatus) {
    super();
  }

  public isBroken() {
    return this.status.equals(AccountStatus.Confirmed);
  }
}
