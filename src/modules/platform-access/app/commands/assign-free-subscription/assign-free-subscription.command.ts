import { Command } from '@root/framework/processing/command';

interface Payload {
  accountId: string;
}

export const ASSIGN_FREE_SUBSCRIPTION_COMMAND = 'platform-access/assign-free-subscription';

export class AssignFreeSubscriptionCommand extends Command<Payload> {
  constructor(accountId: string) {
    super(ASSIGN_FREE_SUBSCRIPTION_COMMAND, { accountId });
  }
}
