import { CommandBus } from '@root/shared/processing/command-bus';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { RegisterNewAccountCommand } from '../../app/register-new-account/register-new-account.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const registerNewAccountActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

const registerNewAccountAction = ({ commandBus }: Dependencies): RequestHandler => (
  req,
  res,
  next,
) =>
  commandBus
    .handle(new RegisterNewAccountCommand(req.body))
    .then(() => res.sendStatus(201))
    .catch(next);

export default registerNewAccountAction;
