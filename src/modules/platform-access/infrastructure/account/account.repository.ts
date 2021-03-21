import { QueryBuilder } from '@infrastructure/database/query-builder';
import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountEmail } from '../../core/account-email/account-email.value-object';
import { Account } from '../../core/account/account.aggregate-root';
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

  public async getById(id: UniqueEntityID) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder.select().where('id', id.getValue()).from(ACCOUNT_TABLE);

    return result.length ? AccountMapper.toEntity(result[0]) : null;
  }

  public async update(account: Account) {
    const { queryBuilder } = this.dependencies;
    const { password, status, id } = AccountMapper.toPersistence(account);

    const trx = await queryBuilder.transaction();

    await trx
      .update({
        password,
        status,
      })
      .where('id', id)
      .into(ACCOUNT_TABLE);

    return trx;
  }
}
