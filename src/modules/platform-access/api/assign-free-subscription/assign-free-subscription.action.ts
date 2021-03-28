import { CommandBus } from '@root/framework/processing/command-bus';
import { RequestHandler } from 'express';
import { AssignFreeSubscriptionCommand } from '../../app/assign-free-subscription/assign-free-subscription.command';

interface Dependencies {
  commandBus: CommandBus;
}

/**
 * @swagger
 *
 * /assign-free-subscription:
 *   patch:
 *     tags:
 *       - Platform Access
 *     security:
 *       - bearerAuth: []
 *     summary: Assigns free subscription to the account
 *     responses:
 *       204:
 *        description: Free subscription type assigned
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Bussiness rule validation error occured
 *       500:
 *         description: Internal Server Error
 */
const assignFreeSubscriptionAction = ({ commandBus }: Dependencies): RequestHandler => (
  _,
  res,
  next,
) =>
  commandBus
    .handle(new AssignFreeSubscriptionCommand(res.locals.accountId))
    .then(() => res.sendStatus(204))
    .catch(next);

export default assignFreeSubscriptionAction;
