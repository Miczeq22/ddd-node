import { BusinessRule } from '@root/framework/business-rule';
import { AccountPassword } from '../../account-password/account-password.value-object';
import bcrypt from 'bcrypt';

export class PasswordMustBeValidRule extends BusinessRule {
  message = 'Invalid email or password.';

  constructor(
    private readonly providedPassword: string,
    private readonly accountPassword: AccountPassword,
  ) {
    super();
  }

  public async isBroken() {
    return !(await bcrypt.compare(this.providedPassword, this.accountPassword.getValue()));
  }
}
