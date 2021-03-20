import { ValueObject } from '@root/shared/value-object';
import { InvalidSubscriptionTypeError } from '../../errors/invalid-subscription-type.error';

export enum SubscriptionTypeValue {
  Free = 'Free',
  PaidMembership = 'Paid Membership',
}

interface SubscriptionTypeProps {
  value: string;
}

export class SubscriptionType extends ValueObject<SubscriptionTypeProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static Free = new SubscriptionType(SubscriptionTypeValue.Free);

  public static PaidMembership = new SubscriptionType(SubscriptionTypeValue.PaidMembership);

  public static fromValue(value: string) {
    switch (value) {
      case SubscriptionTypeValue.Free:
        return this.Free;

      case SubscriptionTypeValue.PaidMembership:
        return this.PaidMembership;

      default:
        throw new InvalidSubscriptionTypeError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
