import { UnauthorizedError } from '@errors/unauthorized.error';
import { AggregateRoot } from '@root/shared/aggregate-root';
import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountEmail } from '../account-email/account-email.value-object';
import { AccountPassword } from '../account-password/account-password.value-object';
import { AccountStatus } from '../account-status/account-status.value-object';
import { UserLoggedInEvent } from './events/user-logged-in.domain-event';
import { AccountMustBeConfirmedRule } from './rules/account-must-be-confirmed.rule';
import { PasswordMustBeValidRule } from './rules/password-must-be-valid.rule';

interface AccountProps {
  email: AccountEmail;
  password: AccountPassword;
  status: AccountStatus;
}

export class Account extends AggregateRoot<AccountProps> {
  private constructor(props: AccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence(props: AccountProps, id: UniqueEntityID) {
    return new Account(props, id);
  }

  public async login(password: string) {
    await Account.checkRule(
      new PasswordMustBeValidRule(password, this.props.password),
      UnauthorizedError,
    );

    Account.checkRule(new AccountMustBeConfirmedRule(this.props.status));

    this.addDomainEvent(new UserLoggedInEvent(this.props.email));
  }

  public getEmail() {
    return this.props.email;
  }

  public getPassword() {
    return this.props.password;
  }

  public getStatus() {
    return this.props.status;
  }
}
