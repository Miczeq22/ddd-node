import { UniqueEntityID } from '@root/shared/unique-entity-id';

export interface EmailConfirmationTokenPayload {
  accountId: string;
}

export interface TokenProviderService {
  getEmailConfirmationToken(accountId: UniqueEntityID): string;

  decodeEmailConfirmationToken(token: string): EmailConfirmationTokenPayload;
}
