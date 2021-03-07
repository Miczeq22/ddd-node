import { UniqueEntityID } from '@root/shared/unique-entity-id';
import { AccountEmail } from '../../core/account-email/account-email.value-object';
import { AccountPassword } from '../../core/account-password/account-password.value-object';
import { AccountRegistration } from '../../core/account-registration/account-registration.aggregate-root';
import { AccountStatus } from '../../core/account-status/account-status.value-object';

interface AccountRegistrationRecord {
  id: string;
  email: string;
  password: string;
  status: string;
  registration_date: string;
  confirmation_date: string | null;
}

export const ACCOUNT_REGISTRATION_TABLE = 'public.account';

export class AccountRegistrationMapper {
  public static toPersistence(accountRegistration: AccountRegistration): AccountRegistrationRecord {
    return {
      id: accountRegistration.getId().getValue(),
      email: accountRegistration.getEmail().toString(),
      password: accountRegistration.getPassword().getValue(),
      status: accountRegistration.getStatus().getValue(),
      confirmation_date:
        accountRegistration.getConfirmationDate() !== null
          ? accountRegistration.getConfirmationDate().toISOString()
          : null,
      registration_date: accountRegistration.getRegistrationDate().toISOString(),
    };
  }

  public static toEntity(record: AccountRegistrationRecord): AccountRegistration {
    return AccountRegistration.fromPersistence(
      {
        email: AccountEmail.fromPersistence(record.email),
        password: AccountPassword.fromPersistence(record.password),
        status: AccountStatus.fromValue(record.status),
        confirmationDate:
          record.confirmation_date !== null ? new Date(record.confirmation_date) : null,
        registrationDate: new Date(record.registration_date),
      },
      new UniqueEntityID(record.id),
    );
  }
}
