import { PlatfromAccessController } from '@root/modules/platform-access/api/platform-access.controller';
import { Controller } from '@root/shared/api/controller';
import * as Awilix from 'awilix';
import { registerAsArray } from './app-container';

export const registerControllers = (container: Awilix.AwilixContainer) => {
  container.register({
    controllers: registerAsArray<Controller>([
      Awilix.asClass(PlatfromAccessController).singleton(),
    ]),
  });
};
