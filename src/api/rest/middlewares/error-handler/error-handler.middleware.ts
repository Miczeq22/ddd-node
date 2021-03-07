/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppError } from '@errors/app.error';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';
import { InputValidationError } from '@errors/input-validation.error';
import { NotFoundError } from '@errors/not-found.error';
import { Logger } from '@tools/logger';
import { isCelebrateError, CelebrateError } from 'celebrate';
import { ErrorRequestHandler } from 'express';

export const errorHandlerMiddleware = (logger: Logger): ErrorRequestHandler => (
  error,
  _,
  res,
  next,
) => {
  logger.error('[API Error]', error);

  if (isCelebrateError(error)) {
    return res.status(422).json({
      error: InputValidationError.name,
      details: (
        (error as CelebrateError).details.get('body') ||
        (error as CelebrateError).details.get('query') ||
        (error as CelebrateError).details.get('params')
      ).details.map((detail) => ({
        key: detail.context.key,
        message: detail.message,
      })),
    });
  }

  switch (error.name) {
    case BusinessRuleValidationError.name:
      return res.status(400).json({
        error: error.message,
        name: error.name,
      });

    case NotFoundError.name:
      return res.status(404).json({
        error: error.message,
        name: error.name,
      });

    case AppError.name:
    default:
      return res.status(500).json({
        error: error.message,
        name: error.name,
      });
  }
};
