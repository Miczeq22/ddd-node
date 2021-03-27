import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountRegistration } from './account-registration.aggregate-root';

export interface AccountRegistrationRepository {
  insert(accountRegistration: AccountRegistration): Promise<DatabaseTransaction>;

  update(accountRegistration: AccountRegistration): Promise<DatabaseTransaction>;

  findById(id: UniqueEntityID): Promise<AccountRegistration | null>;
}
