/* eslint-disable import/first */
/* eslint-disable global-require */
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

import { createAppContainer } from './container/app-container';
import { Application } from 'express';
import { createServer } from 'http';
import { Logger } from '@tools/logger';

(async () => {
  const container = await createAppContainer();

  const app = container.resolve<Application>('app');
  const logger = container.resolve<Logger>('logger');

  const server = createServer(app);

  const port = process.env.PORT ?? 4000;

  server.listen(port, () => {
    logger.info(`Server is listening on ${process.env.PROTOCOL}://${process.env.HOST}:${port}`);
  });
})();
