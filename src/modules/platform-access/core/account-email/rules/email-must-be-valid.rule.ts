import { BusinessRule } from '@root/framework/business-rule';

export class EmailMustBeValdidRule extends BusinessRule {
  message = 'Provided email is not valid.';

  constructor(private readonly email: string) {
    super();
  }

  public isBroken() {
    return !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email);
  }
}
