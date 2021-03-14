import { Controller } from '@root/shared/api/controller';
import { Router, RequestHandler } from 'express';
import { confirmAccountActionValidation } from './confirm-account/confirm-account.action';
import { loginToPLatformActionValidation } from './login-to-platform/login-to-platform.action';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.action';

interface Dependencies {
  registerNewAccountAction: RequestHandler;
  loginToPlatformAction: RequestHandler;
  confirmAccountAction: RequestHandler;
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

    router.post('/login', [
      loginToPLatformActionValidation,
      this.dependencies.loginToPlatformAction,
    ]);

    router.get('/confirm-account', [
      confirmAccountActionValidation,
      this.dependencies.confirmAccountAction,
    ]);

    return router;
  }
}
