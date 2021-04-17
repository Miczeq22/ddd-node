import { Command } from '@root/framework/processing/command';

interface Payload {
  email: string;
  password: string;
}

export const LOGIN_TO_PLATFORM_COMMAND = 'platform-access/login-to-platform';

export class LoginToPlatformCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(LOGIN_TO_PLATFORM_COMMAND, payload);
  }
}
