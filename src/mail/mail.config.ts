import { registerAs } from '@nestjs/config';

export const MailConfig = registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  from: process.env.MAIL_FROM,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
}));
