import { CommandBus } from '@root/framework/processing/command-bus';
import { RequestHandler } from 'express';
import { AssignFreeSubscriptionCommand } from '../../app/assign-free-subscription/assign-free-subscription.command';

interface Dependencies {
  commandBus: CommandBus;
}

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
