import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { TokenProviderService, EmailConfirmationTokenPayload } from './token-provider.service';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@errors/unauthorized.error';

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
}
