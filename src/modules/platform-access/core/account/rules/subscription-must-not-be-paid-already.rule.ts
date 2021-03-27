import { BusinessRule } from '@root/framework/business-rule';
import { SubscriptionType } from '../../subscription-type/subscription-type.value-object';

export class SubscriptionMustNotBePaidAlreadyRule extends BusinessRule {
  message = 'Cannot assign paid membership. Subscription is already paid.';

  constructor(private readonly subscriptionType: SubscriptionType | null) {
    super();
  }

  public isBroken() {
    return this.subscriptionType && this.subscriptionType.equals(SubscriptionType.PaidMembership);
  }
}
