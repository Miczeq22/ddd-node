import { QueryBuilder } from '@infrastructure/database/query-builder';
import { AccountEmailCheckerService } from '../../core/account-email/account-email-checker.service';
import { ACCOUNT_REGISTRATION_TABLE } from '../account-registration/account-registration.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountEmailCheckerServiceImpl implements AccountEmailCheckerService {
  constructor(private readonly dependencies: Dependencies) {}

  public async isUnique(email: string) {
    const result = await this.dependencies.queryBuilder
      .select(['id'])
      .where('email', email)
      .from(ACCOUNT_REGISTRATION_TABLE);

    return result.length === 0;
  }
}
