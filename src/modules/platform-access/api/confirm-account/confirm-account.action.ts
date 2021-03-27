import { CommandBus } from '@root/framework/processing/command-bus';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { ConfirmAccountCommand } from '../../app/confirm-account/confirm-account.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const confirmAccountActionValidation = celebrate({
  [Segments.QUERY]: {
    token: Joi.string()
      .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
      .required(),
  },
});

/**
 * @swagger
 *
 * /confirm-account:
 *   get:
 *     tags:
 *       - Platform Access
 *     security: []
 *     summary: Confirm account
 *     parameters:
 *      - in: query
 *        name: token
 *        schema:
 *          type: string
 *          pattern: ^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$
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
const confirmAccountAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(new ConfirmAccountCommand(req.query.token as string))
    .then(() => res.redirect(302, `${process.env.FRONTEND_URL}/login?verified=true`))
    .catch(next);

export default confirmAccountAction;
