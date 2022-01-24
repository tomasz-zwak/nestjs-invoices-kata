import { MailerOptions, TemplateAdapter } from '@nestjs-modules/mailer';
import { ConfigType, registerAs } from '@nestjs/config';
import { join } from 'path';

export const MailConfig = registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  from: process.env.MAIL_FROM,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
}));

export const loadMailConfig = async (
  mailConfig: ConfigType<typeof MailConfig>,
  templateAdapter: TemplateAdapter,
): Promise<MailerOptions> => {
  return {
    transport: {
      host: mailConfig.host,
      port: mailConfig.port,
      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },
    },
    defaults: {
      from: '"No Reply" <noreply@example.com>',
    },
    template: {
      dir: join(__dirname, 'templates'),
      adapter: templateAdapter,
      options: {
        strict: true,
      },
    },
  };
};
