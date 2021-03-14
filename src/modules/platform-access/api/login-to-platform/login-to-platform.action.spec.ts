import { Application } from 'express';
import * as Awilix from 'awilix';
import request from 'supertest';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { TestDatabaseFactory } from '@infrastructure/database/test-database-factory';
import {
  AccountRegistrationMapper,
  ACCOUNT_REGISTRATION_TABLE,
} from '../../infrastructure/account-registration/account-registration.mapper';
import { createAppContainer } from '@root/container/app-container';
import { AccountRegistration } from '../../core/account-registration/account-registration.aggregate-root';
import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountEmail } from '../../core/account-email/account-email.value-object';
import { AccountPassword } from '../../core/account-password/account-password.value-object';
import { AccountStatus } from '../../core/account-status/account-status.value-object';

const ENDPOINT = '/login';

describe(`[API] REST POST ${ENDPOINT}`, () => {
  let app: Application;
  let queryBuilder: QueryBuilder;
  let container: Awilix.AwilixContainer;

  beforeAll(async () => {
    container = await createAppContainer();
    app = container.resolve('app');
    queryBuilder = await TestDatabaseFactory.create('login_to_platform');

    container.register({
      queryBuilder: Awilix.asValue(queryBuilder),
    });
  });

  afterEach(async () =>
    TestDatabaseFactory.cleanTestDatabases(queryBuilder, [ACCOUNT_REGISTRATION_TABLE]),
  );

  afterAll(async () => {
    await queryBuilder.destroy();
  });

  test('should throw an error if payload is invalid', async () => {
    const res = await request(app).post(ENDPOINT).set('Accept', 'application/json');

    expect(res.statusCode).toEqual(422);
    expect(res.body.error).toEqual('InputValidationError');
    expect(res.body.details.map((detail) => detail.key)).toEqual(['email', 'password']);
  });

  test('should throw an error if credentails are invalid', async () => {
    const payload = {
      email: 'john@doe.com',
      password: 'testtest',
    };

    const res = await request(app).post(ENDPOINT).send(payload).set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });

  test('should throw an error if account is not confirmed', async () => {
    const payload = {
      email: 'john@doe.com',
      password: 'test123',
    };

    const account = AccountRegistration.fromPersistence(
      {
        confirmationDate: new Date(),
        email: AccountEmail.fromPersistence('john@doe.com'),
        password: await AccountPassword.createNew('test123'),
        registrationDate: new Date(),
        status: AccountStatus.WaitingForConfirmation,
      },
      new UniqueEntityID(),
    );

    await queryBuilder
      .insert(AccountRegistrationMapper.toPersistence(account))
      .into(ACCOUNT_REGISTRATION_TABLE);

    const res = await request(app).post(ENDPOINT).send(payload).set('Accept', 'application/json');

    expect(res.statusCode).toEqual(400);
  });

  test('should login', async () => {
    const payload = {
      email: 'john@doe.com',
      password: 'test123',
    };

    const account = AccountRegistration.fromPersistence(
      {
        confirmationDate: new Date(),
        email: AccountEmail.fromPersistence('john@doe.com'),
        password: await AccountPassword.createNew('test123'),
        registrationDate: new Date(),
        status: AccountStatus.Confirmed,
      },
      new UniqueEntityID(),
    );

    await queryBuilder
      .insert(AccountRegistrationMapper.toPersistence(account))
      .into(ACCOUNT_REGISTRATION_TABLE);

    const res = await request(app).post(ENDPOINT).send(payload).set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
  });
});
