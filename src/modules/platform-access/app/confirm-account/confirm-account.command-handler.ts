import { UnauthorizedError } from '@errors/unauthorized.error';
import { TokenProviderService } from '@infrastructure/token-provider/token-provider.service';
import { CommandHandler } from '@root/shared/processing/command-handler';
import { performTransactionalOperation } from '@root/shared/transactional-operation';
import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountRegistrationRepository } from '../../core/account-registration/account-registration.repository';
import { ConfirmAccountCommand, CONFIRM_ACCOUNT_COMMAND } from './confirm-account.command';

interface Dependencies {
  accountRegistrationRepository: AccountRegistrationRepository;
  tokenProvider: TokenProviderService;
}

export class ConfirmAccountCommandHandler extends CommandHandler<ConfirmAccountCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(CONFIRM_ACCOUNT_COMMAND);
  }

  public async handle({ payload: { token } }: ConfirmAccountCommand) {
    const { accountRegistrationRepository, tokenProvider } = this.dependencies;

    const { accountId } = tokenProvider.decodeEmailConfirmationToken(token);

    const account = await accountRegistrationRepository.findById(new UniqueEntityID(accountId));

    if (!account) {
      throw new UnauthorizedError();
    }

    account.confirmAccount();

    await performTransactionalOperation(accountRegistrationRepository.update.bind(this), account);
  }
}
