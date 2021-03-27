import { Controller } from '@root/framework/api/controller';
import { Router, RequestHandler } from 'express';
import { confirmAccountActionValidation } from './confirm-account/confirm-account.action';
import { loginToPLatformActionValidation } from './login-to-platform/login-to-platform.action';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.action';

interface Dependencies {
  authMiddleware: RequestHandler;
  registerNewAccountAction: RequestHandler;
  loginToPlatformAction: RequestHandler;
  confirmAccountAction: RequestHandler;
  assignFreeSubscriptionAction: RequestHandler;
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

    router.patch('/assign-free-subscription', [
      this.dependencies.authMiddleware,
      this.dependencies.assignFreeSubscriptionAction,
    ]);

    return router;
  }
}
