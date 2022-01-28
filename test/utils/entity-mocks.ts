import { Invoice } from '../../src/invoices/entities/invoice.entity';
import { User } from '../../src/user/entities/user.entity';
import { Role } from '../../src/user/user.type';

export const buildInvoicesArray = () => {
  const invoices = [];
  for (let index = 0; index < 10; index++) {
    invoices.push(new Invoice());
  }
  return invoices;
};

export const buildEntityObject = async <T>(
  options: MockBuilder<T> = partial,
) => {
  const object = { ...options.fields };
  return object as T;
};

type MockBuilder<T> =
  | {
      partial: true;
      fields?: Partial<T>;
    }
  | {
      partial: false;
      fields?: T;
    };

const partial = { partial: true };
export const mockUser = buildEntityObject<User>({
  partial: true,
  fields: {
    id: 1,
    name: 'tomasz',
    email: 't.zwak@selleo.com',
    passwordHash:
      '$2a$10$tNxDkC6TCwWMl5zlCb9/zOaR7Qp2Xrm7NLQWY3xB7vbeclmT/j/sq',
    role: Role.OWNER,
    active: true,
    passwordExpired: false,
    confirmationId: '734421bd-794f-4e7a-9fd9-f4a1ae71df18',
    passwordResetId: 'b5aa53da-de44-4339-8e2b-c2221ebf8ecc',
    accountNumber: '123123123',
  },
});
