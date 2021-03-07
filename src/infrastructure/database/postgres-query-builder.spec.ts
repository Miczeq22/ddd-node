import { postgresQueryBuilder } from './query-builder';

describe('[INFRASTRUCTURE] Postgres Query Builder', () => {
  const queryBuilder = postgresQueryBuilder();

  afterAll(async () => {
    await queryBuilder.destroy();
  });

  test('should query database by postgres query builder', async () => {
    const response = await queryBuilder.raw('SELECT 1');

    expect(response.command).toEqual('SELECT');
  });
});
