import { Controller } from '@root/shared/api/controller';
import { Router, RequestHandler } from 'express';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.action';

interface Dependencies {
  registerNewAccountAction: RequestHandler;
}

export class PlatfromAccessController extends Controller {
  constructor(private readonly dependencies: Dependencies) {
    super('/');
  }

  public getRouter() {
    const router = Router();

    router.post('/register', [
      registerNewAccountActionValidation,
      this.dependencies.registerNewAccountAction,
    ]);

    return router;
  }
}
