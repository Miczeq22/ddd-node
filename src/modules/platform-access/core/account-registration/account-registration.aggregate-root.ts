import { AggregateRoot } from '@root/shared/aggregate-root';
import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountEmailCheckerService } from '../account-email/account-email-checker.service';
import { AccountEmail } from '../account-email/account-email.value-object';
import { AccountPassword } from '../account-password/account-password.value-object';
import { AccountStatus } from '../account-status/account-status.value-object';

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
    return new AccountRegistration({
      email: await AccountEmail.createNew(email, accountEmailChecker),
      password: await AccountPassword.createNew(password),
      confirmationDate: null,
      registrationDate: new Date(),
      status: AccountStatus.WaitingForConfirmation,
    });
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
