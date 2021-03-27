import { BusinessRule } from '@root/framework/business-rule';
import { SubscriptionType } from '../../subscription-type/subscription-type.value-object';

export class SubscriptionMustNotBeSetAlreadyRule extends BusinessRule {
  message = 'Cannot assign new subscription. Subscription is already set.';

  constructor(private readonly subscriptionType: SubscriptionType | null) {
    super();
  }

  public isBroken() {
    return this.subscriptionType !== null;
  }
}
