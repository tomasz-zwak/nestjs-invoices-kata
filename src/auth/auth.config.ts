import { registerAs } from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => ({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '6000s' },
}));
