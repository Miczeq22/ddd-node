import { MailerService } from '@infrastructure/mailer/mailer.service';
import { TokenProviderService } from '@infrastructure/token-provider/token-provider.service';
import { DomainEvents } from '@root/shared/domain-events';
import { DomainSubscriber } from '@root/shared/domain-subscriber';
import {
  NewAccountRegisteredEvent,
  NEW_ACCOUNT_REGISTERED_EVENT,
} from '../../core/account-registration/events/new-account-registered.domain-event';

interface Dependencies {
  mailer: MailerService;
  tokenProvider: TokenProviderService;
}

export class NewAccountRegisteredSubscriber extends DomainSubscriber<NewAccountRegisteredEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.sendConfirmationEmail.bind(this), NEW_ACCOUNT_REGISTERED_EVENT);
  }

  private async sendConfirmationEmail(event: NewAccountRegisteredEvent) {
    const { mailer, tokenProvider } = this.dependencies;

    await mailer.sendMail({
      payload: {
        link: mailer.getEmailConfirmationURL(
          tokenProvider.getEmailConfirmationToken(event.accountId),
        ),
      },
      subject: 'Account activation',
      template: 'activate-account',
      to: event.accountEmail.toString(),
    });
  }
}
