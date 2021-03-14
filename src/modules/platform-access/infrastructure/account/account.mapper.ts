import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountEmail } from '../../core/account-email/account-email.value-object';
import { AccountPassword } from '../../core/account-password/account-password.value-object';
import { AccountStatus } from '../../core/account-status/account-status.value-object';
import { Account } from '../../core/account/account.aggregate-root';

interface AccountRecord {
  id: string;
  email: string;
  password: string;
  status: string;
}

export const ACCOUNT_TABLE = 'public.account';

export class AccountMapper {
  public static toPersistence(account: Account): AccountRecord {
    return {
      id: account.getId().getValue(),
      email: account.getEmail().toString(),
      password: account.getPassword().getValue(),
      status: account.getStatus().getValue(),
    };
  }

  public static toEntity(record: AccountRecord): Account {
    return Account.fromPersistence(
      {
        email: AccountEmail.fromPersistence(record.email),
        password: AccountPassword.fromPersistence(record.password),
        status: AccountStatus.fromValue(record.status),
      },
      new UniqueEntityID(record.id),
    );
  }
}
