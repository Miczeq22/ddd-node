import { UnauthorizedError } from '@errors/unauthorized.error';
import { CommandHandler } from '@root/shared/processing/command-handler';
import { performTransactionalOperation } from '@root/shared/transactional-operation';
import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountRepository } from '../../core/account/account.repository';
import {
  AssignFreeSubscriptionCommand,
  ASSIGN_FREE_SUBSCRIPTION_COMMAND,
} from './assign-free-subscription.command';

interface Dependencies {
  accountRepository: AccountRepository;
}

export class AssignFreeSubscriptionCommandHandler extends CommandHandler<AssignFreeSubscriptionCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(ASSIGN_FREE_SUBSCRIPTION_COMMAND);
  }

  public async handle({ payload: { accountId } }: AssignFreeSubscriptionCommand) {
    const { accountRepository } = this.dependencies;

    const account = await accountRepository.getById(new UniqueEntityID(accountId));

    if (!account) {
      throw new UnauthorizedError();
    }

    account.assignFreeMembership();

    await performTransactionalOperation(accountRepository.update.bind(this), account);
  }
}
