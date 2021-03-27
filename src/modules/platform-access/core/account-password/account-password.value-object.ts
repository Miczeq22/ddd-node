import { ValueObject } from '@root/framework/value-object';
import bcrypt from 'bcrypt';
import { PasswordMustBeStrongRule } from './rules/password-must-be-strong.rule';

interface AccountPasswordProps {
  value: string;
}

export class AccountPassword extends ValueObject<AccountPasswordProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static async createNew(plainString: string) {
    AccountPassword.checkRule(new PasswordMustBeStrongRule(plainString));

    const passwordHash = await bcrypt.hash(plainString, 10);

    return new AccountPassword(passwordHash);
  }

  public static fromPersistence(passwordHash: string) {
    return new AccountPassword(passwordHash);
  }

  public getValue() {
    return this.props.value;
  }
}
