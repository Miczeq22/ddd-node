import * as Knex from 'knex';

export interface DatabaseTransaction extends Knex.Knex.Transaction {}
