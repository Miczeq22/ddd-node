import { ConfirmAccountCommandHandler } from '@root/modules/platform-access/app/commands/confirm-account/confirm-account.command-handler';
import { LoginToPlatformCommandHandler } from '@root/modules/platform-access/app/commands/login-to-platform/login-to-platform.command-handler';
import { RegisterNewAccountCommandHandler } from '@root/modules/platform-access/app/commands/register-new-account/register-new-account.command-handler';
import { CommandHandler } from '@root/framework/processing/command-handler';
import * as Awilix from 'awilix';
import { registerAsArray } from './app-container';
import { AssignFreeSubscriptionCommandHandler } from '@root/modules/platform-access/app/commands/assign-free-subscription/assign-free-subscription.command-handler';

export const registerCommandHandlers = (container: Awilix.AwilixContainer) => {
  container.register({
    commandHandlers: registerAsArray<CommandHandler<any>>([
      Awilix.asClass(RegisterNewAccountCommandHandler).singleton(),
      Awilix.asClass(LoginToPlatformCommandHandler).singleton(),
      Awilix.asClass(ConfirmAccountCommandHandler).singleton(),
      Awilix.asClass(AssignFreeSubscriptionCommandHandler).singleton(),
    ]),
  });
};
