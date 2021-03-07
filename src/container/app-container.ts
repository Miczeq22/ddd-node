import { Server } from '@api/server';
import * as Awilix from 'awilix';
import { registerCommandHandlers } from './command-handlers';
import { registerRepositories } from './repositories';
import { registerControllers } from './controllers';
import { CommandBus } from '@root/shared/processing/command-bus';
import { QueryBus } from '@root/shared/processing/query-bus';
import { registerDomainServices } from './domain-services';
import { postgresQueryBuilder } from '@infrastructure/database/query-builder';
import { logger } from '@tools/logger';

export const registerAsArray = <T>(resolvers: Awilix.Resolver<T>[]): Awilix.Resolver<T[]> => ({
  resolve: (container: Awilix.AwilixContainer) => resolvers.map((r) => container.build(r)),
});

export const createAppContainer = async (): Promise<Awilix.AwilixContainer> => {
  const container = Awilix.createContainer({
    injectionMode: Awilix.InjectionMode.PROXY,
  });

  container.register({
    queryBuilder: Awilix.asValue(postgresQueryBuilder()),
    commandBus: Awilix.asClass(CommandBus).singleton(),
    queryBus: Awilix.asClass(QueryBus).singleton(),
    logger: Awilix.asValue(logger),
  });

  container.loadModules(
    [
      process.env.NODE_ENV === 'production'
        ? 'dist/**/**/**/**/**/*.action.js'
        : 'src/**/**/**/**/**/*.action.ts',
    ],
    {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Awilix.Lifetime.SCOPED,
        register: Awilix.asFunction,
      },
    },
  );

  registerDomainServices(container);

  registerCommandHandlers(container);

  registerRepositories(container);

  registerControllers(container);

  container.register({
    server: Awilix.asClass(Server).singleton(),
  });

  const app = container.resolve<Server>('server').getApp();

  container.register({
    app: Awilix.asValue(app),
  });

  return container;
};
