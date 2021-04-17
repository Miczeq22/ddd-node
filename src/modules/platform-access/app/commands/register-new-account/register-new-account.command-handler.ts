import { QueryBuilder } from '@infrastructure/database/query-builder';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { performTransactionalOperation } from '@root/framework/transactional-operation';
import { AccountEmailCheckerService } from '../../../core/account-email/account-email-checker.service';
import { AccountRegistration } from '../../../core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '../../../core/account-registration/account-registration.repository';
import {
  RegisterNewAccountCommand,
  REGISTER_NEW_ACCOUNT_COMMAND,
} from './register-new-account.command';

interface Dependencies {
  accountRegistrationRepository: AccountRegistrationRepository;
  accountEmailChecker: AccountEmailCheckerService;
  queryBuilder: QueryBuilder;
}

export class RegisterNewAccountCommandHandler extends CommandHandler<RegisterNewAccountCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(REGISTER_NEW_ACCOUNT_COMMAND);
  }

  public async handle({ payload: { email, password } }: RegisterNewAccountCommand) {
    const { accountRegistrationRepository, accountEmailChecker, queryBuilder } = this.dependencies;

    const account = await AccountRegistration.registerNew(email, password, accountEmailChecker);

    await performTransactionalOperation(
      accountRegistrationRepository.insert.bind(this),
      account,
      queryBuilder,
    );
  }
}
