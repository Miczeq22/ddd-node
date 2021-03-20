import { AppError } from '@root/errors/app.error';

export class InvalidAccountTypeError extends AppError {
  constructor() {
    super('Provided account type is not supported.', 'InvalidAccountTypeError', 400);
  }
}
