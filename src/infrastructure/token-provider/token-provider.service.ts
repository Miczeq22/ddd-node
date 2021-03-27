import { AccountPassword } from '@root/modules/platform-access/core/account-password/account-password.value-object';
import { UniqueEntityID } from '@root/framework/unique-entity-id';

export interface EmailConfirmationTokenPayload {
  accountId: string;
}

export interface PlatformAccessTokenPayload {
  accountId: string;
}

export interface TokenProviderService {
  getEmailConfirmationToken(accountId: UniqueEntityID): string;

  decodeEmailConfirmationToken(token: string): EmailConfirmationTokenPayload;

  getPlatformAccessToken(accountId: UniqueEntityID): string;

  getPlatformRefreshToken(accountId: UniqueEntityID, accountPassword: AccountPassword): string;

  decodePlatformAccessToken(token: string): PlatformAccessTokenPayload;

  decodePlatformRefreshToken(
    token: string,
    accountPassword: AccountPassword,
  ): PlatformAccessTokenPayload;
}
