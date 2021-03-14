import { QueryBuilder } from '@infrastructure/database/query-builder';
import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountRegistration } from '../../core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '../../core/account-registration/account-registration.repository';
import {
  AccountRegistrationMapper,
  ACCOUNT_REGISTRATION_TABLE,
} from './account-registration.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRegistrationRepositoryImpl implements AccountRegistrationRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(accountRegistration: AccountRegistration) {
    const record = AccountRegistrationMapper.toPersistence(accountRegistration);

    const trx = await this.dependencies.queryBuilder.transaction();

    await trx.insert(record).into(ACCOUNT_REGISTRATION_TABLE);

    return trx;
  }

  public async findById(id: UniqueEntityID) {
    const result = await this.dependencies.queryBuilder
      .where('id', id.getValue())
      .from(ACCOUNT_REGISTRATION_TABLE);

    return result.length ? AccountRegistrationMapper.toEntity(result[0]) : null;
  }

  public async update(accountRegistration: AccountRegistration) {
    const { id, ...data } = AccountRegistrationMapper.toPersistence(accountRegistration);

    const trx = await this.dependencies.queryBuilder.transaction();

    await trx.update(data).where('id', id).into(ACCOUNT_REGISTRATION_TABLE);

    return trx;
  }
}
