import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountEmail } from '../account-email/account-email.value-object';
import { Account } from './account.aggregate-root';

export interface AccountRepository {
  getByEmail(email: AccountEmail): Promise<Account | null>;

  getById(id: UniqueEntityID): Promise<Account | null>;

  update(account: Account): Promise<DatabaseTransaction>;
}
