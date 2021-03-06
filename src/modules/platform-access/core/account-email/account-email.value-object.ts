import { ValueObject } from '@root/shared/value-object';
import { AccountEmailCheckerService } from './account-email-checker.service';
import { EmailMustBeUniqueRule } from './rules/email-must-be-unique.rule';
import { EmailMustBeValdidRule } from './rules/email-must-be-valid.rule';

interface AccountEmailProps {
  localPart: string;
  domain: string;
}

export class AccountEmail extends ValueObject<AccountEmailProps> {
  private constructor(props: AccountEmailProps) {
    super(props);
  }

  public static async createNew(email: string, accountEmailChecker: AccountEmailCheckerService) {
    AccountEmail.checkRule(new EmailMustBeValdidRule(email));

    await AccountEmail.checkRule(new EmailMustBeUniqueRule(email, accountEmailChecker));

    return this.convertEmailToParts(email);
  }

  public static fromPersistence(email: string) {
    AccountEmail.checkRule(new EmailMustBeValdidRule(email));

    return this.convertEmailToParts(email);
  }

  public getLocalPart() {
    return this.props.localPart;
  }

  public getDomain() {
    return this.props.domain;
  }

  public toString() {
    return `${this.props.localPart}@${this.props.domain}`;
  }

  private static convertEmailToParts(email: string) {
    const [localPart, domain] = email.split('@');

    return new AccountEmail({
      localPart,
      domain,
    });
  }
}
