import { Command } from '@root/shared/processing/command';

interface Payload {
  email: string;
  password: string;
}

export const REGISTER_NEW_ACCOUNT_COMMAND = 'platform-access/register-new-account';

export class RegisterNewAccountCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(REGISTER_NEW_ACCOUNT_COMMAND, payload);
  }
}
