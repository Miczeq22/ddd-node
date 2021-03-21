import express, { Application, RequestHandler } from 'express';
import { createMockProxy } from '@tools/mock-proxy';
import request from 'supertest';
import { JwtTokenProviderService } from '@infrastructure/token-provider/jwt-token-provider.service';
import { authMiddleware } from './auth.middleware';
import { errorHandlerMiddleware } from '../error-handler/error-handler.middleware';
import { Logger } from 'winston';
import { UniqueEntityID } from '@root/shared/unique-entity-id';

describe('[API] Authorization middleware', () => {
  let app: Application;
  const tokenProvider = new JwtTokenProviderService();
  const dummyHandler: RequestHandler = (req, res) =>
    res.status(200).json({ userId: res.locals.userId || '' });
  const logger = createMockProxy<Logger>();

  beforeEach(() => {
    app = express();
    jest.resetAllMocks();
  });

  test('Should throw 401 when there is no Authentication header', async (done) => {
    app.get('/', [authMiddleware({ tokenProvider }), dummyHandler]);
    app.use(errorHandlerMiddleware(logger));

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(401);
    done();
  });

  test('Should pass request to next action when token is valid', async (done) => {
    process.env.JWT_PRIVATE_KEY = 'secret';

    const validToken = tokenProvider.getPlatformAccessToken(new UniqueEntityID('123'));

    app.get('/', [authMiddleware({ tokenProvider }), dummyHandler]);
    app.use(errorHandlerMiddleware(logger));

    const res = await request(app).get('/').set('X-JWT', `Bearer ${validToken}`);

    expect(res.statusCode).toEqual(200);
    done();
  });
});
