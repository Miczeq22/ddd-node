import { NotFoundError } from '@errors/not-found.error';
import { Controller } from '@root/shared/api/controller';
import { Logger } from '@tools/logger';
import express, { Application } from 'express';
import { errorHandlerMiddleware } from './rest/middlewares/error-handler/error-handler.middleware';
import { applySecurityMiddleware } from './rest/middlewares/security/security.middleware';
import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from '@tools/swagger';

interface Dependencies {
  controllers: Controller[];
  logger: Logger;
}

export class Server {
  private readonly app: Application;

  constructor(private readonly dependencies: Dependencies) {
    this.app = express();

    this.app.use(express.json());

    applySecurityMiddleware(this.app);

    this.init();
  }

  private init() {
    this.app.get('/', (req, res) => {
      res.redirect(308, `${req.baseUrl}/api-docs`);
    });

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    this.dependencies.controllers.forEach((controller) =>
      this.app.use(controller.route, controller.getRouter()),
    );

    this.app.use('*', (_, __, next) => next(new NotFoundError('Route does not exist.')));

    this.app.use(errorHandlerMiddleware(this.dependencies.logger));
  }

  public getApp() {
    return this.app;
  }
}
