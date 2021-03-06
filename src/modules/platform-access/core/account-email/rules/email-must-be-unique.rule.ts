import { BusinessRule } from '@root/shared/business-rule';
import { AccountEmailCheckerService } from '../account-email-checker.service';

export class EmailMustBeUniqueRule extends BusinessRule {
  message = 'Provided email is not unique. Please choose different email address.';

  constructor(
    private readonly email: string,
    private readonly accountEmailChecker: AccountEmailCheckerService,
  ) {
    super();
  }

  public async isBroken() {
    return !(await this.accountEmailChecker.isUnique(this.email));
  }
}
