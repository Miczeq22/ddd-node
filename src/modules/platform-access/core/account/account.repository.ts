import { AccountEmail } from '../account-email/account-email.value-object';
import { Account } from './account.aggregate-root';

export interface AccountRepository {
  getByEmail(email: AccountEmail): Promise<Account | null>;
}
