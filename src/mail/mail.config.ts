import { registerAs } from '@nestjs/config';

export const MailConfig = registerAs('mail', () => ({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'billy.lind73@ethereal.email',
    pass: 'B6a4cXXpG79wq1CNXh',
  },
}));
