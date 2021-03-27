import { UniqueEntityID } from '@root/framework/unique-entity-id';
import {
  TokenProviderService,
  EmailConfirmationTokenPayload,
  PlatformAccessTokenPayload,
} from './token-provider.service';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { AccountPassword } from '@root/modules/platform-access/core/account-password/account-password.value-object';

export class JwtTokenProviderService implements TokenProviderService {
  public getEmailConfirmationToken(accountId: UniqueEntityID) {
    return jwt.sign(
      {
        accountId: accountId.getValue(),
      },
      process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: '2d',
      },
    );
  }

  public decodeEmailConfirmationToken(token: string) {
    try {
      const payload = jwt.verify(
        token,
        process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
      ) as EmailConfirmationTokenPayload;

      return payload;
    } catch {
      throw new UnauthorizedError();
    }
  }

  public getPlatformAccessToken(accountId: UniqueEntityID) {
    return jwt.sign(
      {
        accountId: accountId.getValue(),
      },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: process.env.NODE_ENV === 'production' ? '30s' : '1h',
      },
    );
  }

  public getPlatformRefreshToken(accountId: UniqueEntityID, accountPassword: AccountPassword) {
    return jwt.sign(
      {
        accountId: accountId.getValue(),
      },
      `${process.env.JWT_PRIVATE_KEY}${accountPassword.getValue()}`,
    );
  }

  public decodePlatformAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY) as PlatformAccessTokenPayload;

      return payload;
    } catch {
      throw new UnauthorizedError();
    }
  }

  public decodePlatformRefreshToken(token: string, accountPassword: AccountPassword) {
    try {
      const payload = jwt.verify(
        token,
        `${process.env.JWT_PRIVATE_KEY}${accountPassword.getValue()}`,
      ) as PlatformAccessTokenPayload;

      return payload;
    } catch {
      throw new UnauthorizedError();
    }
  }
}
