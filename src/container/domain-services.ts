import { AccountEmailCheckerServiceImpl } from '@root/modules/platform-access/infrastructure/account-email-checker/account-email-checker.service';
import * as Awilix from 'awilix';

export const registerDomainServices = (container: Awilix.AwilixContainer) => {
  container.register({
    accountEmailChecker: Awilix.asClass(AccountEmailCheckerServiceImpl).singleton(),
  });
};
