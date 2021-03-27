import { ConfirmAccountCommandHandler } from '@root/modules/platform-access/app/confirm-account/confirm-account.command-handler';
import { LoginToPlatformCommandHandler } from '@root/modules/platform-access/app/login-to-platform/login-to-platform.command-handler';
import { RegisterNewAccountCommandHandler } from '@root/modules/platform-access/app/register-new-account/register-new-account.command-handler';
import { CommandHandler } from '@root/framework/processing/command-handler';
import * as Awilix from 'awilix';
import { registerAsArray } from './app-container';

export const registerCommandHandlers = (container: Awilix.AwilixContainer) => {
  container.register({
    commandHandlers: registerAsArray<CommandHandler<any>>([
      Awilix.asClass(RegisterNewAccountCommandHandler).singleton(),
      Awilix.asClass(LoginToPlatformCommandHandler).singleton(),
      Awilix.asClass(ConfirmAccountCommandHandler).singleton(),
    ]),
  });
};
