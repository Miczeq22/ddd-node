import { UnauthorizedError } from '@errors/unauthorized.error';
import { TokenProviderService } from '@infrastructure/token-provider/token-provider.service';
import { RequestHandler } from 'express';

interface Dependencies {
  tokenProvider: TokenProviderService;
}

export const authMiddleware = ({ tokenProvider }: Dependencies): RequestHandler => (
  req,
  res,
  next,
) => {
  const token = req.headers['x-jwt'] ? req.headers['x-jwt'].slice(7) : null;

  if (!token) {
    throw new UnauthorizedError();
  }

  const { accountId } = tokenProvider.decodePlatformAccessToken(token as string);

  res.locals.accountId = accountId;

  next();
};
