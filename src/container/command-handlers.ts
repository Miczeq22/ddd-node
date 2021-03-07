import { RegisterNewAccountCommandHandler } from '@root/modules/platform-access/app/register-new-account/register-new-account.command-handler';
import { CommandHandler } from '@root/shared/processing/command-handler';
import * as Awilix from 'awilix';
import { registerAsArray } from './app-container';

export const registerCommandHandlers = (container: Awilix.AwilixContainer) => {
  container.register({
    commandHandlers: registerAsArray<CommandHandler<any>>([
      Awilix.asClass(RegisterNewAccountCommandHandler).singleton(),
    ]),
  });
};
