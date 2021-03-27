import { CommandBus } from '@root/framework/processing/command-bus';
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

/**
 * @swagger
 *
 * /register:
 *   post:
 *     tags:
 *       - Platform Access
 *     security: []
 *     summary: Create new Account
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *                writeOnly: true
 *     responses:
 *       201:
 *        description: Account created successfuly
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Bussiness rule validation error occured
 *       500:
 *         description: Internal Server Error
 */
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
