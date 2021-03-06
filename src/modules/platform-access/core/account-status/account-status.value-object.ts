import { ValueObject } from '@root/shared/value-object';
import { InvalidAccountTypeError } from '../../errors/invalid-account-type.error';

export enum AccountStatusValue {
  WaitingForConfirmation = 'WaitingForConfirmation',
  Confirmed = 'Confirmed',
  Expired = 'Expired',
}

interface AccountStatusProps {
  value: string;
}

export class AccountStatus extends ValueObject<AccountStatusProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static WaitingForConfirmation = new AccountStatus(
    AccountStatusValue.WaitingForConfirmation,
  );

  public static Confirmed = new AccountStatus(AccountStatusValue.Confirmed);

  public static Expired = new AccountStatus(AccountStatusValue.Expired);

  public static fromValue(value: string) {
    switch (value) {
      case AccountStatusValue.WaitingForConfirmation:
        return this.WaitingForConfirmation;

      case AccountStatusValue.Confirmed:
        return this.Confirmed;

      case AccountStatusValue.Expired:
        return this.Expired;

      default:
        throw new InvalidAccountTypeError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
