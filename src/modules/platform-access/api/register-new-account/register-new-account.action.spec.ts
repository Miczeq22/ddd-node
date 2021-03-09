import { Application } from 'express';
import * as Awilix from 'awilix';
import request from 'supertest';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { AccountEmailCheckerService } from '../../core/account-email/account-email-checker.service';
import { AccountRegistrationRepository } from '../../core/account-registration/account-registration.repository';
import { TestDatabaseFactory } from '@infrastructure/database/test-database-factory';
import { ACCOUNT_REGISTRATION_TABLE } from '../../infrastructure/account-registration/account-registration.mapper';
import { createAppContainer } from '@root/container/app-container';
import { AccountRegistration } from '../../core/account-registration/account-registration.aggregate-root';

const ENDPOINT = '/register';

describe(`[API] REST POST ${ENDPOINT}`, () => {
  let app: Application;
  let queryBuilder: QueryBuilder;
  let accountRegistrationRepository: AccountRegistrationRepository;
  let accountEmailChecker: AccountEmailCheckerService;
  let container: Awilix.AwilixContainer;

  beforeAll(async () => {
    container = await createAppContainer();
    app = container.resolve('app');
    queryBuilder = await TestDatabaseFactory.create('register_new_account');

    container.register({
      queryBuilder: Awilix.asValue(queryBuilder),
    });

    accountRegistrationRepository = container.resolve<AccountRegistrationRepository>(
      'accountRegistrationRepository',
    );
    accountEmailChecker = container.resolve<AccountEmailCheckerService>('accountEmailChecker');
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

  test('should throw an error if email is already taken', async () => {
    const payload = {
      email: 'john@doe.com',
      password: 'test123',
    };
    const account = await AccountRegistration.registerNew(
      payload.email,
      payload.password,
      accountEmailChecker,
    );

    const trx = await accountRegistrationRepository.insert(account);
    await trx.commit();

    const res = await request(app).post(ENDPOINT).send(payload).set('Accept', 'application/json');

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(
      'Provided email is not unique. Please choose different email address.',
    );
  });

  test('should throw an error if password is not strong enough', async () => {
    const payload = {
      email: 'john@doe.com',
      password: 'testtest',
    };

    const res = await request(app).post(ENDPOINT).send(payload).set('Accept', 'application/json');

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(
      'Provided password is not strong enough. Provide password with minimum one digit.',
    );
  });

  test('should register new account', async () => {
    const payload = {
      email: 'john@doe.com',
      password: 'test123',
    };

    const res = await request(app).post(ENDPOINT).send(payload).set('Accept', 'application/json');

    expect(res.statusCode).toEqual(201);
  });
});
