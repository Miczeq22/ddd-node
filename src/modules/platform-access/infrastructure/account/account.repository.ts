import { QueryBuilder } from '@infrastructure/database/query-builder';
import { AccountEmail } from '../../core/account-email/account-email.value-object';
import { AccountRepository } from '../../core/account/account.repository';
import { AccountMapper, ACCOUNT_TABLE } from './account.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRepositoryImpl implements AccountRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async getByEmail(email: AccountEmail) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder.select().where('email', email.toString()).from(ACCOUNT_TABLE);

    return result.length ? AccountMapper.toEntity(result[0]) : null;
  }
}
