import { User } from './entities/user.entity';

export enum Role {
  OWNER = 'owner',
  ACCOUNTANT = 'accountant',
  ADMIN = 'admin',
}

export type UserPayload = {
  name: string;
  email: string;
  role: Role;
};

export type UserTemplateData = Pick<User, 'accountNumber' | 'email'>;
