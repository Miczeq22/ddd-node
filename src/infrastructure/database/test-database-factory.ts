/* eslint-disable no-await-in-loop */
import { NotFoundError } from '@errors/not-found.error';
import path from 'path';
import fs from 'fs';
import { Pool, QueryResult } from 'pg';
import { EOL } from 'os';
import { createQueryBuilder, QueryBuilder } from './query-builder';
import { DatabaseConfig, postgresConfig } from './database-credentials.config';

export class TestDatabaseFactory {
  public static async create(database: string) {
    const testDbConfig = this.getTestDatabaseConfig(database);

    await this.migrate(testDbConfig);

    return createQueryBuilder('pg', testDbConfig);
  }

  public static async cleanTestDatabases(queryBuilder: QueryBuilder, tables: string[]) {
    if (!queryBuilder || !tables.length) {
      return;
    }

    return Promise.all(tables.map(async (tableName) => queryBuilder.delete().from(tableName)));
  }

  private static getSqlScripts() {
    if (!process.env.POSTGRES_MIGRATION_PATH) {
      throw new NotFoundError('Missing POSTGRES_MIGRATION_PATH environment.');
    }

    const absolutePath = path.resolve(process.env.POSTGRES_MIGRATION_PATH);

    return fs
      .readdirSync(absolutePath)
      .map((scriptName) => fs.readFileSync(`${absolutePath}/${scriptName}`), {
        encoding: 'utf-8',
      });
  }

  private static getTestDatabaseConfig(database: string) {
    return {
      ...postgresConfig,
      database,
    };
  }

  private static async createIntegrationTestDatabase(database: string) {
    const defaultDb = new Pool(postgresConfig);

    await defaultDb.query(`DROP DATABASE IF EXISTS ${database};`);
    await defaultDb.query(`CREATE DATABASE ${database};`);
    await defaultDb.end();
  }

  private static async migrate(migrateDbConfig: DatabaseConfig): Promise<QueryResult> {
    await this.createIntegrationTestDatabase(migrateDbConfig.database);

    const testDb = new Pool(migrateDbConfig);

    const response = await testDb.query(
      [`START TRANSACTION; ${EOL} ${EOL}`, ...this.getSqlScripts(), `${EOL} COMMIT;`].join(''),
    );

    await testDb.end();

    return response;
  }
}
