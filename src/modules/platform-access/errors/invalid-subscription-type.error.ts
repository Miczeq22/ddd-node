import { AppError } from '@errors/app.error';

export class InvalidSubscriptionTypeError extends AppError {
  constructor() {
    super('Provided Subscription Type is not supported.', 'InvalidSubscriptionTypeError', 400);
  }
}
