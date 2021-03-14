import { CommandBus } from '@root/shared/processing/command-bus';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { LoginToPlatformCommand } from '../../app/login-to-platform/login-to-platform.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const loginToPLatformActionValidation = celebrate(
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
 * /login:
 *   post:
 *     tags:
 *       - Platform Access
 *     security: []
 *     summary: Log In to the Platform
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
 *        description: Logged In successfuly
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Bussiness rule validation error occured
 *       500:
 *         description: Internal Server Error
 */
const loginToPlatformAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(new LoginToPlatformCommand(req.body))
    .then((tokens) => res.status(200).json(tokens))
    .catch(next);

export default loginToPlatformAction;
