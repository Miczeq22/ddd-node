import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountEmail } from '../account-email/account-email.value-object';
import { AccountPassword } from '../account-password/account-password.value-object';
import { AccountStatus } from '../account-status/account-status.value-object';
import { SubscriptionType } from '../subscription-type/subscription-type.value-object';
import { Account } from './account.aggregate-root';
import { UserLoggedInEvent } from './events/user-logged-in.domain-event';

describe('[DOMAIN] Platform Access/Account', () => {
  test('should throw an error if provided password is invalid', async () => {
    const password = await AccountPassword.createNew('test123');

    const account = Account.fromPersistence(
      {
        password,
        email: AccountEmail.fromPersistence('john@doe.com'),
        status: AccountStatus.Confirmed,
        subscriptionType: null,
      },
      new UniqueEntityID(),
    );

    await expect(() => account.login('invalid-password')).rejects.toThrowError(
      'Invalid email or password.',
    );
  });

  test('should throw an error if account is not confirmed', async () => {
    const password = await AccountPassword.createNew('test123');

    const account = Account.fromPersistence(
      {
        password,
        email: AccountEmail.fromPersistence('john@doe.com'),
        status: AccountStatus.WaitingForConfirmation,
        subscriptionType: null,
      },
      new UniqueEntityID(),
    );

    await expect(() => account.login('test123')).rejects.toThrowError(
      'Your account is not confirmed. Please check your email.',
    );
  });

  test('should log in to the platform and set proper domain event', async () => {
    const password = await AccountPassword.createNew('test123');

    const account = Account.fromPersistence(
      {
        password,
        email: AccountEmail.fromPersistence('john@doe.com'),
        status: AccountStatus.Confirmed,
        subscriptionType: null,
      },
      new UniqueEntityID(),
    );

    await account.login('test123');

    expect(account.getDomainEvents()[0] instanceof UserLoggedInEvent).toBeTruthy();
  });

  test('should throw an error if subscription is already set', async () => {
    const password = await AccountPassword.createNew('test123');

    const account = Account.fromPersistence(
      {
        password,
        email: AccountEmail.fromPersistence('john@doe.com'),
        status: AccountStatus.Confirmed,
        subscriptionType: SubscriptionType.PaidMembership,
      },
      new UniqueEntityID(),
    );

    expect(() => account.assignFreeMembership()).toThrowError(
      'Cannot assign new subscription. Subscription is already set.',
    );
  });

  test('should assign free membership', async () => {
    const password = await AccountPassword.createNew('test123');

    const account = Account.fromPersistence(
      {
        password,
        email: AccountEmail.fromPersistence('john@doe.com'),
        status: AccountStatus.Confirmed,
        subscriptionType: null,
      },
      new UniqueEntityID(),
    );

    account.assignFreeMembership();

    expect(account.getSubscriptionType().equals(SubscriptionType.Free)).toBeTruthy();
  });

  test('should throw an error if subscription is already paid', async () => {
    const password = await AccountPassword.createNew('test123');

    const account = Account.fromPersistence(
      {
        password,
        email: AccountEmail.fromPersistence('john@doe.com'),
        status: AccountStatus.Confirmed,
        subscriptionType: SubscriptionType.PaidMembership,
      },
      new UniqueEntityID(),
    );

    expect(() => account.assignPaidMembership()).toThrowError(
      'Cannot assign paid membership. Subscription is already paid.',
    );
  });

  test('should assign paid membership', async () => {
    const password = await AccountPassword.createNew('test123');

    const account = Account.fromPersistence(
      {
        password,
        email: AccountEmail.fromPersistence('john@doe.com'),
        status: AccountStatus.Confirmed,
        subscriptionType: SubscriptionType.Free,
      },
      new UniqueEntityID(),
    );

    account.assignPaidMembership();

    expect(account.getSubscriptionType().equals(SubscriptionType.PaidMembership)).toBeTruthy();
  });
});
