import { UnauthorizedError } from '@errors/unauthorized.error';
import { TokenProviderService } from '@infrastructure/token-provider/token-provider.service';
import { DomainEvents } from '@root/framework/domain-events';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { AccountEmail } from '../../core/account-email/account-email.value-object';
import { AccountRepository } from '../../core/account/account.repository';
import { LoginToPlatformCommand, LOGIN_TO_PLATFORM_COMMAND } from './login-to-platform.command';

interface Dependencies {
  accountRepository: AccountRepository;
  tokenProvider: TokenProviderService;
}

export class LoginToPlatformCommandHandler extends CommandHandler<LoginToPlatformCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(LOGIN_TO_PLATFORM_COMMAND);
  }

  public async handle({ payload: { email, password } }: LoginToPlatformCommand) {
    const { accountRepository, tokenProvider } = this.dependencies;

    const account = await accountRepository.getByEmail(AccountEmail.fromPersistence(email));

    if (!account) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    await account.login(password);

    const accessToken = tokenProvider.getPlatformAccessToken(account.getId());

    const refreshToken = tokenProvider.getPlatformRefreshToken(
      account.getId(),
      account.getPassword(),
    );

    await DomainEvents.dispatchDomainEventsForAggregate(account);

    return {
      accessToken,
      refreshToken,
    };
  }
}
