import { Command } from '@root/framework/processing/command';

interface Payload {
  token: string;
}

export const CONFIRM_ACCOUNT_COMMAND = 'platform-access/confirm-account';

export class ConfirmAccountCommand extends Command<Payload> {
  constructor(token: string) {
    super(CONFIRM_ACCOUNT_COMMAND, { token });
  }
}
