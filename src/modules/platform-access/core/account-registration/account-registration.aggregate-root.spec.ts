import { createMockProxy } from '@tools/mock-proxy';
import { AccountEmailCheckerService } from '../account-email/account-email-checker.service';
import { AccountStatus } from '../account-status/account-status.value-object';
import { AccountRegistration } from './account-registration.aggregate-root';

describe('[DOMAIN] Platform Access/Account Registration', () => {
  const accountEmailChecker = createMockProxy<AccountEmailCheckerService>();

  beforeEach(() => {
    accountEmailChecker.mockClear();
  });

  test('should throw an error if email have invalid format', async () => {
    await expect(() =>
      AccountRegistration.registerNew('invalid-email', '#password', accountEmailChecker),
    ).rejects.toThrowError('Provided email is not valid.');
  });

  test('should throw an error if email is not unique', async () => {
    accountEmailChecker.isUnique.mockResolvedValue(false);

    await expect(() =>
      AccountRegistration.registerNew('john@doe.com', '#password', accountEmailChecker),
    ).rejects.toThrowError('Provided email is not unique. Please choose different email address.');
  });

  test('should throw an error if password have less than 6 characters', async () => {
    accountEmailChecker.isUnique.mockResolvedValue(true);

    await expect(() =>
      AccountRegistration.registerNew('john@doe.com', '#pass', accountEmailChecker),
    ).rejects.toThrowError(
      'Provided password is not strong enough. Provide at least 6 characters.',
    );
  });

  test('should throw an error if password have more than 50 characters', async () => {
    accountEmailChecker.isUnique.mockResolvedValue(true);

    await expect(() =>
      AccountRegistration.registerNew(
        'john@doe.com',
        [...new Array(51).fill('x')].join(''),
        accountEmailChecker,
      ),
    ).rejects.toThrowError(
      'Provided password is not strong enough. Password can contain max of 50 characters.',
    );
  });

  test('should throw an error if password does not contain at least one digit', async () => {
    accountEmailChecker.isUnique.mockResolvedValue(true);

    await expect(() =>
      AccountRegistration.registerNew('john@doe.com', '#password', accountEmailChecker),
    ).rejects.toThrowError(
      'Provided password is not strong enough. Provide password with minimum one digit.',
    );
  });

  test('should create new valid account', async () => {
    accountEmailChecker.isUnique.mockResolvedValue(true);

    const account = await AccountRegistration.registerNew(
      'john@doe.com',
      'test123',
      accountEmailChecker,
    );

    expect(account.getStatus().equals(AccountStatus.WaitingForConfirmation)).toBeTruthy();
  });
});
