import { NewAccountRegisteredSubscriber } from '@root/modules/platform-access/app/subscribers/new-account-registered.subscriber';
import { DomainSubscriber } from '@root/framework/domain-subscriber';
import * as Awilix from 'awilix';
import { registerAsArray } from './app-container';

export const registerSubscribers = (container: Awilix.AwilixContainer) => {
  container.register({
    subscribers: registerAsArray<DomainSubscriber<any>>([
      Awilix.asClass(NewAccountRegisteredSubscriber).singleton(),
    ]),
  });
};
