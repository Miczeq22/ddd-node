import { AggregateRoot } from '@root/framework/aggregate-root';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountEmailCheckerService } from '../account-email/account-email-checker.service';
import { AccountEmail } from '../account-email/account-email.value-object';
import { AccountPassword } from '../account-password/account-password.value-object';
import { AccountStatus } from '../account-status/account-status.value-object';
import { NewAccountRegisteredEvent } from './events/new-account-registered.domain-event';
import { AccountCannotBeAlreadyConfirmedRule } from './rules/account-cannot-be-already-confirmed.rule';

interface AccountRegistrationProps {
  email: AccountEmail;
  password: AccountPassword;
  registrationDate: Date;
  confirmationDate: Date | null;
  status: AccountStatus;
}

export class AccountRegistration extends AggregateRoot<AccountRegistrationProps> {
  private constructor(props: AccountRegistrationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async registerNew(
    email: string,
    password: string,
    accountEmailChecker: AccountEmailCheckerService,
  ) {
    const account = new AccountRegistration({
      email: await AccountEmail.createNew(email, accountEmailChecker),
      password: await AccountPassword.createNew(password),
      confirmationDate: null,
      registrationDate: new Date(),
      status: AccountStatus.WaitingForConfirmation,
    });

    account.addDomainEvent(new NewAccountRegisteredEvent(account.getEmail(), account.getId()));

    return account;
  }

  public static fromPersistence(props: AccountRegistrationProps, id: UniqueEntityID) {
    return new AccountRegistration(props, id);
  }

  public confirmAccount() {
    AccountRegistration.checkRule(new AccountCannotBeAlreadyConfirmedRule(this.props.status));

    this.props.status = AccountStatus.Confirmed;
    this.props.confirmationDate = new Date();
  }

  public getEmail() {
    return this.props.email;
  }

  public getPassword() {
    return this.props.password;
  }

  public getRegistrationDate() {
    return this.props.registrationDate;
  }

  public getConfirmationDate() {
    return this.props.confirmationDate;
  }

  public getStatus() {
    return this.props.status;
  }
}
