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
