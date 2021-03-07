import { AccountRegistrationRepositoryImpl } from '@root/modules/platform-access/infrastructure/account-registration/account-registration.repository';
import * as Awilix from 'awilix';

export const registerRepositories = (container: Awilix.AwilixContainer) => {
  container.register({
    accountRegistrationRepository: Awilix.asClass(AccountRegistrationRepositoryImpl).singleton(),
  });
};
